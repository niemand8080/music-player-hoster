"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Song } from "@/interfaces/interfaces";
import BoldChars from "./BoldChars";
import { useAudio } from "../audio elements/AudioContext";
import { useGlobal } from "../global/GlobalContext";
import { Beef, ListStart } from "lucide-react";
import Blur from "./Blur";

interface SearchBarProps {
  searchIn: "DB" | "History" | "Next Songs";
  placeholder?: string;
}

const DisplaySong: React.FC<{
  song: Song;
  inputRef: React.RefObject<HTMLInputElement>;
  handleClick: (song: Song, nextSong: boolean) => void;
}> = ({ song, inputRef, handleClick }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      onClick={() => handleClick(song, false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex w-full cursor-pointer items-center justify-between gap-2 truncate py-1 pl-2 pr-1 transition-all first:rounded-t-lg last:rounded-b-lg hover:bg-gray-700"
    >
      <span className="relative w-full overflow-hidden">
        <BoldChars
          filter={
            inputRef.current?.value.toUpperCase().replaceAll(" ", "") ?? ""
          }
          query={song.name}
        />
        <Blur
          pos="right"
          absolute
          width="1.5rem"
          isHovered={isHovered}
          hoverColor="#374151"
        />
      </span>

      <button
        onClick={() => handleClick(song, true)}
        className="flex h-8 w-9 items-center justify-center rounded-md hover:bg-gray-600"
      >
        <ListStart size={24} />
      </button>
    </div>
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ searchIn, placeholder }) => {
  const { playSongInList, nextSongs, songHistory, addNextSong } = useAudio();
  const { api, filter } = useGlobal();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filteredList, setFilteredList] = useState<Song[]>([]);
  const [filteredListHidden, setFilteredListHidden] = useState<boolean>(true);
  let lastCall = 0;

  const filterItems = useCallback(async () => {
    const inputElement = inputRef.current;
    if (!inputElement) return;

    const filtered = await filter(inputElement.value, searchIn == "History" ? songHistory : searchIn == "Next Songs" ? nextSongs : "DB")
    
    setFilteredList(filtered);
    setFilteredListHidden(filtered.length == 0);
  }, [nextSongs, songHistory]);

  const handleClick = (song: Song, nextSong: boolean) => {
    const now = new Date().getTime();
    const inputElement = inputRef.current;
    if (!inputElement || (lastCall + 100 > now && !nextSong)) return;
    if (nextSong) {
      addNextSong(song);
      lastCall = now;
      setFilteredListHidden(false);
    } else {
      playSongInList(song);
      setFilteredListHidden(true);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setFilteredListHidden(true);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    filterItems();
  }, [nextSongs, songHistory]);

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="search"
        onChange={filterItems}
        onClick={() => inputRef.current?.select()}
        placeholder={placeholder || `Search in ${searchIn}...`}
        className="h-10/12 w-full rounded-lg border-2 border-gray-600 bg-transparent p-2 outline-none"
      />
      <div
        className={`${filteredList.length <= 0 || filteredListHidden ? "opacity-0 duration-75" : "mt-2 duration-300"} absolute z-50 w-full rounded-lg border-2 border-gray-600 bg-gray-800 transition-all`}
      >
        {filteredList.length > 0
          ? filteredList.map((song, index) => (
              <DisplaySong
                key={index}
                song={song}
                handleClick={(song, nextSongs) => handleClick(song, nextSongs)}
                inputRef={inputRef}
              />
            ))
          : null}
      </div>
    </div>
  );
};

export default SearchBar;
