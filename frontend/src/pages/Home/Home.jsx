import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { useLocation, useSearchParams } from "react-router";
import Sidebar from "../../components/Sidebar/Sidebar";
import RelatedCuisines from "./RelatedCuisines";
import Product from "./Product";

const Home = () => {
  const search = useLocation().search;
  return (
    <>
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 overflow-hidden">
          {search?.length === 0 && <RelatedCuisines />}
          <Product />
        </div>
      </div>
    </>
  );
};

export default Home;
