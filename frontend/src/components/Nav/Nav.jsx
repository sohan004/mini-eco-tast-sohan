import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import ModalPage from "../Modal/Modal";
import LoginForm from "../Login/Login";
import {
  useGetLogUserInfoQuery,
  useGetMyCartQuery,
} from "../../redux/api/privateQuery";
import { RiMenu2Fill, RiShoppingCart2Line } from "react-icons/ri";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { toggleSideBar } from "../../redux/slice/sideBarSlice";
import { FaCircleUser } from "react-icons/fa6";

const Nav = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [content, setContent] = useState(null);
  const { data: userInfo, isLoading } = useGetLogUserInfoQuery();
  const { data: cart } = useGetMyCartQuery();
  const navigate = useNavigate();
  console.log(cart);
  const dispatch = useDispatch();
  const pathName = useLocation().pathname;

  const openLoginModal = () => {
    setContent(
      React.cloneElement(<LoginForm />, {
        key: Math.random(), // Force re-render by changing the key
      }),
    );
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const newParams = new URLSearchParams(searchParams);

      if (search) {
        newParams.set("search", search);
      } else {
        newParams.delete("search");
      }

      navigate({
        pathname: "/", // <-- always go to home page
        search: `?${newParams.toString()}`,
      });
    }
  };

  return (
    <div
      style={{
        boxShadow: "0 -1px 13px 0 rgba(0, 0, 0, .05)",
      }}
      className="sticky top-0 z-50 bg-white"
    >
      <div className="mx-auto flex w-full max-w-[1480px] items-center gap-2 p-4 md:gap-3 md:p-5 md:px-5">
        <div className="md:hidden">
          <RiMenu2Fill
            onClick={() =>
              pathName === "/" ? dispatch(toggleSideBar(true)) : navigate("/")
            }
            className="cursor-pointer text-xl md:hidden"
          />
        </div>
        <div className="gap flex flex-1 items-center gap-2 rounded-full bg-slate-100 ps-3">
          <FiSearch className="hidden text-lg text-orange-600 md:block" />
          <input
            value={search}
            onKeyDown={handleSearch}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            className="w-full flex-1 bg-transparent outline-none"
            placeholder="Search products by name, category, brand, etc."
            name=""
            id=""
          />
          <button
            onClick={handleSearch}
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-600 text-white md:h-10 md:w-10 md:text-lg"
          >
            <FiSearch />
          </button>
        </div>

        {!isLoading && !userInfo && (
          <button
            onClick={openLoginModal}
            className="rounded-full bg-orange-600 px-3 py-1 font-medium text-white md:px-5 md:py-2"
          >
            Login
          </button>
        )}

        {userInfo && (
          <Link to={"/checkout"} className="relative cursor-pointer">
            <HiOutlineShoppingBag className="text-2xl text-gray-800 md:text-3xl" />
            {cart?.data?.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-600 text-xs text-white shadow">
                {cart?.data?.reduce((acc, item) => acc + item?.quantity, 0)}
              </span>
            )}
          </Link>
        )}

        {userInfo && (
          <Link to={"/profile"}>
            <FaCircleUser className="cursor-pointer text-2xl text-gray-800 md:text-3xl" />
          </Link>
        )}
      </div>

      <ModalPage content={content} setContent={setContent} />
    </div>
  );
};

export default Nav;
