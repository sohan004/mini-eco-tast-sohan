import React from "react";
import { useGetLogUserInfoQuery } from "../../redux/api/privateQuery";
import { Navigate } from "react-router";

const AuthRoute = ({ children }) => {
  const { data: userInfo, isLoading } = useGetLogUserInfoQuery();

  if (isLoading) {
    return <></>;
  }

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRoute;
