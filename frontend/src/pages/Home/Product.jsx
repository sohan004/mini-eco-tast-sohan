import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useFilterProductMutation } from "../../redux/api/privateQuery";
import ProductCard from "./ProductCard";
import boxImg from "../../../public/empty-box.png";
import ImageLoader from "../../utils/ImageLoader";
import { FaArrowLeftLong } from "react-icons/fa6";

const Product = () => {
  const search = useLocation().search;
  const [products, setProducts] = useState([]);
  const [fetchProduct, { isLoading }] = useFilterProductMutation();
  const [take, setTake] = useState(8);
  const [skip, setSkip] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchProducts = async (p, s) => {
    setIsLoadingMore(false);
    const res = await fetchProduct(
      `?take=${take}&skip=${s}&${search?.replace("?", "") || ""}`,
    ).unwrap();
    if (res?.products) {
      setProducts((prev) => [...p, ...res.products]);
      if (res.products.length < take) {
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(true);
      }
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setProducts([]);
      fetchProducts([], 0);
    }, 0);
    return () => clearTimeout(timeOut);
  }, [search]);

  console.log(search);

  return (
    <div>
      <div className="mb-4 flex w-full items-center justify-between bg-transparent">
       {search?.length === 0 ? <h1 className="text-[17.3px] font-bold sm:text-[25px]">
          Top Picks <span className="text-orange-600">Just for You</span> 🛍️
        </h1> : <Link to={"/"} className="text-orange-600 flex items-center gap-2 font-medium">
        <FaArrowLeftLong />  Back Home
          </Link>}

      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6 mt-5">
          {new Array(4).fill(0).map((_, index) => (
            <div key={index} className="relative aspect-square">
              <ImageLoader />
            </div>
          ))}
        </div>
      )}

      {isLoadingMore && (
        <div className="flex w-full justify-center">
          <button
            className="mt-4 flex h-10 items-center justify-center rounded-md bg-orange-600 px-4 text-sm font-medium text-white duration-150 hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              fetchProducts(products, products.length);
            }}
          >
            Show More
          </button>
        </div>
      )}

      {!isLoading && products?.length === 0 && (
        <div className="flex w-full items-center justify-center">
          <img
            src={boxImg}
            alt=""
            className="mx-auto mt-5 w-full max-w-[300px]"
          />
        </div>
      )}
    </div>
  );
};

export default Product;
