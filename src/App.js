import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [imageData, setImageData] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (term) {
      setCurrentPage(1);
      searchImages(term, 1);
    }
  };

  const searchImages = async (term, page) => {
    try {
      const response = await fetch(`${backendURL}/api/imagesearch?term=${term}&page=${page}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setImageData(data.images);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImageData([]);
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const response = await fetch(`${backendURL}/api/recent`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setRecentSearches(data.recentSearches);
    } catch (error) {
      console.error("Error fetching recent searches:", error);
      setRecentSearches([]);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    searchImages(searchTerm, page);
  };

  return (
    <div className="App">
      <h1>Image Search App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="results">
        {imageData.length > 0 ? (
          imageData.map((image) => (
            <div className="image-item" key={image.id}>
              <img src={image.url} alt={image.description} />
              <p>{image.description || "No description"}</p>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <div className="recent-searches">
        <h2>Recent Searches</h2>
        <ul>
          {recentSearches.map((search) => (
            <li key={search._id}>{search.term ? search.term : "No term available"}</li>
          ))}
        </ul>
      </div>

      <footer>
        <h4>Created by Ariana Spretz - 2024</h4>
      </footer>
    </div>
  );
}

export default App;
