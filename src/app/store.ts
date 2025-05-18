import { configureStore } from "@reduxjs/toolkit";
import { moviesApi } from "../features/movies/moviesAPI";
import { imdbAPI } from "../features/movies/imdbAPI";

export const store = configureStore({
	reducer: {
		[moviesApi.reducerPath]: moviesApi.reducer,
		[imdbAPI.reducerPath]: imdbAPI.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(moviesApi.middleware, imdbAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
