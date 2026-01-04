import React from 'react'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  EffectFade,
  EffectCoverflow,
  EffectCreative,
  Autoplay
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import sliderImages from '@/data/sliderImages';

const SliderPage = () => {
  return (
    <div className="slider-sec container">
      <div className="slider-part">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          modules={[
            Navigation,
            EffectFade,
            EffectCoverflow,
            EffectCreative,
            Autoplay
          ]}
          effect='coverflow'
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          // onSlideChange={() => console.log('slide change')}
          // onSwiper={(swiper) => console.log(swiper)}
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="slider">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes='100'
                  priority={index === 0}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="slider-content">
        <h1>Discover all Services</h1>
        <span>Explore the wide range of solutions that meet your requirements.</span>
      </div>
    </div>
  )
}

export default SliderPage