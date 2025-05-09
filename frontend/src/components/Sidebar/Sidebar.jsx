import { Checkbox, Radio } from "antd";
import { CrossMapIcon, FilterSpecialIcon } from "../../icons/icons";
import { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useSearchParams } from "react-router-dom";
import { useGetAllCategoryQuery } from "../../redux/api/privateQuery";
import { Skeleton5 } from "../../utils/skeleton/Skeleton";
import { useDispatch, useSelector } from "react-redux";
import { toggleSideBar } from "../../redux/slice/sideBarSlice";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Sidebar = ({ showSideBar, setShowSideBar }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([]);
  const { data: categories, isLoading } = useGetAllCategoryQuery();
  const dispatch = useDispatch();
  const openSideBar = useSelector((state) => state.sideBar);
  const [showMoreCategories, setShowMoreCategories] = useState(false);


  useEffect(() => {
    const priceStart = searchParams.get("price_start");
    const priceEnd = searchParams.get("price_end");
    if (priceStart && priceEnd) {
      setPriceRange([Number(priceStart), Number(priceEnd)]);
    } else {
      setPriceRange([100, 5000]);
    }
  } , [searchParams]);

  const querySetInUrl = (key, value) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
    dispatch(toggleSideBar(false));
  };

  const queryDeleteInUrl = (key) => {
    searchParams.delete(key);
    setSearchParams(searchParams);
    dispatch(toggleSideBar(false));
  };

  const handleCategoryChange = (categoryId) => {
    const currentCategories = searchParams.get("category")?.split(",") || [];
    if (currentCategories.includes(categoryId.toString())) {
      const newCategories = currentCategories.filter(
        (cat) => cat !== categoryId.toString(),
      );
      if (newCategories.length === 0) {
        queryDeleteInUrl("category");
      } else {
        querySetInUrl("category", newCategories.join(","));
      }
    } else {
      currentCategories.push(categoryId.toString());
      querySetInUrl("category", currentCategories.join(","));
    }
  };

  const handleRatingChange = (rating) => {
    const currentRating = searchParams.get("rating") || "";
    if (currentRating === rating.toString()) {
      queryDeleteInUrl("rating");
    } else {
      querySetInUrl("rating", rating);
    }
  };

  const handleSortChange = (order) => {
    if (searchParams.get("price_sort") === order) {
      queryDeleteInUrl("price_sort");
    } else {
      querySetInUrl("price_sort", order);
    }
  };

  return (
    <>
      <div
        onClick={() => dispatch(toggleSideBar(false))}
        className={`fixed left-0 top-0 z-50 h-full w-full bg-black bg-opacity-40 duration-200 md:hidden ${
          openSideBar ? "visible opacity-100" : "invisible opacity-0"
        }`}
      ></div>

      <div
        className={`left-filter-shadow fixed top-0 z-50 h-full w-[80%] overflow-y-auto rounded-md bg-white p-5 duration-300 md:sticky md:top-[104px] md:mr-6 md:w-[280px] ${
          openSideBar ? "left-0" : "-left-[80%] md:left-0"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-dashed pb-3">
          <h1 className="text-[18px] font-bold leading-[26px] text-orange-600 md:text-xl">
            Filter
          </h1>
          <button
            onClick={() => dispatch(toggleSideBar(false))}
            className="md:hidden"
          >
            <CrossMapIcon />
          </button>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h2 className="mb-2 text-base font-semibold leading-[26px] md:text-lg">
            Price Range
          </h2>
          <RangeSlider
            onInput={(e) => setPriceRange(e)}
            onRangeDragEnd={() => {
              querySetInUrl("price_start", priceRange[0]);
              querySetInUrl("price_end", priceRange[1]);
            }}
            onThumbDragEnd={() => {
              querySetInUrl("price_start", priceRange[0]);
              querySetInUrl("price_end", priceRange[1]);
            }}
            value={priceRange}
            min={100}
            max={5000}
          />
          <div className="mt-4 flex items-center justify-between">
            <input
              type="text"
              className="w-[70px] rounded border border-[#ced4e0] bg-transparent px-2 py-1 text-center outline-none focus:ring-0"
              value={priceRange[0]?.toLocaleString()}
              onChange={(e) => {
                setPriceRange([Number(e.target.value), priceRange[1]]);
                querySetInUrl("price_start", Number(e.target.value));
              }}
            />
            <input
              type="text"
              className="w-[70px] rounded border border-[#ced4e0] bg-transparent px-2 py-1 text-center outline-none focus:ring-0"
              value={priceRange[1]?.toLocaleString()}
              onChange={(e) => {
                setPriceRange([priceRange[0], Number(e.target.value)]);
                querySetInUrl("price_end", Number(e.target.value));
              }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h2 className="mb-2 text-base font-semibold leading-[26px] md:text-lg">
            Category
          </h2>
          {isLoading && (
            <div className="grid gap-2">
              <Skeleton5 />
            </div>
          )}
          {categories && (
            <>
              <div className="space-y-2">
                {categories?.data
                  ?.slice(0, showMoreCategories ? categories?.data?.length : 5)
                  ?.map((cat) => (
                    <label
                      key={cat?.id}
                      className="flex cursor-pointer items-center gap-3 text-sm md:text-base"
                    >
                      <Checkbox
                        checked={searchParams
                          .get("category")
                          ?.includes(cat?.id.toString())}
                        onClick={() => handleCategoryChange(cat?.id)}
                      />
                      <span>{cat?.name}</span>
                    </label>
                  ))}
              </div>
              <p
                onClick={() => setShowMoreCategories(!showMoreCategories)}
                className="mt-2 flex cursor-pointer items-center text-sm text-orange-600"
              >
                {showMoreCategories ? "Show Less" : "Show More"}
                <MdOutlineKeyboardArrowDown
                  className={`ml-1 text-lg duration-200 ${
                    showMoreCategories ? "rotate-180" : ""
                  }`}
                />
              </p>
            </>
          )}
        </div>

        {/* Rating Filter */}
        <div className="mb-6">
          <h2 className="mb-2 text-base font-semibold leading-[26px] md:text-lg">
            Rating
          </h2>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <label
                key={rating}
                className="flex cursor-pointer items-center text-sm"
              >
                <Radio
                  checked={rating === +searchParams.get("rating")}
                  onClick={() => handleRatingChange(rating)}
                />
                <span className="flex items-center">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span className="md:text-lg" key={i}>
                      ⭐
                    </span>
                  ))}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort by Price Filter */}
        <div className="mb-6">
          <h2 className="mb-2 text-base font-semibold leading-[26px] md:text-lg">
            Sort by Price
          </h2>
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 text-sm md:text-base">
              <Radio
                checked={searchParams.get("price_sort") === "asc"}
                onClick={() => handleSortChange("asc")}
              />
              Low to High
            </label>
            <label className="flex cursor-pointer items-center gap-3 text-sm md:text-base">
              <Radio
                checked={searchParams.get("price_sort") === "desc"}
                onClick={() => handleSortChange("desc")}
              />
              High to Low
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
