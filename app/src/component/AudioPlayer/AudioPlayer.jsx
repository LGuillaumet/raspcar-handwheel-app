import './AudioPlayer.scss';
import moment from 'moment';
import _ from 'lodash';
import * as event from '../../utils/socket.requests';

const AudioPlayer = ({ player, emit }) => {
  const progressInDeg = (curr, total) => {
    // entre 0 et 180deg
    const str = `${Math.round((_.toNumber(`${curr}`) / _.toNumber(`${total}`)) * 180)}deg`;
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
    return (
      `${m.hours() > 0 ? `${addZero(m.hours())}:` : ''
      }${addZero(m.minutes())}:${addZero(m.seconds())}`
    );
  };

  const play = () => {
    emit(event.PLAY_REQUEST);
  };
  const pause = () => {
    emit(event.PAUSE_REQUEST);
  };
  const next = () => {
    emit(event.NEXT_REQUEST);
  };
  const prev = () => {
    emit(event.PREV_REQUEST);
  };
  const volumeChange = (e) => {
    const v = e.target.value;
    emit(event.VOLUME_CHANGE_REQUEST, v);
  };

  return (
    <div id="player" className="center">
      <div className="background-gradient center" />
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
                player.duration,
              )})`,
            }}
          />
        </div>
        {player.isPlaying ? (
          <button type="button" className="pause-btn control-btn ripple center" onClick={() => pause()} />
        ) : (
          <button type="button" className="play-btn control-btn ripple center" onClick={() => play()} />
        )}
      </div>
      <div className="music-info">
        <div className="music-volume-control">
          <span
            className={`mdi mdi-volume-${evaluateVolume(player.volume)}`}
          />
          <input type="range" value={player.volume} onChange={volumeChange} />
          <span>{player.volume}</span>
        </div>
        <div className="title">{player.title}</div>
        <div className="album">{player.album}</div>
      </div>
      <div className="music-controls center">
        <button type="button" className="music-left-controls" onClick={prev} />
        <div className="spacer" />
        <button type="button" className="music-right-controls" onClick={next} />
      </div>
    </div>
  );
};

export default AudioPlayer;
