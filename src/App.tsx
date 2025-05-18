import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Header from "./components/Header";
import MovieList from "./components/MovieList";

const App: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [sortParameter, setSortParameter] = useState("");
	return (
		<Provider store={store}>
			<div style={{ display: "flex" }}>
				<div style={{ flex: 1 }}>
					<Header
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						sortParameter={sortParameter}
						setSortParameter={setSortParameter}
					/>
					<MovieList searchQuery={searchQuery} sortParameter={sortParameter} />
				</div>
			</div>
		</Provider>
	);
};

export default App;
