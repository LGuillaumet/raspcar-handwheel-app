from aiohttp import web
#from media_control import on_client_control
import socketio
import os
import sys
import dbus
import dbus.service
import dbus.mainloop.glib
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
    print("title", mgr)
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
        print(prop, value)
        if prop == 'Status':
            print('Playback Status: {}'.format(value))
        elif prop == 'Track':
            print('Music Info:')
            for key in ('Title', 'Artist', 'Album'):
                print('   {}: {}'.format(key, value.get(key, '')))
                await sio.emit('play_init',{'title':'Waited For you', 'coverImage':'https://mir-s3-cdn-cf.behance.net/project_modules/1400/0994d841602157.57ac63336b606.jpg','album':'Slow Magic','duration':98000})



SERVICE_NAME = "org.bluez"
ADAPTER_INTERFACE = SERVICE_NAME + ".MediaPlayer1"
bus = dbus.SystemBus()
manager = dbus.Interface(bus.get_object(SERVICE_NAME, "/"),
                    "org.freedesktop.DBus.ObjectManager")
objects = manager.GetManagedObjects()

if __name__ == '__main__':
    for path, ifaces in objects.items():
        adapter = ifaces.get(ADAPTER_INTERFACE)
        if adapter is None:
            continue
        print(path)
        player = bus.get_object('org.bluez',path)
        BT_Media_iface = dbus.Interface(player, dbus_interface=ADAPTER_INTERFACE)
        break

    while 1:
        s = input()
        if s == 'quit': 
            break
        if s == 'play':
            BT_Media_iface.Play()
        if s == 'pause':
            BT_Media_iface.Pause()
        if s == 'stop':
            BT_Media_iface.Stop()
        if s == 'next':
            BT_Media_iface.Next()
        if s == 'pre':
            BT_Media_iface.Previous()
        if s == 'show':
            track =  adapter.get('Track')
            print('Track: ' + str(track))
            print('Title: ' + track.get('Title')) 
            print('Artist: ' + track.get('Artist'))
            print('Album: ' + track.get('Album'))
            print('NumberOfTracks: ' + str(track.get('NumberOfTracks')))
            print('TrackNumber: ' + str(track.get('TrackNumber')))
            print('Duration: ' + str(track.get('Duration')))
