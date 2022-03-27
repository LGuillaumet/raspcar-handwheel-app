from aiohttp import web
import socketio
from mediaPlayerBT import MediaPlayer
import time


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
    print("pause_request")
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



app.router.add_static('/static', 'static')
app.router.add_get('/', index)

if __name__ == '__main__':
    player = MediaPlayer()
    print("Starting server")

    if player:
        web.run_app(app, port=8085)
    
