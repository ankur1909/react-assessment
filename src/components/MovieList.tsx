import { useState } from "react";
import {
	useGetMoviesQuery,
	useGetMovieDetailsQuery,
} from "../features/movies/moviesAPI";
import styles from "./MovieList.module.css";

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
	// Explicitly type the useGetMoviesQuery hook with MoviesApiResponse
	const { data, isLoading, error } = useGetMoviesQuery();
	const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
	const { data: selectedMovie } = useGetMovieDetailsQuery(selectedMovieId!, {
		skip: selectedMovieId === null,
	});

	if (isLoading) return <p>Loading...</p>;
	if (error || !data) return <p>Error fetching movies.</p>;

	// Sort and filter movies based on the selected parameters
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
						className={styles.listItem}
						onClick={() => setSelectedMovieId(movie.url)}>
						<div className={styles.episode}>EPISODE {movie.episode_id}</div>
						<div className={styles.title}>
							Episode {toRoman(movie.episode_id)} - {movie.title}
						</div>
						<div className={styles.releaseDate}>{movie.release_date}</div>
					</div>
				))}
			</div>
			<div className={styles.movieDetailContainer}>
				{selectedMovie ? (
					<div>
						<div className={styles.detailTitle}>
							Episode {toRoman(selectedMovie.episode_id)} -{" "}
							{selectedMovie.title}
						</div>
						<p className={styles.detailDescription}>
							{selectedMovie.opening_crawl}
						</p>
						<p className={styles.detailDirector}>
							Director: {selectedMovie.director}
						</p>
					</div>
				) : (
					<p>Click on a movie to see its details</p>
				)}
			</div>
		</div>
	);
};

export default MovieList;
