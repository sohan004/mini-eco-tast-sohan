import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Skeleton } from "antd";
import { Autoplay, Pagination } from "swiper/modules";
import { useGetAllCategoryQuery } from "../../redux/api/privateQuery";
import getMedia from "../../utils/getMedia";
import ImageLoader from "../../utils/ImageLoader";
import { useSearchParams } from "react-router";

const RelatedCuisines = () => {
  const swiperRef = useRef(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const { data: categories, isLoading } = useGetAllCategoryQuery();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCheckboxChange = (id) => {
    searchParams.set("category", id);
    setSearchParams(searchParams);
  };

  const settings = {
    slidesPerView: 3.8,
    spaceBetween: 8,
    modules: [Autoplay, Pagination],
    autoplay: {
      delay: 5500, // 5 seconds delay
      disableOnInteraction: false,
    },
    loop: true,
    pagination: {
      el: ".custom-pagination-cuisines",
      clickable: true,
    },
    speed: 600,
    breakpoints: {
      1024: {
        slidesPerView: 8.5,
        spaceBetween: 20,
      },
      600: {
        slidesPerView: 5.5,
        spaceBetween: 15,
      },
    },
  };

  return (
    <div className="w-full overflow-x-hidden mb-8 " id="relatedCuisines">
      <div className="mb-4 flex w-full items-center justify-between bg-transparent">
        <h1 className="text-[17.3px] font-bold sm:text-[25px]">
          Your favourite <span className="text-orange-600">category</span> ✨
        </h1>
      </div>

      {isLoading ? (
        <div className="skeleton-3 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton.Image active />
          <Skeleton.Image active />
          <Skeleton.Image active />
        </div>
      ) : (
        <div className="relatedCuisines relative h-fit w-full">
          <Swiper ref={swiperRef} {...settings}>
            {categories?.data?.length > 0 &&
              categories?.data?.map((item, i) => (
                <SwiperSlide
                  onClick={() => handleCheckboxChange(item?.id)}
                  key={i}
                  className="cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden rounded-3xl">
                    <img
                      src={getMedia(item?.image)}
                      alt=""
                      className="absolute left-0 top-0 z-50 h-full w-full object-cover"
                    />
                    <ImageLoader />
                  </div>
                  {/* <h4 className="text-center text-gray-700">{item?.name}</h4> */}
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default RelatedCuisines;
