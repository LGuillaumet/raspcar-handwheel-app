import './HomeScreen.scss'
import * as event from '../../utils/socket.requests'
import moment from 'moment'
import _ from 'lodash'

import mdi_logo from '../../assets/img/mdi_logo.png'

export const HomeScreen = () => {
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

  return (
    <div id="player" className="center d-flex justify-content-center align-items-center flex-column">
        <h1 className="text-black">AirPod</h1>
        <img src={mdi_logo} alt="mdi logo" className="mdi-logo w-75"/>
    </div>
  )
}

