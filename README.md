# raspcar-handwheel-app

#### Connecting to the Raspberry Pi by SSH

User : pi
Password : password

Connecting with the command :
`ssh pi@<ip-address>`

# Video 
<a href="http://www.youtube.com/watch?feature=player_embedded&v=Clhjr_MjwWE
" target="_blank"><img src="https://i.ytimg.com/vi_webp/Clhjr_MjwWE/maxresdefault.webp" 
alt="raspcar" width="480" height="280" border="10" /></a>

### Rapscar

Ce projet contient plusieurs dossier : 

- Le dossier app contient l'interface web interactive faite en React. 

Pour l'utiliser vous devrez faire un préalable npm i puis npm start. Les différents scripts sont dans le fichier package.json

Vous pouvez directement faire tourner le projet React sur votre ordinateur et préciser l'adresse ip du raspberry pi dans la variable ENDPOINT du fichier main.jsx pour vous connecter au serveur python.

- Le dossier BTMediaControl qui va contenir le classe mediaPlayerBT.py et le fichier serverFinalMerge.py vous pouvez lancer le server avec python ou nodemon
``` 
nodemon serverFinalMerge.py
```
Le serveur fonctionne va communiquer avec nos différents services à l'aide de websockets.

Pour installer les différentes dépendances python vous pouvez aller dans le fichier requierments et faire 
```
pip install -r requirements-dev
 ```

- Le dossier script va contenir plusieurs script pour lancer différents services. 
  - Le fichier startup.sh lance l'intégralité du projet. Si vous ne pouvez pas le lancer il va falloir installer les dépendances manquantes avec pip install ou apt-get install. 

# Interface Simultor

- L'interface simulateur a été réalisée avec Angular. Comme pour React vous pouvez lancer le projet Angular avec npm.
  - Vous aurez sûrement besoin d'angular cli https://angular.io/cli


## RUST SIMULATOR

## Install virtual can 

sudo modprobe vcan

sudo ip link add dev vcan_tx type vcan
sudo ip link set up vcan_tx

sudo ip link add dev vcan_rx type vcan
sudo ip link set up vcan_rx

## Install rust and execute

https://doc.rust-lang.org/book/ch01-01-installation.html

curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
cargo new simulator

cargo build
./target/debug/simulator

cd simulator
RUST_LOG=debug cargo run

fuser -k 8086/tcp

## Command can 

sudo apt-get install can-utils

- show live bus can : candump can1
- send : cansend vcan_rx 00A#15


# Ce qui n'a pas été fait :
- Gestion du micro. 
- Gestion du son.
- Synchronisation bidirectionelle entre le smartphone et le rraspberrypi pour le lecteur de musique. (Quand l'utilisateur fait pause sur son smartphone, l'interface n'est pas mise à jour sur le React).
- Connecter le simulateur physique.


# Ce qui peut être amélioré : 
- Les events du simulateur virtuel.
- Le style des sliders (React).
- Empêcher Swiper (Module utilisé dans React pour naviguer entre les menus) de changer de menu lors d'un input sur un bouton.
- La gestion des threads python dans le fichier serverFinalMerge.py (Voir threadpool)

