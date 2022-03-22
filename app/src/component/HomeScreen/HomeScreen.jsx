import './HomeScreen.scss';
import mdiLogo from '../../assets/img/mdi_logo.png';

export const HomeScreen = () => (
  <div id="player" className="center d-flex justify-content-center align-items-center flex-column">
    <h1 className="text-black">AirPod</h1>
    <img src={mdiLogo} alt="mdi logo" className="mdi-logo w-75" />
  </div>
);
