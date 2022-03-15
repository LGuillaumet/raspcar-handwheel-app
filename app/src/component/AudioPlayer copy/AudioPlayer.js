import './AudioPlayer.scss'
import * as event from '../../utils/socket.requests'
import moment from 'moment'
import _ from 'lodash'
const AudioPlayer = ({ player, emit }) => {
  const progressInDeg = (curr, total) => {
    // entre 0 et 180deg
    curr = _.toNumber(curr+'')
    total = _.toNumber(total+'')
    let str = Math.round((curr / total) * 180) + 'deg'
    return str
  }
  const evaluateVolume = (v) => (v <= 5 ? 'low' : v <= 75 ? 'medium' : 'high')
  const addZero = (t) => (t <= 9 ? '0' + t : t)
  const formatTimer = (t) => {
    let m = moment.duration(t, 'milliseconds')
    return (
      (m.hours() > 0 ? addZero(m.hours()) + ':' : '') +
      `${addZero(m.minutes())}:${addZero(m.seconds())}`
    )
  }

  const play = () => {
    emit(event.PLAY_REQUEST)
  }
  const pause = () => {
    emit(event.PAUSE_REQUEST)
  }
  const next = () => {
    emit(event.NEXT_REQUEST)
  }
  const prev = () => {
    emit(event.PREV_REQUEST)
  }
  const volumeChange = (e) => {
    const v = e.target.value
    emit(event.VOLUME_CHANGE_REQUEST, v)
  }

  return (
    <div id="player" className="center">
      <div className="background-gradient center"></div>
      <div className="music-cover-ring center"></div>
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
          ></div>
        </div>
        {player.isPlaying ? (
          <div className="pause-btn control-btn ripple center" onClick={pause}>
            <div className="mdi mdi-pause center"></div>
          </div>
        ) : (
          <div className="play-btn control-btn ripple center" onClick={play}>
            <div className="mdi mdi-play center"></div>
          </div>
        )}
      </div>
      <div className="music-info">
        <div className="music-volume-control">
          <span
            className={'mdi mdi-volume-' + evaluateVolume(player.volume)}
          ></span>
          <input type="range" value={player.volume} onChange={volumeChange} />
          <span>{player.volume}</span>
        </div>
        <div className="title">{player.title}</div>
        <div className="album">{player.album}</div>
      </div>
      <div className="music-controls center">
        <div className="music-left-controls" onClick={prev}>
          <span className="mdi mdi-skip-previous"></span>
        </div>
        <div className="spacer"></div>
        <div className="music-right-controls" onClick={next}>
          <span className="mdi mdi-skip-next"></span>
        </div>
      </div>
    </div>
  )
}

export default AudioPlayer
