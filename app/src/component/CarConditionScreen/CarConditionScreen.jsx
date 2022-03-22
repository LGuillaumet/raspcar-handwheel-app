import { useState } from 'react';
import { ImArrowLeft, ImArrowRight } from 'react-icons/im';
import { ReactSVG } from 'react-svg';

import * as event from '../../utils/socket.requests';
import './CarConditionScreen.scss';

import BatteryIcon from '../../assets/CarDashboard/battery.svg';
import HeadlightIcon from '../../assets/CarDashboard/headlight.svg';
import MalfunctionIcon from '../../assets/CarDashboard/malfunction-indicador.svg';
import SystemWarningIcon from '../../assets/CarDashboard/system-warning.svg';

export const CarConditionScreen = ({ emit }) => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVolMuted, setIsVolMuted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  const answerCall = () => {
    emit(event.ANSWER_CALL_REQUEST);
  };
  const endCall = () => {
    emit(event.END_CALL_REQUEST);
  };

  return (
    <div
      id="player"
      className="center d-flex justify-content-center align-items-center"
    >
      <div className="CarCondition-container d-flex position-relative justify-content-center align-items-center flex-column">
        <div className="w-100 mt-auto d-flex flex-row justify-content-evenly">
          <ImArrowLeft size={25} />
          <ImArrowRight size={25} />
        </div>
        <div className="w-75 h-75 d-flex position-relative justify-content-center align-items-center rounded-circle border border-primary">
          <div className="w-100 d-flex flex-column align-items-center">
            <h1 className="">AirPod</h1>
            <div className="w-100 d-flex flex-row justify-content-evenly">
              <ReactSVG
                src={HeadlightIcon}
                beforeInjection={(svg) => {
                  svg.setAttribute('style', 'width: 1.75rem; height: auto;');
                }}
              />
              <div>
                <ReactSVG
                  src={HeadlightIcon}
                  beforeInjection={(svg) => {
                    svg.setAttribute('style', 'width: 1.75rem; height: auto;');
                  }}
                />
              </div>
              <div>
                <ReactSVG
                  src={HeadlightIcon}
                  beforeInjection={(svg) => {
                    svg.setAttribute('style', 'width: 1.75rem; height: auto;');
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-100 mt-auto d-flex flex-column align-items-center">
          <div className="w-100 d-flex flex-row justify-content-evenly">
            <div>
              <ReactSVG
                src={MalfunctionIcon}
                beforeInjection={(svg) => {
                  svg.setAttribute('style', 'width: 1.75rem; height: auto;');
                }}
              />
            </div>
            <div>
              <ReactSVG
                src={BatteryIcon}
                beforeInjection={(svg) => {
                  svg.setAttribute('style', 'width: 1.75rem; height: auto;');
                }}
              />
            </div>
          </div>
          <div>
            <ReactSVG
              src={SystemWarningIcon}
              beforeInjection={(svg) => {
                svg.setAttribute('style', 'width: 1.75rem; height: auto;');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
