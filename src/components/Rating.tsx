import React from "react";
import "./Rating.css";

interface RatingProps {
	rating: number; // Example: 3.2 will round to 3
	totalStars?: number; // Optional, default 5
}

const Rating: React.FC<RatingProps> = ({ rating, totalStars = 5 }) => {
	const rounded = Math.round(rating);

	return (
		<div className="rating">
			{[...Array(totalStars)].map((_, i) => (
				<span key={i} className={i < rounded ? "star filled" : "star empty"}>
					★
				</span>
			))}
		</div>
	);
};

export default Rating;
