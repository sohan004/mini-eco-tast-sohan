import React from "react";
import { Skeleton } from "antd";

const ImageLoader = () => {
  return (
    <div className="absolute top-0 left-0 !w-full !h-full bg-gradient-to-r from-white to-white flex items-center justify-center z-30">
      <Skeleton.Image className="!w-full !h-full" active={true} />
    </div>
  );
};

export default ImageLoader;
