import styles from "./Header.module.css";

interface HeaderProps {
	setSearchQuery: (query: string) => void;
	searchQuery: string;
	sortParameter: string;
	setSortParameter: (parameter: string) => void;
}

const Header = ({
	setSearchQuery,
	searchQuery,
	sortParameter,
	setSortParameter,
}: HeaderProps) => {
	return (
		<header className={styles.header}>
			<select
				className={styles.select}
				value={sortParameter}
				onChange={(e) => setSortParameter(e.target.value)}>
				<option value="">Sort by...</option>
				<option value="Year">Year...</option>
				<option value="Episode">Episode...</option>
			</select>
			<div className={styles.searchBar}>
				<i className={`fas fa-search ${styles.searchIcon}`}></i>
				<input
					type="text"
					placeholder="Type to search..."
					className={styles.searchInput}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
		</header>
	);
};
export default Header;
