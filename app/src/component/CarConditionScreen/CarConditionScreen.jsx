import { ImArrowLeft, ImArrowRight } from 'react-icons/im';
import { ReactSVG } from 'react-svg';

import BatteryIcon from '../../assets/CarDashboard/battery.svg';
import FullHeadLight from '../../assets/CarDashboard/ic-feu-route.svg';
import PositionLight from '../../assets/CarDashboard/ic-feux-position.svg';
import CruiseLight from '../../assets/CarDashboard/ic-feux-croisement.svg';

import MalfunctionIcon from '../../assets/CarDashboard/malfunction-indicador.svg';
import SystemWarningIcon from '../../assets/CarDashboard/system-warning.svg';

import { useSocketCarInformations } from '../../SocketProvider';

import './CarConditionScreen.scss';

export const CarConditionScreen = () => {
  const { carCondition } = useSocketCarInformations();

  return (
    <div
      id="player"
      className="center d-flex justify-content-center align-items-center"
    >
      <div className="CarCondition-container d-flex position-relative justify-content-center align-items-center flex-column">
        <div className="w-100 mt-auto d-flex flex-row justify-content-evenly">
          <ImArrowLeft
            size={25}
            color="#004700"
            className={(carCondition.turnLeft && carCondition.turnRight && 'arrow-tick-animation-warning')
            || (carCondition.turnLeft && !carCondition.turnRight && 'arrow-tick-animation')}
          />
          <ImArrowRight
            size={25}
            color="#004700"
            className={(carCondition.turnLeft && carCondition.turnRight && 'arrow-tick-animation-warning')
            || (carCondition.turnRight && !carCondition.turnLeft && 'arrow-tick-animation')}
          />
        </div>
        <div className="w-75 h-75 d-flex position-relative justify-content-center align-items-center rounded-circle">
          <div className="w-100 d-flex flex-column align-items-center">
            <h1 className="text-white">AirPod</h1>
            <div className="w-100 d-flex flex-row justify-content-evenly">
              <ReactSVG
                src={PositionLight}
                beforeInjection={(svg) => {
                  svg.classList.add(carCondition.positionLight && 'glow-used-light');
                  svg.setAttribute('style', 'width: 2rem; height: auto;');
                }}
              />
              <div>
                <ReactSVG
                  src={CruiseLight}
                  beforeInjection={(svg) => {
                    svg.classList.add(carCondition.cruiseLight && 'glow-used-light');
                    svg.setAttribute('style', 'width: 2rem; height: auto;');
                  }}
                />
              </div>
              <div>
                <ReactSVG
                  src={FullHeadLight}
                  beforeInjection={(svg) => {
                    svg.classList.add(carCondition.fullheadLight && 'glow-used-full');
                    svg.setAttribute('style', 'width: 2rem; height: auto;');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 mt-auto d-flex flex-column align-items-center">
          <div className="w-100 d-flex flex-row justify-content-evenly">
            <div id="motor">
              <ReactSVG
                src={MalfunctionIcon}
                beforeInjection={(svg) => {
                  svg.classList.add(carCondition.motorProblem && 'glow-alert');
                  svg.setAttribute('style', 'width: 2rem; height: auto;');
                }}
              />
            </div>
            <div id="battery">
              <ReactSVG
                src={BatteryIcon}
                beforeInjection={(svg) => {
                  svg.classList.add(carCondition.handbrakeProblem && 'glow-alert');
                  svg.setAttribute('style', 'width: 2rem; height: auto;');
                }}
              />
            </div>
          </div>
          <div id="brake">
            <ReactSVG
              src={SystemWarningIcon}
              beforeInjection={(svg) => {
                svg.classList.add(carCondition.handbrakeProblem && 'glow-alert');
                svg.setAttribute('style', 'width: 2rem; height: auto;');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
