import axios from "axios";
import type { Movie } from "../types/movie";
interface FetchMoviesProps {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (query: string, page: number) => {
  const response = await axios.get<FetchMoviesProps>(
    "https://api.themoviedb.org/3/search/movie",
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
      params: {
        page,
        resultsPerPage: 10,
        query,
      },
    }
  );
  return response.data;
};
