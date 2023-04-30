"use client";
import React, { useState, useEffect } from "react";
import SearchAnimeCard from "@/components/SearchAnimeCard";
import { TSearchAnime } from "@/@types/AnimeType";
import useAnime from "@/hooks/useAnime";
import Loading from "@/components/LoadingSingle";
import Link from "next/link";

function Search() {
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState<TSearchAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const { getSearch } = useAnime();

  useEffect(() => {
    if (search === "") return setSearchFilter([]);
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      const data = await getSearch(search);
      setSearchFilter(data.results.slice(0, 5));
      setLoading(false);
    }, 1000);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [search]);

  const handleSearchCallback = () => {
    setSearch("");
    setSearchFilter([]);
  };

  return (
    <>
      <input
        type="text"
        placeholder="Search Anime"
        className="input input-bordered w-full lg:input-md input-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="absolute z-[99] w-full lg:w-auto">
        <div className="mt-1 bg-base-100 shadow-lg rounded-lg w-full lg:w-[400px]">
          {(searchFilter.length === 0 && search !== "") || loading ? (
            <div className="flex w-full gap-5 p-10 items-center justify-center">
              <Loading />
            </div>
          ) : searchFilter.length > 0 ? (
            <>
              {searchFilter.map((anime) => (
                <SearchAnimeCard
                  key={anime.id}
                  id={anime.id}
                  title={
                    anime.title !== ""
                      ? anime.title
                      : anime.id.split("-").join(" ").toString()
                  }
                  src={anime.image}
                  additional={
                    anime.releaseDate + " | " + anime.subOrDub.toUpperCase() ??
                    ""
                  }
                  cb={handleSearchCallback}
                />
              ))}
              <Link
                className="btn btn-secondary w-full"
                href={`/search?q=${encodeURIComponent(search)}`}
                onClick={handleSearchCallback}
              >
                See More
              </Link>
            </>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
