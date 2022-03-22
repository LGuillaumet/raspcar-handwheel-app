#[macro_use]
extern crate serde_derive;

mod simulator {
    pub mod models;
}

use futures_util::{StreamExt};
use tokio::task;
use tokio_socketcan::{CANFrame, CANSocket, Error};
use tokio::net::{TcpListener};
use log::*;
use simulator::models::*;
use tokio::sync::mpsc::channel;

async fn handler_websocket(sender: tokio::sync::mpsc::Sender<CarData>) -> Result<(), Error> {

    info!("Start handler websocket.");

    let addr = "0.0.0.0:8080".to_string();

    // Create the event loop and TCP listener we'll accept connections on.
    let try_socket = TcpListener::bind(&addr).await;
    let listener = try_socket.expect("Failed to bind");

    println!("Listening on: {}", addr);

    while let Ok((stream, _)) = listener.accept().await {

        let peer = stream.peer_addr().expect("connected streams should have a peer address");

        info!("Peer address: {}", peer);

        let tx = sender.clone();

        tokio::spawn(async move { 

            let mut ws_stream = tokio_tungstenite::accept_async(stream).await.expect("Failed to accept");

            info!("New WebSocket connection: {}", peer);

            while let Some(msg) = ws_stream.next().await {
                let data = msg.unwrap();
                let data2 = data.to_text().expect("this is not a text");
                let car_data = serde_json::from_str(data2).expect("Can't parse to JSON");
                let _ = tx.send(car_data).await;
            }
        });
    }

    info!("End of handler websocket.");

    Ok(())
}


/*async fn handler_can(mut reader: CANSocket, writer: CANSocket) -> Result<(), Error> {

    info!("Start handler virtual bus can.");

    while let Some(Ok(frame)) = reader.next().await {
        //writer.write_frame(frame)?.await?;
    }

    info!("End of handler virtual bus can.");

    Ok(())
}*/

#[tokio::main]
async fn main() -> Result<(), Error> {

    env_logger::init();

    let mut car_data: CarData = CarData {
        position_light: false,
        cruise_light: false,
        fullhead_light: false,
        motor: false, 
        battery: false,
        handbrake: false,
        turn_signal_right: false,
        turn_signal_left: false,
        air_speed_fan: 0,
        air_temperature: 0
    };

    info!("Start rust simulator.");

    let socket_tx = CANSocket::open("can1")?;
    
    //let task_can = task::spawn(handler_can(socket_rx, socket_tx));

    let (tx, mut rx) = channel(32);

    let task_websocket = task::spawn(handler_websocket(tx));

    while let Some(data) = rx.recv().await {

        let result = car_data.cmp_and_set(data);

        for value in result {
            let frame = CANFrame::new(value.propertie_type, &[value.value], false, false).unwrap();
            let _ = socket_tx.write_frame(frame)?.await;
        }
    }
    info!("Waiting websocket.");
    //let _ = task_can.await;
    let _ = task_websocket.await;

    info!("End of rust simulator.");

    Ok(())
}