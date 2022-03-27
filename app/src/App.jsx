import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useSocketCarInformations } from './SocketProvider';

import AudioPlayer from './component/AudioPlayer/AudioPlayer';
import { HomeScreen } from './component/HomeScreen/HomeScreen';
import { PhoneScreen } from './component/PhoneScreen/PhoneScreen';
import { CarConditionScreen } from './component/CarConditionScreen/CarConditionScreen';
import { AirConditionerScreen } from './component/AirConditionerScreen/AirConditionerScreen';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import './App.scss';

// const ENDPOINT = 'https://raspcar.loca.lt'
const App = () => {
  const { phone, player, onEmit } = useSocketCarInformations();

  useEffect(() => {
    console.log(phone.isCalling);
  }, [phone.isCalling]);
  return (
    <div>
      {(phone.isCalling || phone.callAnswered) ? (
        <PhoneScreen />
      ) : (
        <Swiper
          className="center"
          direction="horizontal"
          resistanceRatio={2}
          simulateTouch
          longSwipes
          loop
          slidesPerView={1}
        >
          <SwiperSlide>
            <HomeScreen />
          </SwiperSlide>
          <SwiperSlide>
            <AudioPlayer />
          </SwiperSlide>
          <SwiperSlide>
            <CarConditionScreen />
          </SwiperSlide>
          <SwiperSlide>
            <AirConditionerScreen />
          </SwiperSlide>
        </Swiper>
      )}
    </div>
  );
};

export default App;
