"use client";
import React, { useState } from "react";
import { Play, SkipBack, SkipForward, Ellipsis, Pause, Shuffle, History, Infinity } from "lucide-react";
import AudioProgressBar from "@/components/audio elements/AudioProgressBar";
import VolumeBar from "@/components/audio elements/VolumeBar";
import Loader from '@/components/common/Loader'
import SimpleSongDisplay from "../song/SimpleSongDisplay";
import SearchBar from "../common/SearchBar";
import SelectButon from "../common/SelectButon";
import { useAudio } from "@/components/audio elements/AudioContext";
import { useGlobal } from "../global/GlobalContext";
import Blur from "../common/Blur";

const MusicLayout: React.FC = () => {
  const {
    audioRef,
    isPlaying,
    nextSongs,
    isLoading,
    isShuffled,
    currentSong,
    currentTime,
    songHistory,
    playInfinity,
    addNextSong,
    shuffleSongs,
    playNextSong,
    togglePlayPause,
    playPreviousSong,
    togglePlayInfinity,
  } = useAudio();
  const { copyToClipboard, formatTime } = useGlobal();

  const [displayHistory, setDisplayHistory] = useState<boolean>(false);
  return (
    <>
      <div
        className={`flex h-3/4 w-4/5 gap-5 rounded-lg bg-gray-800 p-6 shadow-xl transition-all ${isLoading ? "scale-95 opacity-80 blur-[1px] grayscale-[0.25]" : ""} ease-in-out duration-200`}
      >
        <Loader loading={isLoading} size={50} />
        <div
          className={`h-full w-1/2 min-w-[50%] overflow-hidden rounded-lg bg-gradient-to-br from-gray-700 to-gray-600 transition-all`}
        ></div>
        <div className={`flex w-1/2 min-w-[50%] flex-col justify-between p-5`}>
          <div className="mt-2">
            <div className="flex justify-between">
              <h2
                className={`w-10/12 h-10 truncate text-clip text-4xl font-semibold text-white relative`}
              >
                <Blur pos="right" width="1.5rem" absolute />
                <span className="absolute top-0 left-0">{currentSong.name}</span>
              </h2>
              <SelectButon 
                options={[
                  { name: "Play Next", icon: "ListStart", func: () => addNextSong(currentSong) },
                  { name: "Copy Name", icon: "Copy", func: () => copyToClipboard(currentSong.name) },
                  { name: "Copy Track ID", icon: "Copy", func: () => copyToClipboard(currentSong.track_id) },
                ]}
                floatPercentag={100}
                className="group h-8 w-8 rounded-full p-1 text-white"
                activeClass="bg-indigo-500 hover:bg-indigo-600"
                notActiveClass="bg-gray-500 hover:bg-indigo-500"
              >
                <Ellipsis size={24} className="group-active:scale-90 transition-all text-white" />
              </SelectButon>
            </div>
            <div className={`mt-2 w-10/12 truncate text-lg text-gray-400 flex items-center gap-2`}>
                {/* TODO links to songs / artists */}
              <a>{currentSong.artist_name || "Unknown"}</a>
              <div className="h-2 w-2 rounded-full bg-gray-500" />
              <a>{currentSong.album || "Unknown"}</a>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center">
              <SearchBar searchIn={displayHistory ? "History" : "Next Songs"} />
              <button onClick={() => setDisplayHistory((value) => !value)} className={`group ${displayHistory ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-500 hover:bg-gray-600"} py-2 px-4 items-center justify-center flex w-20 h-10 rounded-xl transition-all active:opacity-50 opacity-80`}>
                <History size={24} className="group-active:scale-90 transition-all text-white" />
              </button>
              <button onClick={shuffleSongs} disabled={displayHistory || playInfinity} className={`group ${isShuffled ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-500 hover:bg-gray-600"} py-2 px-4 items-center justify-center flex w-20 h-10 rounded-xl transition-all active:opacity-50 opacity-80 disabled:bg-gray-700 disabled:opacity-55`}>
                <Shuffle size={24} className="group-active:scale-90 transition-all text-white" />
              </button>
              <button onClick={togglePlayInfinity} className={`group ${playInfinity ? "bg-indigo-500 hover:bg-indigo-600" : "bg-gray-500 hover:bg-gray-600"} py-2 px-4 items-center justify-center flex w-20 h-10 rounded-xl transition-all active:opacity-50 opacity-80`}>
                <Infinity size={28} className="group-active:scale-90 transition-all text-white" />
              </button>
            </div>
            <div className="w-full h-80 overflow-y-scroll overflow-x-hidden pr-2 no-select relative">
              <Blur pos="top" height="12px" blurPercent={100} />
              <div className="h-1"></div>
              {displayHistory ? songHistory.length == 0 ? (
                <SimpleSongDisplay />
              ) : songHistory.map((song, index) => (
                <SimpleSongDisplay key={index} song={song} />
              )) : nextSongs.length == 0 ? (
                <SimpleSongDisplay addSongs={!playInfinity} load={true} />
              ) :  nextSongs.map((song, index) => (
                <SimpleSongDisplay draggable key={index} song={song} />
              ))}
              {!displayHistory ? (
                <div className="px-3 text-gray-400">
                  {nextSongs.length} Songs: {formatTime(nextSongs.map((s) => s.duration).reduce((a, b) => a + b, 0))}
                </div>
              ) : null}
              <Blur pos="bottom" height="100px" blurPercent={50} />
            </div>
          </div>

          <div className={`transition-all`}>
            <div className="mb-4 flex flex-col items-center justify-between" draggable={false}>
              <AudioProgressBar />
              <div className="mt-1 flex w-full justify-between text-sm text-gray-400 no-select">
                <div>{currentTime}</div>
                <div>{formatTime(currentSong.duration)}</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-6">
              <button
                onClick={playPreviousSong}
                disabled={isLoading || (songHistory.length == 0 && (audioRef.current ? audioRef.current.currentTime <= 5 : true))}
                className="flex h-8 w-8 items-center justify-center text-gray-400 transition-all hover:text-white disabled:text-gray-600 active:opacity-50 active:scale-95"
              >
                <SkipBack size={24} fill="currentColor" />
              </button>
              <button
                onClick={togglePlayPause}
                disabled={isLoading}
                className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 p-2 text-white transition-all hover:bg-indigo-600 disabled:bg-gray-600 disabled:text-gray-400"
              >
                <Play
                  size={isPlaying ? 14 : 24}
                  fill="currentColor"
                  className={`${isPlaying ? "opacity-0" : ""} absolute transition-all duration-300`}
                />
                <Pause
                  size={isPlaying ? 24 : 14}
                  fill="currentColor"
                  className={`${isPlaying ? "" : "opacity-0"} absolute transition-all duration-300`}
                />
              </button>
              <button
                onClick={() => playNextSong()}
                disabled={isLoading || nextSongs.length == 0}
                className="flex h-8 w-8 items-center justify-center text-gray-400 transition-all hover:text-white disabled:text-gray-600 active:opacity-50 active:scale-95"
              >
                <SkipForward size={24} fill="currentColor" />
              </button>
            </div>

            <div className={`mt-6 transition-all`}>
              <VolumeBar loading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MusicLayout;
