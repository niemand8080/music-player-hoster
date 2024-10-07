"use client";
import React, { useState } from "react";
import { Song } from "@/interfaces/interfaces";
import { AlignJustify, RotateCw } from "lucide-react";
import Loader from "../common/Loader";
import NumberInput from "../common/NumberInput";
import { useAudio } from "../audio elements/AudioContext";
import { useGlobal } from "../global/GlobalContext";

// TODO make it draggable

interface SimpleSongDisplayProps {
  song?: Song;
  addSongs?: boolean;
  draggable?: boolean;
  load?: boolean;
}

const SimpleSongDisplay: React.FC<SimpleSongDisplayProps> = ({
  song,
  addSongs = false,
  draggable = false,
  load = false,
}) => {
  const { formatTime } = useGlobal();
  const { playSongInList, fetchSongs, playInfinity } = useAudio();

  if (!song) {
    const [loadAmount, setLoadAmount] = useState<number>(-1);
    const [loading, setLoading] = useState<boolean>(false);
    return (
      <>
        <div
          className={`${playInfinity ? "p-1" : "p-3 text-gray-400"} group z-0 ml-1 flex h-14 w-full cursor-default items-center justify-between rounded-xl bg-gray-800`}
        >
          {playInfinity && load || loading ? (
            <div className="flex w-3/4 items-center gap-2">
              <div className="relative h-12 min-w-12 overflow-hidden rounded-lg bg-gray-600 transition-all">
                <Loader loading stokeColor="#9ca3af" />
              </div>
              <div className="flex w-full flex-col gap-1">
                <span className="no-select flex h-3 w-24 items-center bg-white text-white opacity-80">
                  ...
                </span>
                <span className="no-select flex h-3 w-20 items-center bg-gray-400 text-gray-400 opacity-80">
                  ...
                </span>
              </div>
            </div>
          ) : addSongs ? (
            <div className="flex h-full w-full items-center gap-2">
              Set amount of songs to load:
              <div className="h-full w-20">
                <NumberInput onChange={setLoadAmount} defaultValue={-1} />
              </div>
              <button
                onClick={() => {
                  fetchSongs(loadAmount);
                  setLoading(true);
                }}
                className="flex h-8 w-16 items-center justify-center rounded-lg bg-indigo-500 px-4 py-[6px] text-white transition-all active:opacity-50"
              >
                <RotateCw
                  size={20}
                  className={`text-white transition-all group-active:scale-90`}
                />
              </button>
            </div>
          ) : (
            <span className="text-gray-400">No Songs...</span>
          )}
        </div>
      </>
    );
  }

  const { name, artist_name, duration } = song;
  return (
    <div
      onClick={() => playSongInList(song)}
      draggable={draggable}
      className={`${draggable ? "active:cursor-grabbing" : ""} group z-0 ml-1 flex h-14 w-full cursor-pointer items-center justify-between rounded-xl bg-gray-800 p-1 transition-all hover:bg-gray-700`}
    >
      <div className="flex w-3/4 items-center gap-2">
        <div className="h-12 min-w-12 overflow-hidden rounded-lg bg-gray-600 transition-all" />
        <div className="flex w-full flex-col leading-5">
          <span className="no-select truncate font-bold">{name}</span>
          <span className="no-select truncate text-gray-400">
            {artist_name}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <span>{formatTime(duration)}</span>
        <div className="mr-1 flex h-10 w-10 items-center justify-center text-gray-500 transition-all group-hover:text-white">
          <AlignJustify size={30} className="" />
        </div>
      </div>
    </div>
  );
};

export default SimpleSongDisplay;
