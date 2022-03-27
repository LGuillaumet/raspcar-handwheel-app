import asyncio
import json
from aiohttp import web
import socketio
import can
import threading

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

async def index(request):
    """Serve the client-side application."""
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

app.router.add_static('/static', 'static')
app.router.add_get('/', index)

if __name__ == '__main__':

    print("Starting server")
    # FUCKING TRICKS BECAUSE PYTHON IS NOT A FUCKING LANGUAGE TO DO THIS THANKS TO OTHERS GROUPS
    _thread = threading.Thread(target=asyncio.run, args=(readMsgFromSocket(),))
    _thread.start()
    web.run_app(app, port=8086)