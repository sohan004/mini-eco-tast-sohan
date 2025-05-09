import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { getAccessToken, setAccessToken } from "../../utils/token";

// Custom baseQuery with refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_PUBLIC_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-access-token",
        method: "POST",
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      setAccessToken(refreshResult.data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Optionally, handle logout here
    }
  }

  return result;
};

export const privateQuery = createApi({
  reducerPath: "privateQuery",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAllCategory: builder.query({
      query: () => ({
        url: `/category/all`,
      }),
    }),
    getProductDetails: builder.query({
      query: (id) => ({
        url: `/product/details/${id}`,
      }),
    }),
    getLogUserInfo: builder.query({
      query: () => ({
        url: `/auth/info`,
      }),
    }),
    myOrder: builder.query({
      query: () => ({
        url: `/order/my-order`,
      }),
    }),
    getMyCart: builder.query({
      query: () => ({
        url: `/order/cart`,
      }),
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),
    logOut: builder.mutation({
      query: (data) => ({
        url: "/auth/logout",
        method: "PUT",
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    filterProduct: builder.mutation({
      query: (query) => ({
        url: `/product/filter${query}`,
        method: "GET",
      }),
    }),
    addToCart: builder.mutation({
      query: (body) => ({
        url: `/order/add-to-cart`,
        method: "POST",
        body,
      }),
    }),
    removeCart: builder.mutation({
      query: (id) => ({
        url: `/order/remove-from-cart/${id}`,
        method: "DELETE",
      }),
    }),
    createOrder: builder.mutation({
      query: (body) => ({
        url: `/order/checkout/`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useSignupMutation,
  useLoginMutation,
  useGetLogUserInfoQuery,
  useFilterProductMutation,
  useGetProductDetailsQuery,
  useGetMyCartQuery,
  useAddToCartMutation,
  useRemoveCartMutation,
  useCreateOrderMutation,
  useMyOrderQuery,
  useLogOutMutation,
} = privateQuery;
