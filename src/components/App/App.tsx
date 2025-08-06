import { useEffect, useState } from "react";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import { type Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import ReactPaginate from "react-paginate";
import MovieModal from "../MovieModal/MovieModal";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export default function App() {
  const [movie, setMovie] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSubmit = (value: string) => {
    setMovie(value);
  };
  const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };
  const handleModalClose = () => {
    setSelectedMovie(null);
  };

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["movie", movie, page],
    queryFn: () => fetchMovies(movie, page),
    enabled: movie !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 0;
  useEffect(() => {
    if (data?.results.length === 0) {
      toast("No movies found for your request.");
    }
  }, [data]);
  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSubmit} />
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {data && data?.results.length > 0 && (
        <MovieGrid onSelect={handleSelect} movies={data.results} />
      )}
      {selectedMovie && (
        <MovieModal onClose={handleModalClose} movie={selectedMovie} />
      )}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
    </div>
  );
}
