"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";

export default function LayoutBanner() {
  const slides = [1, 2];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div>
      <div className="relative">
        <Slider {...settings} className="mb-10">
          {slides.map((el, index) => (
            <Image
              key={index}
              src={`/images/banner${el}.png`}
              alt={`Banner ${el}`}
              width={1200}
              height={500}
              priority
            />

          ))}
        </Slider>
      </div>
    </div>
  );
}
