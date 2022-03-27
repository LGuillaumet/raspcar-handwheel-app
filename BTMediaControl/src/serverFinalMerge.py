from aiohttp import web
from gi.repository import GLib
from mediaPlayerBT import MediaPlayer
import asyncio
import dbus
import dbus.mainloop.glib
import json
import logging
import socketio
import threading
import time
import can

sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)


# create a bus instance for reading and writing
readBus = can.ThreadSafeBus(interface='socketcan',
              channel='vcan_tx',
              receive_own_messages=True)

writeBus = can.ThreadSafeBus(interface='socketcan',
              channel='vcan_rx',
              receive_own_messages=True)

class CarState:

    def __init__(self):
        self.position_light = False,
        self.cruise_light = False,
        self.fullhead_light = False,
        self.motor = False, 
        self.battery = False,
        self.handbrake = False,
        self.turn_signal_right = False,
        self.turn_signal_left = False,
        self.air_conditioner = False,
        self.air_speed_fan = 0,
        self.air_temperature = 20,
        self.car_temperature = 20

    def toJSON(self):
        return json.dumps(self, default=lambda o: o.__dict__, indent=4)

carState = CarState()

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


# FROM BUSCAN
async def POSITION_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("POSITION_LIGHT", res)
    carState.position_light = res
    await sio.emit('POSITION_LIGHT', res)

async def CRUISE_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("CRUISE_LIGHT", res)
    carState.cruise_light = res
    await sio.emit('CRUISE_LIGHT', res)

async def FULLHEAD_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("FULLHEAD_LIGHT", res)
    carState.fullhead_light = res
    await sio.emit('FULLHEAD_LIGHT', res)

async def MOTOR_EVENT(bytes) :
    res = bool(bytes)
    print("MOTOR", res)
    carState.motor = res
    await sio.emit('MOTOR', res)

async def BATTERY_EVENT(bytes) :
    res = bool(bytes)
    print("BATTERY", res)
    carState.battery = res
    await sio.emit('BATTERY', res)

async def HANDBRAKE_EVENT(bytes) :
    res = bool(bytes)
    print("HANDBRAKE", res)
    carState.handbrake = res
    await sio.emit('HANDBRAKE', res)

async def TURN_SIGNAL_RIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("TURN_SIGNAL_RIGHT", res)
    carState.turn_signal_right = res
    await sio.emit('TURN_SIGNAL_RIGHT', res)

async def TURN_SIGNAL_LEFT_EVENT(bytes) :
    res = bool(bytes)
    print("TURN_SIGNAL_LEFT", res)
    carState.turn_signal_left = res
    await sio.emit('TURN_SIGNAL_LEFT', res)

async def AIR_CONDITIONER_EVENT(bytes) :
    res = bool(bytes)
    print("AIR_CONDITIONER", res)
    carState.air_conditioner = res
    await sio.emit('AIR_CONDITIONER', res)

async def AIR_SPEEDFAN_EVENT(bytes) :
    res = int(bytes)
    print("AIR_SPEEDFAN", res)
    carState.air_speed_fan = res
    await sio.emit('AIR_SPEEDFAN', res)

async def AIR_TEMPERATURE_EVENT(bytes) :
    res = int(bytes)
    print("AIR_TEMPERATURE", res)
    carState.air_temperature = res
    await sio.emit('AIR_TEMPERATURE', res)

async def CAR_TEMPERATURE_EVENT(bytes) :
    res = int(bytes)
    print("CAR_TEMPERATURE", res)
    carState.car_temperature = res
    await sio.emit('CAR_TEMPERATURE', res)

mapBytesToWSEvent = dict()
mapBytesToWSEvent[1] = POSITION_LIGHT_EVENT
mapBytesToWSEvent[2] = CRUISE_LIGHT_EVENT
mapBytesToWSEvent[3] = FULLHEAD_LIGHT_EVENT
mapBytesToWSEvent[4] = MOTOR_EVENT
mapBytesToWSEvent[5] = BATTERY_EVENT
mapBytesToWSEvent[6] = HANDBRAKE_EVENT
mapBytesToWSEvent[7] = TURN_SIGNAL_RIGHT_EVENT
mapBytesToWSEvent[8] = TURN_SIGNAL_LEFT_EVENT
mapBytesToWSEvent[9] = AIR_CONDITIONER_EVENT
mapBytesToWSEvent[10] = AIR_SPEEDFAN_EVENT
mapBytesToWSEvent[11] = AIR_TEMPERATURE_EVENT
mapBytesToWSEvent[12] = CAR_TEMPERATURE_EVENT

# iterate over received messages from buscan
async def readMsgFromSocket():
    print("Starting thread")
    while True:
        msg = readBus.recv()
        print(msg)
        if msg is not None:
            m = { "ID": msg.arbitration_id, "data": msg.data }
            print(int(msg.arbitration_id))
            await mapBytesToWSEvent[int(msg.arbitration_id)](msg.data[0])

# FROM WEBSOCKET
@sio.event
async def connect(sid, environ):
    print(carState.toJSON())
    await sio.emit("initial_state", carState.toJSON()) #a tester
    print("connect ", sid)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

@sio.event
def air_conditioner(sid, isAirConditionerOn):
    message = can.Message(arbitration_id=9, is_extended_id=True, data=bytearray([int(isAirConditionerOn)]))
    writeBus.send(message, timeout=0.2)
    print('air_conditioner received', isAirConditionerOn)

@sio.event
def air_speedfan(sid, numberToSet):
    message = can.Message(arbitration_id=11, is_extended_id=True, data=bytearray([int(numberToSet)]))
    writeBus.send(message, timeout=0.2)
    print('air_speedfan received', numberToSet)

@sio.event
def air_temperature(sid, numberToSet):
    message = can.Message(arbitration_id=10, is_extended_id=True, data=bytearray([int(numberToSet)]))
    writeBus.send(message, timeout=0.2)
    print('air_temperature received', numberToSet)

@sio.event
async def get_car_state(sid):
    # message = can.Message(arbitration_id=10, is_extended_id=True, data=bytearray([int(numberToSet)]))
    # writeBus.send(message, timeout=0.2)
    await sio.emit("get_car_state", carState.toJSON())
    print('get_car_state received', carState.toJSON())


logger = logging.getLogger(__name__)

# function to answer call
def answer_call(path):
    call = dbus.Interface(bus.get_object('org.ofono', path),
                          'org.ofono.VoiceCall')
    time.sleep(1)
    call.Answer()


def voicecalls_call_added(path, properties):
    print("    Voice Call [ %s ] Added" % (path))

    print(properties.get('LineIdentification'))

    state = properties["State"]
    if state == "incoming":
        print(state)
        # User get a call on is phone trigger PHONE_CALLING
        asyncio.run(PHONE_CALLING(
            True, properties.get('LineIdentification'), path))


def voicecalls_call_removed(path):
    asyncio.run(PHONE_CALLING(False, '', path))

# function to hangup call
def hangup_call(path):
    call = dbus.Interface(bus.get_object('org.ofono', path),
                          'org.ofono.VoiceCall')

    call.Hangup()
    print("    Voice Call [ %s ] Hung up" % (path))


app.router.add_static('/static', 'static')
app.router.add_get('/', index)

if __name__ == "__main__":

    thread3 = threading.Thread(target=asyncio.run, args=(readMsgFromSocket(),))
    thread3.start()

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
    player = MediaPlayer()
    print("Starting server")

    #if player:
    thread1 = threading.Thread(target=asyncio.run, args=(web.run_app(app, port=8085),))
    thread2 = threading.Thread(target=asyncio.run, args=(mainloop.run()))
    thread1.start()
    thread2.start()
