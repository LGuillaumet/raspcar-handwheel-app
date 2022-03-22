import { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { io } from 'socket.io-client';
// eslint-disable-next-line import/no-unresolved

import { Swiper, SwiperSlide } from 'swiper/react';
import AudioPlayer from './component/AudioPlayer/AudioPlayer';
import { HomeScreen } from './component/HomeScreen/HomeScreen';
import { PhoneScreen } from './component/PhoneScreen/PhoneScreen';
import { CarConditionScreen } from './component/CarConditionScreen/CarConditionScreen';

import * as event from './utils/socket.events';
import * as request from './utils/socket.requests';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import './App.scss';

// const ENDPOINT = 'https://raspcar.loca.lt'
const ENDPOINT = '192.168.144.29:8085';
let socket;
const App = () => {
  let timer;
  const t = () => {
    timer = setTimeout(() => {
      setPlayer((p) => ({ ...p, progress: `${_.toNumber(p.progress) + 1000}` }));
      if (timer) { t(); }
    }, 1000);
  };

  const [player, setPlayer] = useState({
    title: 'Title',
    album: 'Album',
    coverImage:
      'https://sverigesradio.se/dist/images/album-cover-placeholder-light.png',
    volume: 0,
    progress: '0',
    duration: '0',
    isPlaying: false,
  });

  const onEmit = (e, data) => {
    socket.emit(e, data);
  };
  const pause = () => {
    clearTimeout(timer);
    setPlayer((p) => ({ ...p, isPlaying: false }));
  };
  const play = () => {
    setPlayer((p) => ({ ...p, isPlaying: true }));
    if (timer) { clearTimeout(timer); }
    t();
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit(request.VOLUME_CHANGE_REQUEST, 75);
    socket.on(event.PLAY_INIT, (data) => {
      setPlayer((p) => ({
        ...p,
        isPlaying: true,
        title: data.title,
        album: data.album,
        coverImage: data.coverImage,
        duration: data.duration,
      }));
    });
    socket.on(event.TRACK, (data) => {
      setPlayer((p) => ({
        ...p,
        isPlaying: true,
        title: data.title,
        album: data.album,
        // coverImage: data.coverImage,
        duration: data.duration,
      }));
      // play()
    });
    socket.on(event.PLAY, (data) => {
      play();
    });
    socket.on(event.NEXT, (data) => {
      setPlayer((p) => ({ ...p, progress: '0' }));
      play();
    });
    socket.on(event.PREV, (data) => {
      setPlayer((p) => ({ ...p, progress: '0' }));
      play();
    });
    socket.on(event.PAUSE, (data) => {
      pause();
    });
    socket.on(event.VOLUME_CHANGE, (v) => {
      setPlayer((p) => ({ ...p, volume: v }));
    });
    socket.on(event.PLAYING_PROGRESS, (time) => {
      setPlayer((p) => ({ ...p, progress: time }));
    });
    socket.on('connect', (soc) => {
      // console.log('LOGGED IN', socket) // x8WIv7-mJelg7on_ALbx
    });
  }, [pause, play]);

  return (
    <div>
      <Swiper
        className="center"
        direction="horizontal"
        resistanceRatio={2}
        simulateTouch
        longSwipes
        loop
        onSlideChange={() => console.log('slide change')}
        onSwiper={(swiper) => console.log(swiper)}
        slidesPerView={1}
      >
        <SwiperSlide>
          <HomeScreen />
        </SwiperSlide>
        <SwiperSlide>
          <AudioPlayer player={player} emit={onEmit} />
        </SwiperSlide>
        <SwiperSlide>
          <PhoneScreen />
        </SwiperSlide>
        <SwiperSlide>
          <CarConditionScreen />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default App;
