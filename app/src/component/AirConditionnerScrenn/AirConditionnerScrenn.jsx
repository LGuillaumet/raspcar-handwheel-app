import { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import Switch from 'react-switch';

import './AirConditionnerScrenn.scss';
import 'rc-slider/assets/index.css';

import { FaFan } from 'react-icons/fa';

export const AirConditionnerScrenn = ({ emit }) => {
  const [carTemp, setCarTemp] = useState(20);
  const [valueTemp, setValueTemp] = useState(10);
  const [valueFan, setValueFan] = useState(50);
  const [valueEdit, setValueEdit] = useState(valueFan);
  const [valueSwitch, setValueSwitch] = useState(false);

  const handleToggleSwitch = () => {
    setValueSwitch(!valueSwitch);
  };

  useEffect(() => {
    if (valueSwitch) {
      setValueEdit(valueFan);
    } else {
      setValueEdit(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueSwitch]);

  const marksTemp = {
    10: <strong>10°C</strong>,
    20: '20°C',
    30: '30°C',
    40: {
      style: {
        color: 'red',
      },
      label: <strong>40°C</strong>,
    },
  };

  const marksFan = {
    0: <strong>0%</strong>,
    25: '25%',
    50: '50%',
    75: '75%',
    100: '100%',
  };

  return (
    <div
      id="player"
      className="center d-flex justify-content-center align-items-center"
    >
      <div className="AirConditionner-container d-flex position-relative justify-content-center align-items-center flex-column">
        <Switch onChange={handleToggleSwitch} checked={valueSwitch} />
        <div className="w-75 h-75 d-flex position-relative justify-content-center align-items-center rounded-circle">
          <div className="h-100 w-100 d-flex flex-row align-items-center justify-content-between">
            <div id="left" className="h-75">
              <Slider
                vertical
                min={10}
                max={40}
                marks={marksTemp}
                step={1}
                value={valueTemp}
                onChange={(val) => setValueTemp(val)}
              />
            </div>
            <div id="center" className="d-flex flex-column align-items-center">
              <div>
                <p id="center" className="text-white bold p-0 m-0">
                  {valueSwitch
                    ? `Target temperature: ${valueTemp}°C`
                    : 'Air Conditionner'}
                </p>
              </div>
              <h1 id="center" className="display-1 text-white bold p-0 m-0">
                {carTemp}°C
              </h1>
              <FaFan
                color="white"
                size={100}
                className="spin"
                style={
                  valueEdit > 0 && {
                    animationDuration: `${100 / valueEdit}s`,
                  }
                }
              />
            </div>
            <div id="right" className="h-75">
              <Slider
                vertical
                min={0}
                max={100}
                marks={marksFan}
                step={1}
                value={valueFan}
                onChange={(val) => setValueFan(val)}
                onAfterChange={(val) => valueSwitch && setValueEdit(val)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
