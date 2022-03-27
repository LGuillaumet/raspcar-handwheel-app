import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import _ from 'lodash';

import { io } from 'socket.io-client';

import PropTypes from 'prop-types';
import * as event from './utils/socket.events';

export const SocketContext = createContext();

export const useSocketCarInformations = () => useContext(SocketContext);

export const SocketProvider = ({ ENDPOINT, children }) => {
  const [player, setPlayer] = useState({
    title: 'Title',
    album: 'Album',
    coverImage: '',
    volume: 0,
    progress: '0',
    duration: '0',
    isPlaying: false,
  });

  const [carCondition, setCarCondition] = useState({
    positionLight: false,
    cruiseLight: false,
    fullheadLight: false,
    motorProblem: false,
    batteryProblem: false,
    handbrakeProblem: false,
    turnRight: false,
    turnLeft: false,
  });

  const [carTemperature, setCarTemperature] = useState({
    airSpeedFan: 0,
    airTemperature: 0,
    airCarTemperature: 0,
    airConditioner: false,
  });

  const [phone, setPhone] = useState({
    isCalling: false,
    callAnswered: false,
    callHangup: false,
    phoneNumber: '',
    path: '',
  });

  let timer;
  const t = () => {
    timer = setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        progress: `${_.toNumber(p.progress) + 1000}`,
      }));
      if (timer) {
        t();
      }
    }, 1000);
  };

  const pause = () => {
    clearTimeout(timer);
    setPlayer((p) => ({ ...p, isPlaying: false }));
  };
  const play = () => {
    setPlayer((p) => ({ ...p, isPlaying: true }));
    if (timer) {
      clearTimeout(timer);
    }
    t();
  };

  let socket = null;

  const onEmit = (e, data) => {
    if (socket) {
      socket.emit(e, data);
    }
  };

  useEffect(() => {
    socket = io.connect(ENDPOINT);
    // socket.emit(request.VOLUME_CHANGE_REQUEST, 75);
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

    socket.on('connect', () => {
      console.log('LOGGED IN', socket); // x8WIv7-mJelg7on_ALbx
    });

    socket.on('initial_state', (data) => {
      console.log(data);
    });

    socket.on('POSITION_LIGHT', (res) => {
      setCarCondition((prev) => ({ ...prev, positionLight: res }));
    });

    socket.on('CRUISE_LIGHT', (res) => {
      setCarCondition((prev) => ({ ...prev, cruiseLight: res }));
    });

    socket.on('FULLHEAD_LIGHT', (res) => {
      setCarCondition((prev) => ({ ...prev, fullheadLight: res }));
    });

    socket.on('MOTOR', (res) => {
      setCarCondition((prev) => ({ ...prev, motorProblem: res }));
    });

    socket.on('BATTERY', (res) => {
      setCarCondition((prev) => ({ ...prev, batteryProblem: res }));
    });

    socket.on('HANDBRAKE', (res) => {
      setCarCondition((prev) => ({ ...prev, handbrakeProblem: res }));
    });

    socket.on('TURN_SIGNAL_RIGHT', (res) => {
      setCarCondition((prev) => ({ ...prev, turnRight: res }));
    });

    socket.on('TURN_SIGNAL_LEFT', (res) => {
      setCarCondition((prev) => ({ ...prev, turnLeft: res }));
    });

    socket.on('AIR_SPEEDFAN', (res) => {
      setCarTemperature((prev) => ({ ...prev, airSpeedFan: res }));
    });

    socket.on('AIR_TEMPERATURE', (res) => {
      setCarTemperature((prev) => ({ ...prev, airTemperature: res }));
    });

    socket.on('CAR_TEMPERATURE', (res) => {
      setCarTemperature((prev) => ({ ...prev, carTemperature: res }));
    });

    socket.on('AIR_CONDITIONER', (res) => {
      setCarTemperature((prev) => ({ ...prev, airConditioner: res }));
    });

    socket.on('PHONE_CALLING', (res) => {
      console.log('PHONE_CALLING', res);
      // setPhone((prev) => ({
      //   ...prev,
      //   isCalling: boolVal,
      //   phoneNumber,
      //   path,
      // }));
    });

    socket.on('ANWSER_CALL', () => {
      setPhone((prev) => ({ ...prev, callAnswered: true }));
    });

    socket.on('HANGUP_CALL', () => {
      setPhone((prev) => ({ ...prev, callHangup: true }));
    });
  }, []);

  const value = useMemo(
    () => ({
      player,
      carCondition,
      carTemperature,
      phone,
      onEmit,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [carCondition, carTemperature, phone, player]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  ENDPOINT: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
