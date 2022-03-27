import { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import Switch from 'react-switch';

import 'rc-slider/assets/index.css';

import { FaFan } from 'react-icons/fa';

import { useSocketCarInformations } from '../../SocketProvider';

import './AirConditionerScreen.scss';

export const AirConditionerScreen = () => {
  const { carTemperature, onEmit } = useSocketCarInformations();

  const [valueTemp, setValueTemp] = useState(carTemperature.airTemperature);
  const [valueTempEdit, setValueTempEdit] = useState(valueTemp);
  const [valueFan, setValueFan] = useState(carTemperature.airSpeedFan);
  const [valueFanEdit, setValueFanEdit] = useState(valueFan);
  const [valueSwitch, setValueSwitch] = useState(carTemperature.airConditioner);

  const handleToggleSwitch = () => {
    setValueSwitch(!valueSwitch);
    onEmit('air_conditioner', !valueSwitch);
  };

  useEffect(() => {
    if (valueSwitch) {
      setValueFanEdit(valueFan);
    } else {
      setValueFanEdit(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueSwitch]);

  useEffect(() => {
    onEmit('air_speedfan', valueFanEdit);
  }, [onEmit, valueFanEdit]);

  useEffect(() => {
    onEmit('air_temperature', valueTempEdit);
  }, [onEmit, valueTempEdit]);

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
      <div className="AirConditioner-container d-flex position-relative justify-content-center align-items-center flex-column">
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
                onAfterChange={(val) => setValueTempEdit(val)}
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
                {carTemperature.carTemperature || 20}°C
              </h1>
              <FaFan
                color="white"
                size={100}
                className="spin"
                style={
                  valueFanEdit > 0 && {
                    animationDuration: `${100 / valueFanEdit}s`,
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
                onAfterChange={(val) => valueSwitch && setValueFanEdit(val)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
