import React from "react";
import getMedia from "../../utils/getMedia";
import ImageLoader from "../../utils/ImageLoader";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { useNavigate } from "react-router";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const getParentage = (value, total) => {
    const result = (value / total) * 100;
    return result.toFixed(2);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product?.id}`)}
      className="card-shadow group relative w-full cursor-pointer rounded-lg bg-white p-2 duration-150"
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <img
          src={getMedia(product?.image)}
          className="relative z-40 h-full w-full object-cover duration-300 group-hover:scale-125"
          alt=""
        />
        <ImageLoader />
        {product?.discount > 0 && (
          <p className="absolute left-0 top-0 z-40 rounded-es-md rounded-se-lg bg-orange-600 px-1 py-[2px] text-xs text-white">
            <s className="opacity-60">{product?.discount}</s>{" "}
            <span className="">
              -{getParentage(product?.discount, product?.price)}%
            </span>
          </p>
        )}
      </div>
      <p className="mt-2 truncate text-sm md:text-base">{product?.name}</p>
      <div className="flex items-center gap-1">
        <p className="text-lg font-medium text-orange-600">
          BDT {product?.discountPrice.toLocaleString()}
        </p>
        {product?.discount > 0 && (
          <s className="text-sm opacity-70">{product?.price}</s>
        )}
      </div>
      <div className="mt-1 flex items-center gap-1">
        <Rating readOnly className="max-w-[80px]" value={product?.avgRating} />{" "}
        <span className="text-gray-400">({product?.totalReviews})</span>
      </div>
    </div>
  );
};

export default ProductCard;
