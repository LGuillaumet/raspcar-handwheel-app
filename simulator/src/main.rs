#[macro_use]
extern crate serde_derive;

mod simulator {
    pub mod models;
}

use futures_util::{StreamExt};
use tokio::task;
use tokio_socketcan::{CANFrame, CANSocket, Error};
use log::*;
use simulator::models::*;
use tokio::sync::mpsc::channel;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use simple_websockets::{Event, Responder};

type CarDataMutex = Arc<Mutex<CarData>>;
type CanReceiverFn = fn(CarDataMutex, &[u8], HashMap<u64, Responder>) -> ();

async fn handler_websocket(sender: tokio::sync::mpsc::Sender<CarData>, mut map: HashMap<u64, Responder>){

    let tx = sender.clone();
    let event_hub = simple_websockets::launch(8080).expect("Failed to listen on port 8080 \u{1F914}");

    loop {
        match event_hub.poll_event() {
            Event::Connect(client_id, responder) => {
                info!("A client connected with id #{} \u{1F60E}", client_id);
                map.insert(client_id, responder);
            },
            Event::Disconnect(client_id) => {
                info!("Client #{} disconnected \u{1F622}", client_id);
                map.remove(&client_id);
            },
            Event::Message(client_id, message) => {
                if let simple_websockets::Message::Text(data) = message {
                    info!("Received a message from client #{}: {:?}", client_id, data);
                    let value = data.as_str();
                    let car_data: CarData = serde_json::from_str(value).expect("Can't parse to JSON");
                    let _ = tx.send(car_data).await;
                }
            }
        }
    }
}

async fn reader_can(mut reader: CANSocket, datamutex: CarDataMutex, dict: HashMap<u32, CanReceiverFn>, map: HashMap<u64, Responder>) -> Result<(), Error> {

    info!("Start Reader virtual bus can.");

    while let Some(Ok(frame)) = reader.next().await {
        info!("Event bus can : ID {} - DATA {:X?}", frame.id(), frame.data());
        let result: Option<&CanReceiverFn> = dict.get(&frame.id());
        match result {
            Some(x) => x(datamutex.clone(), frame.data(), map.clone()),
            None    => info!("\u{1F622} Handler not implemented \u{1F622}"),
        }
    }

    info!("End of handler virtual bus can.");

    Ok(())
}

fn handler_can_air_speed_fan_rw(datamutex: CarDataMutex, data: &[u8], map: HashMap<u64, Responder>) {
    let car = datamutex.lock().unwrap();
    let mut inner: CarData = *car;
    inner.air_speed_fan = data[0];
    let toto = serde_json::to_string(&inner).expect("cannot serialize value");
    for (_, value) in map {
        value.send(simple_websockets::Message::Text(toto.clone()));
    }
}

fn handler_can_air_temperature_rw(datamutex: CarDataMutex, data: &[u8], map: HashMap<u64, Responder>) {
    let car = datamutex.lock().unwrap();
    let mut inner: CarData = *car;
    inner.air_temperature = data[0];
    let toto = serde_json::to_string(&inner).expect("cannot serialize value");
    for (_, value) in map {
        value.send(simple_websockets::Message::Text(toto.clone()));
    }
}

#[tokio::main]
async fn main() -> Result<(), Error> {

    env_logger::init();

    info!("Start Rust simulator \u{1F60E}");

    // CarData thread safe
    let datamutex = Arc::new(Mutex::new(CarData {
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
    }));

    // Dictionnary of callback function for event received from buscan
    let mut dict: HashMap<u32, CanReceiverFn> = HashMap::new();
    let clients: HashMap<u64, Responder> = HashMap::new();
    dict.insert(9, handler_can_air_speed_fan_rw);
    dict.insert(10, handler_can_air_temperature_rw);

    // Setup buscan
    let socket_rx = CANSocket::open("vcan_rx")?;
    let socket_tx = CANSocket::open("vcan_tx")?;
    
    let (tx, mut rx) = channel(32);

    // Create and start thread to handle : 
    // - new incomming event buscan
    // - message from websocket
    let task_can = task::spawn(reader_can(socket_rx, datamutex.clone(), dict, clients.clone()));
    let task_websocket = task::spawn(handler_websocket(tx, clients.clone()));

    let data_lock_mutex: CarDataMutex = datamutex.clone();

    while let Some(data) = rx.recv().await {

        let mut data_car = data_lock_mutex.lock().unwrap();
        let result = data_car.cmp_and_set(data);

        for value in result {
            let frame = CANFrame::new(value.propertie_type, &[value.value], false, false).unwrap();
            let _ = socket_tx.write_frame(frame)?.await;
        }
    }

    let _ = task_can.await;
    let _ = task_websocket.await;

    info!("End of rust simulator.");

    Ok(())
}