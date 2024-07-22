"use client";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
            <img src={`/images/banner${el}.png`} key={index} />
          ))}
        </Slider>
      </div>
    </div>
  );
}
