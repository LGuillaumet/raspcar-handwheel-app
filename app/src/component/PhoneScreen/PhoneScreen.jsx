import { useState } from 'react';
import { FaPhone } from 'react-icons/fa';
import {
  IoVolumeMuteSharp,
  IoVolumeHighSharp,
  IoMicOffSharp,
  IoMicSharp,
} from 'react-icons/io5';
import { Button } from 'reactstrap';

import * as event from '../../utils/socket.requests';
import './PhoneScreen.scss';

export const PhoneScreen = ({ emit }) => {
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
      className="center d-flex justify-content-center align-items-center flex-column"
    >
      <div className="phone-container d-flex position-relative justify-content-center align-items-center">
        <Button
          className="bg-transparent shadow-none border-0 position-absolute top-0 start-0 m-2"
          onClick={() => setIsMicMuted(!isMicMuted)}
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
        <Button
          className={`${
            isCalling && 'pulse'
          } rounded-circle bg-transparent shadow-none border-0 p-0 m-0 `}
        >
          <FaPhone
            className="rounded-circle bg-success bg-gradient p-3"
            size={160}
            color="white"
          />
        </Button>
        <Button className="bg-transparent shadow-none border-0 position-absolute bottom-0 end-0">
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
