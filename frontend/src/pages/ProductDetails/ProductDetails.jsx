import { MdLocalOffer } from "react-icons/md";
import { FaEarthAfrica, FaPeopleRoof } from "react-icons/fa6";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GiShoppingBag } from "react-icons/gi";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { RiShoppingCartLine } from "react-icons/ri";
import {
  useAddToCartMutation,
  useFilterProductMutation,
  useGetLogUserInfoQuery,
  useGetMyCartQuery,
  useGetProductDetailsQuery,
  useRemoveCartMutation,
} from "../../redux/api/privateQuery";
import getMedia from "../../utils/getMedia";
import ProductCard from "../Home/ProductCard";
import ProductDetailsPageSkleton from "../../components/ProductDetailsPageSkleton/ProductDetailsPageSkleton";
import LoginForm from "../../components/Login/Login";
import ModalPage from "../../components/Modal/Modal";
import { message } from "antd";

const ProductDetails = () => {
  const id = useParams().id;
  const { data: product, isLoading } = useGetProductDetailsQuery(id);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [fetchProduct, { data }] = useFilterProductMutation();
  const { data: cart, refetch: refetchCart } = useGetMyCartQuery();
  const { data: userInfo } = useGetLogUserInfoQuery();
  const [addCart] = useAddToCartMutation();
  const [removeCart] = useRemoveCartMutation();
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetchProduct("?take=4&skip=0").unwrap();
  }, []);

  const getParentage = (value, total) => {
    const result = (value / total) * 100;
    return result.toFixed(2);
  };

  const openLoginModal = () => {
    setContent(
      React.cloneElement(<LoginForm />, {
        key: Math.random(), // Force re-render by changing the key
      }),
    );
  };

  const clickBuyNow = async (isCart) => {
    if (!userInfo) {
      openLoginModal();
      return;
    }

    const data = {
      id: product?.data?.id,
      name: product?.data?.name,
      price: product?.data?.price - product?.data?.discount,
      image: product?.data?.image,
      quantity: isCart ? quantity : 1,
      decrease: false,
    };

    const hide = message.loading("Processing...", 0);

    try {
      await addCart(data);
      refetchCart();

      hide(); // Close loading toast

      if (isCart) message.success("Added to cart successfully");
      if (!isCart) navigate("/checkout");
    } catch (error) {
      hide();
      message.error("Something went wrong");
    }
  };

  if (isLoading) return <ProductDetailsPageSkleton />;

  return (
    <div className="bg-white">
      <div className="flex flex-wrap items-center gap-2 text-xs capitalize text-gray-500 lg:text-sm">
        <Link to={"/"}>Home</Link> /{" "}
        <Link to={`/?category=${product?.data?.category?.id}`}>
          {product?.data?.category?.name}
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-2 lg:flex-row lg:gap-8">
        <div className="w-full lg:w-[50%]">
          <img
            className="h-[200px] w-full object-cover md:h-[300px] lg:h-[400px]"
            src={getMedia(product?.data?.image)}
            alt=""
          />
        </div>

        <div className="w-full lg:w-[50%]">
          {product?.data?.discount > 0 && (
            <p className="flex items-center gap-2 text-xs text-gray-500">
              <MdLocalOffer /> Save{" "}
              {getParentage(product?.data?.discount, product?.data?.price)}%
              right now
            </p>
          )}
          <h1 className="mb-4 mt-3 text-xl font-bold text-gray-800 lg:text-3xl">
            {product?.data?.name}
          </h1>
          <div className="mb-4 flex items-center gap-3 text-3xl font-bold">
            <h3 className="text-orange-600">
              BDT{" "}
              {(
                product?.data?.price - product?.data?.discount
              )?.toLocaleString()}
            </h3>
            <h3 className="text-xl text-gray-500">
              {product?.data?.discount > 0 && <del>{product?.data?.price}</del>}
            </h3>
          </div>

          <div className="">
            <p className="font-semibold">Quantity</p>
            <div className="mt-1 flex select-none items-center gap-3">
              <span
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                className="cursor-pointer text-xl font-bold"
              >
                -
              </span>
              <input
                className="w-10 rounded-md border border-gray-300 bg-white p-1 px-1 text-center outline-none"
                type="number"
                name=""
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value > 0 ? e.target.value : 1)
                }
                id=""
              />
              <span
                onClick={() => setQuantity(quantity + 1)}
                className="cursor-pointer text-xl font-bold"
              >
                +
              </span>
            </div>
          </div>

          <div className="mt-7 flex w-full items-center gap-0 bg-white md:mb-7 md:gap-3">
            <button
              onClick={() => clickBuyNow("")}
              className="fixed bottom-0 right-0 z-[100] flex w-2/4 flex-1 items-center justify-center gap-2 rounded-none border border-orange-600 bg-orange-600 py-3 text-xl text-white hover:bg-orange-800 active:scale-100 md:static md:max-w-[180px] md:rounded-md"
            >
              <GiShoppingBag className="text-2xl" />
              Order Now
            </button>
            <button
              onClick={() => clickBuyNow("cart")}
              className="fixed bottom-0 left-0 z-[100] flex w-2/4 flex-1 items-center justify-center gap-2 rounded-none border border-yellow-500 bg-yellow-500 py-3 text-xl text-white hover:bg-yellow-600 active:scale-100 md:static md:max-w-[180px] md:rounded-md"
            >
              <RiShoppingCartLine className="text-2xl" />
              Add To Cart
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <FaEarthAfrica />
              Hassle-free shipping
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <RiSecurePaymentFill />
              100% Secured Payment
            </p>
            <p className="flex items-center gap-2 text-sm text-gray-500">
              <FaPeopleRoof />
              Made by the Professionals
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-8 lg:flex-row">
        <div className="w-full lg:w-[60%]">
          <div className="flex items-end gap-6 border-b text-xs text-gray-500 lg:gap-8 lg:text-sm">
            {/* <p className="py-3">Description</p> */}
            <p className="flex items-center gap-1 border-b border-black py-3 text-black">
              Description{" "}
            </p>
            {/* <p className="py-3">Supports</p> */}
          </div>
          <p className="mt-2 whitespace-pre-wrap break-all text-sm md:text-base">
            {product?.data?.description}
          </p>
        </div>

        <div className="w-full lg:w-[40%]">
          <div className="grid grid-cols-2 gap-4">
            {data?.products?.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        </div>
      </div>

      <ModalPage content={content} setContent={setContent} />
    </div>
  );
};

export default ProductDetails;
// new commit
