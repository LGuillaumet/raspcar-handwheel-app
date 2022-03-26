import asyncio
from threading import Thread
import time
import socketio
import can

loop = asyncio.get_event_loop()
sio = socketio.AsyncClient()
start_timer = None

bus = can.ThreadSafeBus(interface='socketcan',
              channel='can1',
              receive_own_messages=True)

async def POSITION_LIGHT_EVENT(bytes) :
    res = bool(bytes)
    print("POSITION_LIGHT", res)
    await sio.emit("buscan_proxy", res)

mapBytesToWSEvent = dict()
mapBytesToWSEvent[1] = POSITION_LIGHT_EVENT

async def readMsgFromSocket():
    while True :
        msg = bus.recv(timeout=2)
        if msg is not None:
            m = { "ID": msg.arbitration_id, "data": msg.data }
            await mapBytesToWSEvent[int(msg.arbitration_id)](msg.data[0])

# async def send_ping():
#     global start_timer
#     start_timer = time.time()
#     await sio.emit('ping_from_client')

@sio.event
async def connect():
    print('connected to server')
    await sio.emit("begin_proxy")

@sio.event
async def disconnect():
    print('disconnected to server')
    await sio.connect('http://localhost:8086')

# @sio.event
# async def pong_from_server():
#     global start_timer
#     latency = time.time() - start_timer
#     print('latency is {0:.2f} ms'.format(latency * 1000))
#     await sio.sleep(1)
#     if sio.connected:
#         await send_ping()


async def start_server():
    await sio.connect('http://localhost:8087')
    #await readMsgFromSocket()
    _thread = Thread(target=asyncio.run, args=(readMsgFromSocket(),))
    _thread.start()
    await sio.wait()

if __name__ == '__main__':
    loop.run_until_complete(start_server())