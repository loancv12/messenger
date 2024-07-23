import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../config";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getTest: builder.mutation({
      query: () => ({
        url: "test",
        method: "POST",
      }),
    }),
  }),
});

export const { useGetTestMutation } = api;
