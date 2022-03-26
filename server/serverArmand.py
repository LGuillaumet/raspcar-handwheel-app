import asyncio
from aiohttp import web
import socketio
import can
import threading

sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

# create a bus instance
# change to vcan_tx for reading
# add vcan_rx for writing
readBus = can.ThreadSafeBus(interface='socketcan',
              channel='can1',
              receive_own_messages=True)

# writeBus = can.ThreadSafeBus(interface='socketcan',
#               channel='vcan_rx',
#               receive_own_messages=True)

# send a message
#message = can.Message(arbitration_id=123, is_extended_id=True, data=[0x11, 0x22, 0x33])
#bus.send(message, timeout=0.2)

# FROM BUSCAN
async def POSITION_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("POSITION_LIGHT", res)
    await sio.emit('POSITION_LIGHT', res)

async def CRUISE_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("CRUISE_LIGHT", res)
    await sio.emit('CRUISE_LIGHT', res)

async def FULLHEAD_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("FULLHEAD_LIGHT", res)
    await sio.emit('FULLHEAD_LIGHT', res)

async def MOTOR_EVENT(bytes) :
    res = bool(bytes)
    print("MOTOR", res)
    await sio.emit('MOTOR', res)

async def BATTERY_EVENT(bytes) :
    res = bool(bytes)
    print("BATTERY", res)
    await sio.emit('BATTERY', res)

async def HANDBRAKE_EVENT(bytes) :
    res = bool(bytes)
    print("HANDBRAKE", res)
    await sio.emit('HANDBRAKE', res)

async def TURN_SIGNAL_RIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("TURN_SIGNAL_RIGHT", res)
    await sio.emit('TURN_SIGNAL_RIGHT', res)

async def TURN_SIGNAL_LEFT_EVENT(bytes) :
    res = bool(bytes)
    print("TURN_SIGNAL_LEFT", res)
    await sio.emit('TURN_SIGNAL_LEFT', res)

async def AIR_CONDITIONER_EVENT(bytes) :
    res = bool(bytes)
    print("AIR_CONDITIONER", res)
    await sio.emit('AIR_CONDITIONER', res)

async def AIR_SPEEDFAN_EVENT(bytes) :
    res = int(bytes)
    print("AIR_SPEEDFAN", res)
    await sio.emit('AIR_SPEEDFAN', res)

async def AIR_TEMPERATURE_EVENT(bytes) :
    res = int(bytes)
    print("AIR_TEMPERATURE", res)
    await sio.emit('AIR_TEMPERATURE', res)

async def CAR_TEMPERATURE_EVENT(bytes) :
    res = int(bytes)
    print("CAR_TEMPERATURE", res)
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
def connect(sid, environ):
    print("connect ", sid)
    
@sio.event
async def chat_message(sid, data):
    print("message ", data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

@sio.event
def air_conditioner(sid, isAirConditionerOn):
    print('air_conditioner received', isAirConditionerOn)

@sio.event
def air_speedfan(sid, numberToSet):
    print('air_speedfan received', numberToSet)

@sio.event
def air_temperature(sid, numberToSet):
    print('air_temperature received', numberToSet)

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