import MovieCard from "../components/MovieCard";
import "../css/Home.css";
import {useState } from "react";
import {searchMovies,getPopularMovies} from "../services/api";
import { useEffect } from "react";

function Home()
{
    const [searchQuery, setSearchQuery] = useState(""); 
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
     
    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                console.error("Failed to fetch popular movies:", error);
                setError("Failed to fetch popular movies.");
            }
            finally {
                setLoading(false);
            }
        }
        loadPopularMovies();
    },[]);
       

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) {
            setMovies([]);
            return;
        }
        if(loading) return; // Prevent multiple searches while loading
        setLoading(true);
        searchMovies(searchQuery)
            try {
                const results = await searchMovies(searchQuery);
                setMovies(results);
                setError(null); // Clear any previous errors
            }
            catch (error) {
                console.error("Search failed:", error);
                setError("Failed to fetch search results.");
            }
            finally {
                setLoading(false);
            }
    };

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
       {error && <div className="error-message">{error}</div>}
            <h1>Movie List</h1>
             {loading ? (
    <div className="loading">Loading...</div>
  ) : (
    <>
      {movies.length === 0 && !error && searchQuery.trim() && (
        <div className="no-results">
          No movies found for "{searchQuery}".
        </div>
      )}
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </>
  )}
        </div>
    );
}

export default Home;