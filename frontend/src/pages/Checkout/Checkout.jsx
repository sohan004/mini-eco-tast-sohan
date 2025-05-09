import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";
import bkash from "../../../public/payment-logo/download.png"; // Use your correct path
import card from "../../../public/payment-logo/images.png"; // Use your correct path
import {
  useCreateOrderMutation,
  useGetMyCartQuery,
  useRemoveCartMutation,
} from "../../redux/api/privateQuery";
import getMedia from "../../utils/getMedia";
import { AiFillDelete } from "react-icons/ai";
import { message } from "antd";
import { Link } from "react-router";

const CheckoutPage = () => {
  // Static demo data
  const { data: cart, refetch: refetchCart, isLoading } = useGetMyCartQuery();
  const [removeCart] = useRemoveCartMutation();

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const handleConfirmOrder = async () => {
    if (!cart?.data?.length) {
      message.error("Cart is empty!");
      return;
    }
    try {
      const orderItems = cart.data.map((item) => ({
        productId: +item.id,
        quantity: +item.quantity,
        price: +item.price,
      }));
      const quantity = cart.data.reduce(
        (total, item) => total + item.quantity,
        0,
      );
      const totalAmount = getTotalPrice();
      const res = await createOrder({
        orderItems,
        totalAmount,
        quantity,
      }).unwrap();
      message.success("Order placed successfully");
      refetchCart(); // to clear cart in UI
    } catch (err) {
      message.error(err?.data?.message || "Failed to place order");
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("cash");

  const getTotalPrice = () => {
    return cart
      ? cart.data.reduce((total, item) => total + item.price * item.quantity, 0)
      : 0;
  };

  const handleDelete = async (id) => {
    const hide = message.loading("Processing...", 0);
    const res = await removeCart(id);
    refetchCart();
    hide();
  };

  return (
    <div className="h-screen overflow-y-auto">
      <p className="bg-white p-2 text-center text-xl font-semibold shadow">
        Checkout{" "}
        <span className="text-orange-600">
          ({cart?.data?.reduce((total, item) => total + item.quantity, 0) || 0})
        </span>
      </p>

      <div className="mx-auto mt-5 max-w-[1188px]">
        <div className="grid grid-cols-1 gap-5 px-3 md:grid-cols-10">
          {/* LEFT COLUMN - Product List */}
          <div className="left-filter-shadow col-span-1 w-full rounded-xl bg-white p-4 shadow-lg md:col-span-7">
            {cart?.data?.length > 0 && (
              <div>
                <Link
                  to={"/"}
                  className="mb-4 flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-orange-600 transition-all duration-300 hover:underline"
                >
                  <FaArrowLeft /> Back to Shop
                </Link>

                {cart?.data?.map((item, index) => (
                  <div
                    key={index}
                    className="group relative mb-5 flex flex-col justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 shadow-sm transition duration-300 hover:shadow-md sm:flex-row sm:items-center"
                  >
                    {/* Left Side */}
                    <div className="flex flex-1 items-center gap-4">
                      <span className="hidden text-sm font-semibold text-gray-400 sm:block">
                        {index + 1}.
                      </span>
                      <img
                        src={getMedia(item?.image)}
                        alt={item.name}
                        className="h-16 w-16 rounded-md border border-gray-200 object-cover sm:h-14 sm:w-14"
                      />
                      <div>
                        <p className="text-base font-semibold text-gray-800 sm:text-sm md:text-base">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col justify-between gap-2 sm:items-end sm:justify-center sm:gap-0">
                      <p className="text-sm font-bold text-gray-700 sm:text-base">
                        {(item?.price * item.quantity)?.toLocaleString()}
                      </p>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
                      >
                        <AiFillDelete className="text-lg" />
                        Remove
                      </button>
                    </div>

                    {/* Floating delete icon for hover effect */}
                    <div
                      className="absolute -right-2 -top-2 hidden cursor-pointer items-center justify-center rounded-full bg-red-500 p-1 text-white opacity-0 transition duration-300 group-hover:opacity-100 sm:flex"
                      onClick={() => handleDelete(item.id)}
                    >
                      <AiFillDelete className="text-xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!cart?.data?.length && !isLoading && (
              <Link
                to={"/"}
                className="flex h-full w-full items-center justify-center"
              >
                <button className="rounded-md bg-orange-600 px-4 py-2 font-medium text-white">
                  Continue Shopping
                </button>
              </Link>
            )}
          </div>

          {/* RIGHT COLUMN - Payment & Summary */}
          <div className="left-filter-shadow col-span-1 w-full rounded-xl bg-white p-4 shadow-lg md:col-span-3">
            {/* Payment Methods */}
            <h2 className="mb-4 text-base font-semibold text-gray-800">
              Choose Payment Method
            </h2>
            <div className="flex flex-col gap-3">
              {["bkash", "card", "cash"].map((method) => (
                <div
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`flex cursor-pointer items-center gap-4 rounded-md border p-3 shadow-sm transition-all duration-300 ${
                    paymentMethod === method
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-orange-400"
                  }`}
                >
                  {/* Radio Circle */}
                  <div className="flex items-center justify-center">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-orange-600">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${paymentMethod === method ? "bg-orange-600" : ""}`}
                      ></div>
                    </div>
                  </div>

                  {/* Method Logo / Icon */}
                  {method === "bkash" && (
                    <img src={bkash} className="w-20" alt="bkash" />
                  )}
                  {method === "card" && (
                    <img src={card} className="w-24" alt="card" />
                  )}
                  {method === "cash" && (
                    <div className="flex items-center gap-2">
                      <GiReceiveMoney className="text-2xl text-green-600" />
                      <span className="text-sm font-medium text-gray-800">
                        Cash On Delivery
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-8 space-y-3 border-t pt-4">
              <h2 className="text-base font-semibold text-gray-800">
                Order Summary
              </h2>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Subtotal</p>
                <p>{getTotalPrice()?.toLocaleString()}</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>Delivery Charge</p>
                <p>0.00</p>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <p>VAT</p>
                <p>0.00</p>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-bold text-gray-800">
                <p>Total</p>
                <p>{getTotalPrice()?.toLocaleString()}</p>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              disabled={cart?.data?.length === 0 || !cart}
              className="mt-6 flex w-full justify-center rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-orange-700 active:scale-95 disabled:bg-gray-300"
              onClick={() => handleConfirmOrder()}
            >
              {isCreating ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
              ) : (
                "Confirm Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
