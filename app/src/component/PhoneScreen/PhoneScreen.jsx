import { useState } from 'react';
import { Button } from 'reactstrap';
import { FaPhone } from 'react-icons/fa';
import {
  IoVolumeMuteSharp,
  IoVolumeHighSharp,
  IoMicOffSharp,
  IoMicSharp,
} from 'react-icons/io5';

import { useSocketCarInformations } from '../../SocketProvider';

import './PhoneScreen.scss';

export const PhoneScreen = () => {
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVolMuted, setIsVolMuted] = useState(false);
  const { phone, onEmit } = useSocketCarInformations();

  const handleAnswerCall = () => {
    if (phone.isCalling) {
      console.log('answer call', phone.path);
      onEmit('answer_call_request', phone.path);
    }
  };

  const handleHangoutCall = () => {
    console.log('hangup call', phone.path);
    onEmit('hangup_call_request', phone.path);
  };

  const handleMuteMicrophone = () => {
    setIsMicMuted(!isMicMuted);
    console.log('mute microphone', isMicMuted);
    onEmit('mute_microphone', isMicMuted);
  };

  return (
    <div
      id="player"
      className="center d-flex justify-content-center align-items-center flex-column"
    >
      <div className="phone-container d-flex position-relative justify-content-center align-items-center">
        <Button
          className="bg-transparent shadow-none border-0 position-absolute top-0 start-0 m-2"
          onClick={() => handleMuteMicrophone()}
        >
          {isMicMuted ? (
            <IoMicOffSharp
              className="rounded-circle bg-secondary bg-gradient p-3"
              size={60}
              color="white"
            />
          ) : (
            <IoMicSharp
              className="rounded-circle bg-secondary bg-gradient p-3"
              size={60}
              color="white"
            />
          )}
        </Button>
        <Button
          className=" bg-transparent shadow-none border-0 position-absolute bottom-0 start-0 m-2"
          onClick={() => setIsVolMuted(!isVolMuted)}
        >
          {isVolMuted ? (
            <IoVolumeMuteSharp
              className="rounded-circle bg-secondary bg-gradient p-3 "
              size={60}
              color="white"
            />
          ) : (
            <IoVolumeHighSharp
              className="rounded-circle bg-secondary bg-gradient p-3"
              size={60}
              color="white"
            />
          )}
        </Button>
        <div className="d-flex flex-column align-items-center">
          <span className="text-white mb-1">{phone.phoneNumber}</span>
          <Button
            onClick={() => handleAnswerCall()}
            className={`${
              phone.isCalling && 'pulse'
            } rounded-circle bg-transparent svg-shadow border-0 p-0 m-0 `}
          >
            <FaPhone
              className="rounded-circle bg-success bg-gradient p-3"
              size={160}
              color="white"
            />
          </Button>
        </div>
        <Button
          onClick={() => handleHangoutCall()}
          className="rounded-circle bg-transparent svg-shadow border-0 p-0 m-1 position-absolute bottom-0 end-0"
        >
          <FaPhone
            className="PhoneEnd rounded-circle bg-danger bg-gradient p-3 "
            size={80}
            color="white"
          />
        </Button>
      </div>
    </div>
  );
};
