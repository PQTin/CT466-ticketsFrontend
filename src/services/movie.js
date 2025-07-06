import api from "./api";

export const createMovie = (formData) => {
  return api.post("/movie", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateMovie = (id, formData) => {
  return api.put(`/movie/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const softDeleteMovie = (id) => {
  return api.delete(`/movie/${id}`);
};

export const getAllMovies = () => {
  return api.get("/movie/all-movies");
};

export const getMoviesByGenre = (theLoaiId) => {
  return api.get(`/movie/movies-by-genre/${theLoaiId}`);
};

export const createGenre = (data) => {
  return api.post("/movie/genre", data);
};

export const updateGenre = (id, data) => {
  return api.put(`/movie/genre/${id}`, data);
};

export const deleteGenre = (id) => {
  return api.delete(`/movie/genre/${id}`);
};
export const getAllGenres = () => {
  return api.get("/movie/genre");
};

export const getMovieById = (id) => {
  return api.get(`/movie/movie-by-id/${id}`);
};

export const getCommentsByMovieId = (id) => {
  return api.get(`/movie/comments-by-id/${id}`);
};

export const rateMovie = (data) => {
  return api.post("/movie/rate-movie", data);
};

export const getShowtimesByMovieId = (id) => {
  return api.get(`/movie/showtimes-by-id/${id}`);
};
