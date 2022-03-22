# raspcar-handwheel-app

#### Connecting to the Raspberry Pi by SSH

User : pi
Password : password

Connecting with the command :
`ssh pi@<ip-address>`

### Preamble

It is important to notice that we cannot be running our application (for the embedded 5" wheel screen) on the same Raspberry Pi at the same time as the other services made for the dashboard screen since we have only one HDMI output.

### Services

We have 3 daemons running at the boot of the Raspberry Pi that you can find in the folder `/etc/systemd/system`

#### raspcar_mediaplayer.service

This is the service that launches the back-end and front-end side of the app by invoking a script in the same folder at `/etc/systemd/system/raspcar.mediaplayer` that calls two other script inside the app folder `/home/pi/Documents/raspcar-handwheel-app-taoufik`:
- server.py (that tracks the different signals on the dbus sent by the mobile phone via bluetooth to apply the corresponding changes on the user interface).
- media_control.py (that tracks the incoming messages from the user interfaces to act upon the media player on the smartphone).

We have to think of the service as a two-way street, from the user interface towards the mobile device or from the mobile device towards the user interface with the raspberry pi in between.

#### raspcar_aplay.service

This is the service that permits the bluetooth stream of music to find its way to the speakers.
It launches a simple script at `/etc/systemd/system/raspcar.aplay` containing the command : `bluealsa-aplay 00:00:00:00:00:00`.

#### nginx.service

This is the service that launches the front-end server.
You can find it at `/lib/systemd/system/nginx.service`.

#### lightdm.service

Finally we have made use of lightdm service to start a full screen web page at a given address.
You can find it at `/lib/systemd/system/lightdm.service`.


The address is held in a variable named $DASHBOARDPAGE under the file `/etc/environment` containing:

DASHBOARDPAGE="http://localhost:80/"

We use this variable in a bash file `~pi/.xsessionrc` that permits us to launch a web page in fullscreen when the Raspberry pi boots. 

To restart the service you can launch the command:
`sudo /etc/init.d/lightdm restart`


VERY IMPORTANT:
We have been using the same files that were being used by the previous group for the dashboard web app only changing the port in the address, from 3000 to 80.
Therefor to see the web page of their web app you will need to change the variable back to :
DASHBOARDPAGE="http://localhost:3000/"

# RUST SIMULATOR

https://doc.rust-lang.org/book/ch01-01-installation.html

curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
cargo new simulator

cargo build
./target/debug/simulator

cd simulator
RUST_LOG=debug cargo run
