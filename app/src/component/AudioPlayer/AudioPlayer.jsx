import { useState, useEffect } from 'react';
import moment from 'moment';
import _ from 'lodash';
import { Button } from 'reactstrap';

import { FaPlay, FaPause } from 'react-icons/fa';
import { BiSkipPreviousCircle, BiSkipNextCircle } from 'react-icons/bi';

import { useSocketCarInformations } from '../../SocketProvider';

import * as event from '../../utils/socket.requests';
import './AudioPlayer.scss';

const AudioPlayer = () => {
  const { player, onEmit } = useSocketCarInformations();

  const [waitData, setWaitData] = useState(false);

  const progressInDeg = (curr, total) => {
    // entre 0 et 180deg
    const str = `${Math.round(
      (_.toNumber(`${curr}`) / _.toNumber(`${total}`)) * 180
    )}deg`;
    return str;
  };
  const evaluateVolume = (v) => {
    if (v <= 5) return 'low';
    if (v <= 75) return 'medium';
    return 'high';
  };
  const addZero = (t) => (t <= 9 ? `0${t}` : t);
  const formatTimer = (t) => {
    const m = moment.duration(t, 'milliseconds');
    return `${m.hours() > 0 ? `${addZero(m.hours())}:` : ''}${addZero(
      m.minutes()
    )}:${addZero(m.seconds())}`;
  };

  const play = () => {
    console.log('play');
    onEmit(event.PLAY_REQUEST);
  };
  const pause = () => {
    console.log('pause');
    onEmit(event.PAUSE_REQUEST);
  };
  const next = () => {
    console.log('pause');
    onEmit(event.NEXT_REQUEST);
  };
  const prev = () => {
    onEmit(event.PREV_REQUEST);
  };
  const volumeChange = (e) => {
    const v = e.target.value;
    onEmit(event.VOLUME_CHANGE_REQUEST, v);
  };

  // Need to be refactored
  if (
    !waitData
    && _.toNumber(player.duration) > 0
    && _.toNumber(player.progress) >= _.toNumber(player.duration)
  ) {
    setWaitData(true);
    // When track is finished, we need to update track's informations
    onEmit('track_informations_request');
  }

  useEffect(() => {
    if (player.isPlaying) {
      // at each update of player, useEffect will be called
      setWaitData(false);
    }
  }, [player]);

  return (
    <div id="player" className="center">
      <div className="music-cover-ring center" />
      <div
        className="music-cover center"
        style={{ backgroundImage: `url(${player.coverImage})` }}
      >
        <div className="music-progress-text">
          {formatTimer(player.progress)}
        </div>
        <div className="music-progress center">
          <div
            className="progress"
            style={{
              transform: `rotate(${progressInDeg(
                player.progress,
                player.duration
              )})`,
            }}
          />
        </div>
        {player.isPlaying ? (
          <Button
            className="pause-btn control-btn ripple center border-0"
            onClick={() => pause()}
          >
            <FaPause />
          </Button>
        ) : (
          <Button
            className="play-btn control-btn ripple center border-0"
            onClick={() => play()}
          >
            <FaPlay />
          </Button>
        )}
      </div>
      <div className="music-info">
        <div className="music-volume-control">
          <span className={`mdi mdi-volume-${evaluateVolume(player.volume)}`} />
          <input type="range" value={player.volume} onChange={volumeChange} />
          <span>{player.volume}</span>
        </div>
        <div className="title text-white">{player.title}</div>
        <div className="album">{player.artist}</div>
      </div>
      <div className="music-controls center">
        <Button
          type="button"
          className="music-left-controls d-flex justify-content-center align-items-center border-0 bg-transparent"
          onClick={prev}
        >
          <BiSkipPreviousCircle color="grey" size={40} />
        </Button>
        <div className="spacer" />
        <Button
          type="button"
          className="music-right-controls d-flex justify-content-center align-items-center border-0 bg-transparent"
          onClick={next}
        >
          <BiSkipNextCircle color="grey" size={40} />
        </Button>
      </div>
    </div>
  );
};

export default AudioPlayer;
