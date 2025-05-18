import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RatingsResponse } from "./types";

export const imdbAPI = createApi({
	reducerPath: "imdbApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://www.omdbapi.com/",
	}),
	endpoints: (builder) => ({
		getImdbData: builder.query<
			RatingsResponse,
			{ title: string; year: number }
		>({
			query: ({ title, year }) =>
				`?apikey=b9a5e69d&t=${encodeURIComponent(title)}&y=${year}`,
		}),
	}),
});

export const { useLazyGetImdbDataQuery } = imdbAPI;
