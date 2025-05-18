import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MoviesApiResponse, MovieDetailResponse } from "./types";

export const moviesApi = createApi({
	reducerPath: "moviesApi",
	baseQuery: fetchBaseQuery({ baseUrl: "https://swapi.py4e.com/api/" }),
	endpoints: (builder) => ({
		getMovies: builder.query<MoviesApiResponse, void>({
			query: () => "films/?format=json",
		}),
		getMovieDetails: builder.query<MovieDetailResponse, string>({
			query: (url) => url,
		}),
	}),
});

export const { useGetMoviesQuery, useGetMovieDetailsQuery } = moviesApi;
