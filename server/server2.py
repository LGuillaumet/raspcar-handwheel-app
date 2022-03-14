from aiohttp import web
#from media_control import on_client_control
import socketio
#import dbus, dbus.mainloop.glib, sys

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
    #player_iface.Play()
    await sio.emit('play_init',{'title':'Waited For you', 'coverImage':'https://mir-s3-cdn-cf.behance.net/project_modules/1400/0994d841602157.57ac63336b606.jpg','album':'Slow Magic','duration':98000})
    await sio.emit('playing_progress',6000)
    print("Playing")

@sio.event
async def pause_request(sid, msg):
    #player_iface.Pause()
    await sio.emit('pause')
    print("Paused")


@sio.event
async def next_request(sid, msg):
    #player_iface.Next()
    await sio.emit('next')
    print("Next Track")


@sio.event
async def prev_request(sid, msg):
    #player_iface.Previous()
    await sio.emit('prev')
    print("Previous track")

@sio.event
async def volume_change_request(sid, msg):
    #player_iface.Previous()
    await sio.emit('volume_change',msg)
    print("Volume changed "+msg)

app.router.add_static('/static', 'static')
app.router.add_get('/', index)

"""
def on_property_changed(interface, changed, invalidated):
    if interface != 'org.bluez.MediaPlayer1':
        return
    for prop, value in changed.items():
        if prop == 'Status':
            print('Playback Status: {}'.format(value))
        elif prop == 'Track':
            print('Music Info:')
            for key in ('Title', 'Artist', 'Album'):
                print('   {}: {}'.format(key, value.get(key, '')))
"""


if __name__ == '__main__':
    

    web.run_app(app)