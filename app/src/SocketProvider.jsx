/* eslint-disable no-console */
import React, {
  createContext,
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
  const [socket, setSocket] = useState(null);
  const [player, setPlayer] = useState({
    title: 'Title',
    album: 'Album',
    artist: 'Artist',
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
    setPlayer((p) => ({ ...p, isPlaying: false }));
    if (timer) {
      clearTimeout(timer);
    }
  };
  const play = () => {
    setPlayer((p) => ({ ...p, isPlaying: true }));
    if (timer) {
      clearTimeout(timer);
    }
    t();
  };

  const onEmit = (e, data) => {
    if (socket) {
      console.log('emit', e, data);
      socket.emit(e, data);
    }
  };

  useEffect(() => {
    const newSocket = io(ENDPOINT);
    setSocket(newSocket);
    // return () => newSocket.close();
  }, [setSocket]);

  useEffect(() => {
    if (socket) {
      console.log('socket connected');

      socket.on('track_info', (data) => {
        setPlayer((p) => ({
          ...p,
          album: data.album,
          artist: data.artist,
          coverImage: data.coverImage,
          duration: data.duration,
          title: data.title,
          progress: data.progress,
        }));
        if (timer) {
          clearTimeout(timer);
        }
        t();
      });

      socket.on(event.PLAY_INIT, (data) => {
        setPlayer((p) => ({
          ...p,
          album: data.album,
          artist: data.artist,
          coverImage: data.coverImage,
          duration: data.duration,
          isPlaying: true,
          title: data.title,
        }));
        if (timer) {
          clearTimeout(timer);
        }
        t();
      });
      socket.on(event.TRACK, (data) => {
        setPlayer((p) => ({
          ...p,
          album: data.album,
          artist: data.artist,
          duration: data.duration,
          isPlaying: true,
          title: data.title,
        }));
        // play()
      });
      socket.on(event.PLAY, () => {
        play();
      });
      socket.on(event.NEXT, () => {
        setPlayer((p) => ({ ...p, progress: '0' }));
        play();
      });
      socket.on(event.PREV, () => {
        setPlayer((p) => ({ ...p, progress: '0' }));
        play();
      });
      socket.on(event.PAUSE, () => {
        console.log('pause');
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
        console.log('car initial state', JSON.parse(data));
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
        const resPhoneState = JSON.parse(res);
        setPhone((prev) => ({
          ...prev,
          isCalling: resPhoneState.isCalling,
          phoneNumber: resPhoneState.phoneNumber,
          path: resPhoneState.path,
        }));
      });

      socket.on('ANWSER_CALL', (res) => {
        const resPhoneState = JSON.parse(res);
        setPhone((prev) => ({
          ...prev,
          isCalling: false,
          path: resPhoneState.path,
          callAnswered: true,
        }));
      });

      socket.on('HANGUP_CALL', () => {
        setPhone((prev) => ({
          ...prev,
          isCalling: false,
          path: '',
          callAnswered: false,
        }));
      });
    }
  }, [socket]);

  const value = useMemo(
    () => ({
      player,
      setPlayer,
      carCondition,
      carTemperature,
      phone,
      onEmit,
    }),
    [carCondition, carTemperature, onEmit, phone, player]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

SocketProvider.propTypes = {
  ENDPOINT: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
