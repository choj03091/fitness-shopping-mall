import React from "react";
import "../styles/BannerSection.scss";

const BannerSection = () => {
  return (
    <div className="banner-section">
      <img src="/images/banner-fitness.jpg" alt="메인 배너" />
      <div className="banner-text">
        <h1>최신 트렌드의 운동기구 쇼핑몰</h1>
        <p>프리웨이트, 유산소, 코어운동까지 한 눈에!</p>
      </div>
    </div>
  );
};

export default BannerSection;
