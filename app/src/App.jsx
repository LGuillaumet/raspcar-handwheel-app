import { Swiper, SwiperSlide } from 'swiper/react';
import AudioPlayer from './component/AudioPlayer/AudioPlayer';
import { HomeScreen } from './component/HomeScreen/HomeScreen';
import { PhoneScreen } from './component/PhoneScreen/PhoneScreen';
import { CarConditionScreen } from './component/CarConditionScreen/CarConditionScreen';
import { AirConditionerScreen } from './component/AirConditionerScreen/AirConditionerScreen';
import { SocketProvider } from './SocketProvider';

import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import './App.scss';

// const ENDPOINT = 'https://raspcar.loca.lt'
const App = () => (
  <SocketProvider ENDPOINT="192.168.1.29:8085">
    <div>
      <Swiper
        className="center"
        direction="horizontal"
        resistanceRatio={2}
        simulateTouch
        longSwipes
        loop
        onSlideChange={() => console.log('slide change')}
        // onSwiper={(swiper) => console.log(swiper)}
        slidesPerView={1}
      >
        <SwiperSlide>
          <HomeScreen />
        </SwiperSlide>
        <SwiperSlide>
          <AudioPlayer />
        </SwiperSlide>
        <SwiperSlide>
          <PhoneScreen />
        </SwiperSlide>
        <SwiperSlide>
          <CarConditionScreen />
        </SwiperSlide>
        <SwiperSlide>
          <AirConditionerScreen />
        </SwiperSlide>
      </Swiper>
    </div>
  </SocketProvider>
);

export default App;
