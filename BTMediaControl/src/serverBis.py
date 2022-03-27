import asyncio
import json
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


class PhoneState:

    def __init__(self):
        self.isCalling = False,
        self.path = '',
        self.phoneNumber = '',
        self.callAnswered = False

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)


phoneState = PhoneState()


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
    await sio.emit('play_init', {'title': info.get('Title'), 'coverImage': 'https://icons-for-free.com/iconfiles/png/512/logo+music+network+social+icon-1320086278635471580.png', 'album': info.get('Album'), 'duration': info.get('Duration'), 'artist': info.get('Artist')})
    await sio.emit('playing_progress', 6000)
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
    await sio.emit('play_init', {'title': info.get('Title'), 'coverImage': 'https://icons-for-free.com/iconfiles/png/512/logo+music+network+social+icon-1320086278635471580.png', 'album': info.get('Album'), 'duration': info.get('Duration'), 'artist': info.get('Artist')})
    showInfos = info.get('Title')
    print("Infos", showInfos)


@sio.event
async def prev_request(sid, msg):
    player.Previous()
    await sio.emit('prev')
    print("Previous track")


@sio.event
async def mute_microphone(sid, boolVal):
    print("mute_microphone", boolVal)


@sio.event
async def mute_sound(sid, boolVal):
    print("mute_microphone", boolVal)


@sio.event
async def answer_call_request(sid, path):
    print("answer_call request")
    answer_call(path)
    phoneState.isCalling = False
    phoneState.path = path
    await sio.emit('ANWSER_CALL', phoneState.toJSON())


@sio.event
async def hangup_call_request(sid, path):
    print("hangup_call request")
    hangup_call(path)
    phoneState.isCalling = False
    phoneState.path = path
    await HANGUP_CALL_EVENT()


async def HANGUP_CALL_EVENT():
    print("HANGUP_CALL")
    phoneState.isCalling = False
    phoneState.path = ''
    phoneState.callAnswered = False
    await sio.emit('HANGUP_CALL', phoneState.toJSON())


async def PHONE_CALLING(boolVal, phoneNumber, path):
    phoneState.isCalling = boolVal
    phoneState.phoneNumber = phoneNumber
    phoneState.path = path
    await sio.emit('PHONE_CALLING', phoneState.toJSON())


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
    time.sleep(1)
    call.Answer()
    # print("    Voice Call [ %s ] Answered" % (path))


def voicecalls_call_added(path, properties):
    print("    Voice Call [ %s ] Added" % (path))

    print(properties.get('LineIdentification'))

    state = properties["State"]
    if state == "incoming":
        print(state)
        # User get a call on is phone trigger PHONE_CALLING
        asyncio.run(PHONE_CALLING(
            True, properties.get('LineIdentification'), path))

    # Test du hung up, ca raccroche de suite
    # if state == "incoming":
    #	hangup_call(path)


def voicecalls_call_removed(path):
    asyncio.run(PHONE_CALLING(False, '', path))


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
    manager = dbus.Interface(bus.get_object(
        'org.ofono', '/'), 'org.ofono.Manager')
    modems = manager.GetModems()
    modem = modems[0][0]

    print("Using modem %s" % modem)

    vcmanager = dbus.Interface(bus.get_object(
        'org.ofono', modem), 'org.ofono.VoiceCallManager')
    vcmanager.connect_to_signal("CallAdded", voicecalls_call_added)
    vcmanager.connect_to_signal("CallRemoved", voicecalls_call_removed)

    mainloop = GLib.MainLoop()
    # mainloop.run()
    player = MediaPlayer()
    print("Starting server")

    if player:
        thread1 = threading.Thread(
            target=asyncio.run, args=(web.run_app(app, port=8085),))
        thread2 = threading.Thread(target=asyncio.run, args=(mainloop.run()))
        thread1.start()
        thread2.start()
