import './App.css'
import AudioPlayer from './component/AudioPlayer/AudioPlayer'
import React, { useState, useEffect } from 'react'

import _ from 'lodash'
import * as event from './utils/socket.events'
import * as request from './utils/socket.requests'
import { io } from 'socket.io-client'
// const ENDPOINT = 'https://raspcar.loca.lt'
const ENDPOINT = 'localhost:8080'
let socket
function App() {
  let timer
  const t = () => {
    timer = setTimeout(() => {
      setPlayer((p) => ({ ...p, progress: (_.toNumber(p.progress) + 1000)+'' }))
        if(timer)
          t()
      }, 1000)
    
  }
  

  const [player, setPlayer] = useState({
    title: 'Title',
    album: 'Album',
    coverImage:
      'https://sverigesradio.se/dist/images/album-cover-placeholder-light.png',
    volume: 0,
    progress: '0',
    duration: '0',
    isPlaying: false,
  })
  const onEmit = (event, data) => {
    socket.emit(event, data)
  }
  const pause = () => {
    clearTimeout(timer)
    setPlayer((p) => ({ ...p, isPlaying: false }))
  }
  const play = () => {
    setPlayer((p) => ({ ...p, isPlaying: true }))
    if (timer)
      clearTimeout(timer)
    t()
  }
  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit(request.VOLUME_CHANGE_REQUEST, 75)
    socket.on(event.PLAY_INIT, (data) => {
      setPlayer((p) => ({
        ...p,
        isPlaying: true,
        title: data.title,
        album: data.album,
        coverImage: data.coverImage,
        duration: data.duration,
      }))
    })
    socket.on(event.TRACK, (data) => {
      setPlayer((p) => ({
        ...p,
        isPlaying: true,
        title: data.title,
        album: data.album,
        // coverImage: data.coverImage,
        duration: data.duration,
      }))
      // play()
    })
    socket.on(event.PLAY, (data) => {
      play()
    })
    socket.on(event.NEXT, (data) => {
      setPlayer((p) => ({ ...p, progress: '0' }))
      play()
    })
    socket.on(event.PREV, (data) => {
      setPlayer((p) => ({ ...p, progress: '0' }))
      play()
    })
    socket.on(event.PAUSE, (data) => {
      pause()
    })
    socket.on(event.VOLUME_CHANGE, (v) => {
      setPlayer((p) => ({ ...p, volume: v }))
    })
    socket.on(event.PLAYING_PROGRESS, (t) => {
      setPlayer((p) => ({ ...p, progress: t }))
    })
    socket.on('connect', (socket) => {
      // console.log('LOGGED IN', socket) // x8WIv7-mJelg7on_ALbx
    })
  }, [])
  return (
    <div>
      <AudioPlayer player={player} emit={onEmit} />
    </div>
  )
}

export default App
