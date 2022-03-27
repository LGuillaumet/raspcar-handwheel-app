import asyncio
import threading
from aiohttp import web
import socketio
from mediaPlayerBT import MediaPlayer
import time

from gi.repository import GLib

import logging
import dbus
import dbus.mainloop.glib


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
    info = player.GetTrackInfo()
    player.Play()
    await sio.emit('play_init',{'title':info.get('Title'), 'coverImage':'https://icons-for-free.com/iconfiles/png/512/logo+music+network+social+icon-1320086278635471580.png','album':info.get('Album'),'duration':info.get('Duration'),'artist':info.get('Artist')})
    await sio.emit('playing_progress',6000)
    print("Playing")

@sio.event
async def pause_request(sid, msg):
    player.Pause()
    await sio.emit('pause')
    print("Paused")


@sio.event
async def next_request(sid, msg):
    player.Next()
    await sio.emit('next')
    time.sleep(2.5)
    info = player.GetTrackInfo()
    await sio.emit('play_init',{'title':info.get('Title'), 'coverImage':'https://icons-for-free.com/iconfiles/png/512/logo+music+network+social+icon-1320086278635471580.png','album':info.get('Album'),'duration':info.get('Duration'),'artist':info.get('Artist')})
    showInfos = info.get('Title')
    print("Infos", showInfos)

    


@sio.event
async def prev_request(sid, msg):
    player.Previous()
    await sio.emit('prev')
    print("Previous track")

@sio.event
async def prev_request(sid, msg):
    player.Previous()
    await sio.emit('prev')
    print("Previous track")

# @sio.event
# async def volume_change_request(sid, msg):
#     #player_iface.Previous()
#     print(msg)
#     vol = int(msg)
#     print("Volume to set: ", vol)
#     if vol not in range(0, 128):
#         print('Possible Values: 0-127')
#         return True
#     transport_prop_iface.Set(
#             'org.bluez.MediaTransport1',
#             'Volume',
#             dbus.UInt16(vol))
#     await sio.emit('volume_change',msg)
#     print("Volume changed "+msg)


logger = logging.getLogger(__name__)

def answer_call(path):
	call = dbus.Interface(bus.get_object('org.ofono', path),
						'org.ofono.VoiceCall')
	time.sleep(2)	
	call.Answer()
	print("    Voice Call [ %s ] Answered" % (path))

async def voicecalls_call_added(path, properties):
	print("    Voice Call [ %s ] Added" % (path))

	print(properties.get('LineIdentification'))
	
	""" for key in properties.keys():
		val = str(properties[key])
		print("        %s = %s" % (key, val)) """
	print()

	state = properties["State"]
	if state == "incoming":
		await sio.emit('phone_calling', True)

	# 	answer_call(path)
	
	#Test du hung up, ca raccroche de suite
	#if state == "incoming":
	#	hangup_call(path)

def voicecalls_call_removed(path):
	print("    Voice Call [ %s ] Removed" % (path))
	print()

def hangup_call(path):
	call = dbus.Interface(bus.get_object('org.ofono', path),
						'org.ofono.VoiceCall')

	call.Hangup()
	print("    Voice Call [ %s ] Hung up" % (path))


app.router.add_static('/static', 'static')
app.router.add_get('/', index)

if __name__ == "__main__":
	
	global vcmanager

	dbus.mainloop.glib.DBusGMainLoop(set_as_default=True)

	bus = dbus.SystemBus()
	manager = dbus.Interface(bus.get_object('org.ofono', '/'), 'org.ofono.Manager')
	modems = manager.GetModems()
	modem = modems[0][0]

	print("Using modem %s" % modem)

	vcmanager = dbus.Interface(bus.get_object('org.ofono', modem), 'org.ofono.VoiceCallManager')
	vcmanager.connect_to_signal("CallAdded", voicecalls_call_added)
	vcmanager.connect_to_signal("CallRemoved", voicecalls_call_removed)

	mainloop = GLib.MainLoop()
	#mainloop.run()
	player = MediaPlayer()
	print("Starting server")

	if player:
		_thread = threading.Thread(target=asyncio.run, args=(web.run_app(app, port=8085),))
		_thread.start()

	mainloop.run()

	