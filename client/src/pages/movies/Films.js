import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import Movie from "./components/Movies";
import "./movies.scss"

const FEATURED_API =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=7ecd0b11bc4cd387a22b43cb37086584";
const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?&api_key=7ecd0b11bc4cd387a22b43cb37086584&query=";

function Films() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getMovies = (API) => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();

    if (searchTerm) {
      getMovies(`${SEARCH_API}${searchTerm}`);
      setSearchTerm("");
    }
  };

  const handleOnChange = (event) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    getMovies(FEATURED_API);
  }, []);

  return (
    <div className="movie-div">
      <header>
        <Link to="/"> <button className="go-back-movies"><i className="fa fa-arrow-left" aria-hidden="true"></i></button></Link>
        <form onSubmit={handleOnSubmit}>
          <input
            type="search"
            className="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleOnChange}
          />
        </form>
      </header>
      <div style={{ height: !movies.length ? 0 : null }} className="movie-container">
        {movies.length > 0 ?
          movies.map((movie) => <Movie key={movie.id} {...movie} />)
          : <Spinner animation="border" variant="dark" />}
      </div>
    </div>
  );
}

export default Films;