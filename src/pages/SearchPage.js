import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  MdFilterList,
  MdRefresh,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import Card from "../components/Card";
import ScrollToTop from "../components/ScrollToTop";
import LoadingSpinner from "../components/LoadingSpinner";

const GENRES = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

const RATING_RANGES = [
  { label: "9점 이상", min: 9, max: 10 },
  { label: "8-9점", min: 8, max: 8.9 },
  { label: "7-8점", min: 7, max: 7.9 },
  { label: "6-7점", min: 6, max: 6.9 },
  { label: "5-6점", min: 5, max: 5.9 },
  { label: "4-5점", min: 4, max: 4.9 },
  { label: "4점 이하", min: 0, max: 3.9 },
];

const SORT_OPTIONS = [
  { value: "vote_average.desc", label: "평점 높은순" },
  { value: "vote_average.asc", label: "평점 낮은순" },
  { value: "release_date.desc", label: "최신순" },
  { value: "release_date.asc", label: "오래된순" },
];

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    with_genres: "",
    vote_average_gte: "",
    vote_average_lte: "",
    primary_release_year: "",
    sort_by: "popularity.desc",
  });

  const sortMovies = (movies, sortBy) => {
    const sortedMovies = [...movies];
    switch (sortBy) {
      case "vote_average.desc":
        return sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
      case "vote_average.asc":
        return sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
      case "popularity.desc":
        return sortedMovies.sort((a, b) => b.popularity - a.popularity);
      case "popularity.asc":
        return sortedMovies.sort((a, b) => a.popularity - b.popularity);
      case "release_date.desc":
        return sortedMovies.sort(
          (a, b) =>
            new Date(b.release_date || "1900") -
            new Date(a.release_date || "1900")
        );
      case "release_date.asc":
        return sortedMovies.sort(
          (a, b) =>
            new Date(a.release_date || "1900") -
            new Date(b.release_date || "1900")
        );
      default:
        return sortedMovies;
    }
  };

  const fetchMovies = async (page = 1) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const params = {
        api_key: process.env.REACT_APP_API_KEY,
        language: "ko-KR",
        query: query,
        page,
        include_adult: false,
        "vote_count.gte": 20,
        "release_date.lte": new Date().toISOString().split("T")[0],
      };

      if (filters.with_genres) {
        params.with_genres = filters.with_genres;
      }
      if (filters.primary_release_year) {
        params.primary_release_year = filters.primary_release_year;
      }

      const response = await axios.get(
        "https://api.themoviedb.org/3/search/movie",
        { params }
      );

      let filteredMovies = response.data.results.filter(
        (movie) =>
          movie &&
          movie.poster_path &&
          (!filters.vote_average_gte ||
            movie.vote_average >= Number(filters.vote_average_gte)) &&
          (!filters.vote_average_lte ||
            movie.vote_average <= Number(filters.vote_average_lte))
      );

      const sortedMovies = sortMovies(filteredMovies, filters.sort_by);

      setMovies(sortedMovies);
      setTotalPages(Math.min(response.data.total_pages, 500));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1);
  }, [query, filters]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMovies(currentPage);
    }
  }, [currentPage]);

  useEffect(() => {
    if (movies.length > 0) {
      const sortedMovies = sortMovies(movies, filters.sort_by);
      setMovies(sortedMovies);
    }
  }, [filters.sort_by]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleRatingChange = (range) => {
    if (range) {
      const selectedRange = RATING_RANGES.find(
        (r) => `${r.min}-${r.max}` === range
      );
      if (selectedRange) {
        setFilters((prev) => ({
          ...prev,
          vote_average_gte: selectedRange.min,
          vote_average_lte: selectedRange.max,
        }));
      }
    } else {
      setFilters((prev) => ({
        ...prev,
        vote_average_gte: "",
        vote_average_lte: "",
      }));
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      with_genres: "",
      vote_average_gte: "",
      vote_average_lte: "",
      primary_release_year: "",
      sort_by: "popularity.desc",
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto">
        {/* 검색 결과 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">"{query}" 검색 결과</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
          >
            <MdFilterList /> 필터 {showFilters ? "숨기기" : "표시"}
          </button>
        </div>

        {/* 필터 섹션 */}
        {showFilters && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MdFilterList /> 필터
              </h2>
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                <MdRefresh /> 초기화
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* 장르 필터 */}
              <div>
                <label className="block text-sm font-medium mb-2">장르</label>
                <select
                  value={filters.with_genres}
                  onChange={(e) =>
                    handleFilterChange("with_genres", e.target.value)
                  }
                  className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">전체 장르</option>
                  {Object.entries(GENRES).map(([id, name]) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 평점 필터 */}
              <div>
                <label className="block text-sm font-medium mb-2">평점</label>
                <select
                  value={
                    filters.vote_average_gte && filters.vote_average_lte
                      ? `${filters.vote_average_gte}-${filters.vote_average_lte}`
                      : ""
                  }
                  onChange={(e) => handleRatingChange(e.target.value)}
                  className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">전체 평점</option>
                  {RATING_RANGES.map((range) => (
                    <option
                      key={range.label}
                      value={`${range.min}-${range.max}`}
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 개봉년도 필터 */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  개봉년도
                </label>
                <select
                  value={filters.primary_release_year}
                  onChange={(e) =>
                    handleFilterChange("primary_release_year", e.target.value)
                  }
                  className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">전체 년도</option>
                  {Array.from(
                    { length: 50 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  ))}
                </select>
              </div>

              {/* 정렬 필터 */}
              <div>
                <label className="block text-sm font-medium mb-2">정렬</label>
                <select
                  value={filters.sort_by}
                  onChange={(e) =>
                    handleFilterChange("sort_by", e.target.value)
                  }
                  className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 검색 결과 그리드 */}
        <div className="mb-8">
          {loading ? (
            <div className="w-full h-[450px]">
              <LoadingSpinner />
            </div>
          ) : movies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {query ? "검색 결과가 없습니다" : "검색어를 입력해주세요"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map((movie) => (
                <Card key={movie.id} data={movie} />
              ))}
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {movies.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8 mb-12">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full
                ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
              <MdChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, idx) => {
                const pageNum = currentPage - 2 + idx;
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center
                        ${
                          currentPage === pageNum
                            ? "bg-red-600 text-white"
                            : "bg-gray-700 text-white hover:bg-gray-600"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center w-10 h-10 rounded-full
                ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
            >
              <MdChevronRight size={24} />
            </button>

            <div className="text-sm text-gray-400 ml-4">
              {currentPage} / {totalPages} 페이지
            </div>
          </div>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
};

export default SearchPage;
