import { useState, useEffect } from "react";
import {
	useGetMoviesQuery,
	useGetMovieDetailsQuery,
} from "../features/movies/moviesAPI";
import { useLazyGetImdbDataQuery } from "../features/movies/imdbAPI";
import styles from "./MovieList.module.css";
import Rating from "./Rating";
import type { Ratings } from "../features/movies/types";

interface MovieListProps {
	searchQuery: string;
	sortParameter: string;
}

const toRoman = (num: number): string => {
	const romanNumerals: [string, number][] = [
		["M", 1000],
		["CM", 900],
		["D", 500],
		["CD", 400],
		["C", 100],
		["XC", 90],
		["L", 50],
		["XL", 40],
		["X", 10],
		["IX", 9],
		["V", 5],
		["IV", 4],
		["I", 1],
	];
	let result = "";
	for (const [roman, value] of romanNumerals) {
		while (num >= value) {
			result += roman;
			num -= value;
		}
	}
	return result;
};

const MovieList = ({ searchQuery, sortParameter }: MovieListProps) => {
	// Fetch movies data
	const { data, isLoading, error } = useGetMoviesQuery();
	const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
	const { data: selectedMovie } = useGetMovieDetailsQuery(selectedMovieId!, {
		skip: selectedMovieId === null,
	});

	// IMDb API lazy query
	const [fetchImdbData] = useLazyGetImdbDataQuery();

	// State to store IMDb data for all movies
	const [imdbRatings, setImdbRatings] = useState<
		Record<string, { imdbRating: string; Ratings: Ratings[]; Poster: string }>
	>({});

	useEffect(() => {
		setSelectedMovieId(null);
	}, [searchQuery]);

	// Fetch IMDb data for all movies
	useEffect(() => {
		if (data?.results) {
			data.results.forEach((movie) => {
				fetchImdbData({
					title: movie.title,
					year: new Date(movie.release_date).getFullYear(),
				})
					.unwrap()
					.then((imdbResponse) => {
						setImdbRatings((prev) => ({
							...prev,
							[movie.title]: {
								imdbRating: imdbResponse.imdbRating || "N/A",
								Ratings: imdbResponse.Ratings || [],
								Poster: imdbResponse.Poster || "",
							},
						}));
					})
					.catch(() => {
						setImdbRatings((prev) => ({
							...prev,
							[movie.title]: {
								imdbRating: "N/A",
								Ratings: [],
								Poster: "",
							},
						}));
					});
			});
		}
	}, [data, fetchImdbData]);

	if (isLoading) return <p>Loading...</p>;
	if (error || !data) return <p>Error fetching movies.</p>;

	// Sort and filter movies based on the props parameters
	const filteredMovies = data.results
		.filter((movie) =>
			movie.title.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.sort((a, b) => {
			if (sortParameter === "Year") {
				return (
					new Date(a.release_date).getTime() -
					new Date(b.release_date).getTime()
				);
			} else if (sortParameter === "Episode") {
				return a.episode_id - b.episode_id;
			} else {
				return a.title.localeCompare(b.title);
			}
		});

	return (
		<div className={styles.moviesContainer}>
			<div className={styles.moviesList}>
				{filteredMovies.map((movie) => (
					<div
						key={movie.episode_id}
						className={`${styles.listItem} ${
							selectedMovieId && selectedMovie?.title === movie.title
								? styles.selectedMovie
								: ""
						}`}
						onClick={() => setSelectedMovieId(movie.url)}>
						<div className={styles.episode}>EPISODE {movie.episode_id}</div>
						<div className={styles.title}>
							Episode {toRoman(movie.episode_id)} - {movie.title}
						</div>
						<div className={styles.rating}>
							<Rating
								rating={Number(imdbRatings[movie.title]?.imdbRating) || 0}
								totalStars={10}
							/>
						</div>
						<div className={styles.releaseDate}>{movie.release_date}</div>
					</div>
				))}
			</div>
			<div className={styles.movieDetailContainer}>
				{selectedMovie && selectedMovieId ? (
					<div>
						<div className={styles.detailTitle}>
							Episode {toRoman(selectedMovie.episode_id)} -{" "}
							{selectedMovie.title}
						</div>
						<div className={styles.detailPoster}>
							{imdbRatings[selectedMovie.title]?.Poster && (
								<img
									src={imdbRatings[selectedMovie.title]?.Poster}
									alt={`${selectedMovie.title} Poster`}
									className={styles.poster}
								/>
							)}
							<div className={styles.detailDescription}>
								{selectedMovie.opening_crawl}
							</div>
						</div>
						<p className={styles.detailDirector}>
							Director: {selectedMovie.director}
						</p>
						<div className={styles.detailRating}>
							Average rating:
							<Rating
								rating={
									Number(imdbRatings[selectedMovie.title]?.imdbRating) || 0
								}
								totalStars={10}
							/>
						</div>
						<div className={styles.detailRatings}>
							{imdbRatings[selectedMovie.title]?.Ratings.map((rating) => (
								<div key={rating.Source} className={styles.ratingSource}>
									{rating.Source}: {rating.Value}
								</div>
							))}
						</div>
					</div>
				) : (
					<p>Click on a movie to see its details</p>
				)}
			</div>
		</div>
	);
};

export default MovieList;
