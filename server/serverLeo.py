from aiohttp import web
#from media_control import on_client_control
import socketio
import os
import sys
import dbus
import dbus.service
import dbus.mainloop.glib
from gi.repository import GLib
import threading

import argparse
import requests
import bs4
import json
import subprocess

sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

async def index(request):
    """Serve the client-side application."""
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

@sio.event
def connect(sid, environ):
    print("connect ", sid)
    

@sio.event
async def chat_message(sid, data):
    print("message ", data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

@sio.event
async def play_request(sid, msg):
    player_iface.Play()
    print("test")
    print(msg)
    await sio.emit('play_init',{'title':'Waited For you', 'coverImage':'https://mir-s3-cdn-cf.behance.net/project_modules/1400/0994d841602157.57ac63336b606.jpg','album':'Slow Magic','duration':98000})
    await sio.emit('playing_progress',6000)
    print("Playing")

@sio.event
async def pause_request(sid, msg):
    player_iface.Pause()
    await sio.emit('pause')
    print("Paused")


@sio.event
async def next_request(sid, msg):
    player_iface.Next()
    await sio.emit('next')
    print("Next Track")
    track =  adapter.get('Track')
    print('Track: ' + str(track))
    print('Title: ' + track.get('Title')) 


@sio.event
async def prev_request(sid, msg):
    player_iface.Previous()
    await sio.emit('prev')
    print("Previous track")

@sio.event
async def volume_change_request(sid, msg):
    #player_iface.Previous()
    print(msg)
    vol = int(msg)
    print("Volume to set: ", vol)
    if vol not in range(0, 128):
        print('Possible Values: 0-127')
        return True
    transport_prop_iface.Set(
            'org.bluez.MediaTransport1',
            'Volume',
            dbus.UInt16(vol))
    await sio.emit('volume_change',msg)
    print("Volume changed "+msg)



app.router.add_static('/static', 'static')
app.router.add_get('/', index)

async def on_property_changed(interface, changed, invalidated):
    if interface != 'org.bluez.MediaPlayer1':
        return
    for prop, value in changed.items():
        if prop == 'Status':
            print('Playback Status: {}'.format(value))
        elif prop == 'Track':
            print('Music Info:')
            for key in ('Title', 'Artist', 'Album'):
                print('   {}: {}'.format(key, value.get(key, '')))


if __name__ == '__main__':
    dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)
    bus = dbus.SystemBus()
    obj = bus.get_object('org.bluez', "/")
    mgr = dbus.Interface(obj, 'org.freedesktop.DBus.ObjectManager')
    player_iface = None
    transport_prop_iface = None
    for path, ifaces in mgr.GetManagedObjects().items():
        if 'org.bluez.MediaPlayer1' in ifaces:
            player_iface = dbus.Interface(
                    bus.get_object('org.bluez', path),
                    'org.bluez.MediaPlayer1')
        elif 'org.bluez.MediaTransport1' in ifaces:
            transport_prop_iface = dbus.Interface(
                    bus.get_object('org.bluez', path),
                    'org.freedesktop.DBus.Properties')
    if not player_iface:
        sys.exit('Error: Media Player not found.')
    if not transport_prop_iface:
        sys.exit('Error: DBus.Properties iface not found.')

    bus.add_signal_receiver(
            on_property_changed,
            bus_name='org.bluez',
            signal_name='PropertiesChanged',
            dbus_interface='org.freedesktop.DBus.Properties')

    if player_iface:
        web.run_app(app, port=8087)
    
