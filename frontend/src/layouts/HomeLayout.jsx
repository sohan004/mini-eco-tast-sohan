import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Nav from "../components/Nav/Nav";
import Sidebar from "../components/Sidebar/Sidebar";

const HomeLayout = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top of the page when the location changes
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="">
      <Nav />
      <div className="flex-1 p-4 md:p-6 w-full max-w-[1480px]  mx-auto">
          <Outlet />
      </div>
    </div>
  );
};

export default HomeLayout;
