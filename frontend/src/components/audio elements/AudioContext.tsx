"use client";
import { sampleSong } from "@/app/global";
import { Song } from "@/interfaces/interfaces";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGlobal } from "../global/GlobalContext";
import { audio } from "framer-motion/client";

// TODO Fix playNextSong

interface AudioContextType {
  audioRef: React.RefObject<HTMLAudioElement>;
  isShuffled: boolean;
  isPlaying: boolean;
  isLoading: boolean;
  nextSongs: Song[];
  currentTime: string;
  currentSong: Song;
  songHistory: Song[];
  playInfinity: boolean;
  fetchSongs: (amount: number) => void;
  addNextSong: (song: Song) => void;
  playNextSong: () => void;
  shuffleSongs: () => void;
  playSongInList: (song: Song) => void;
  togglePlayPause: () => void;
  playPreviousSong: () => void;
  togglePlayInfinity: () => void;
  setNextSongs: (newLiat: Song[]) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { formatTime, loadFromLocalStorage, saveToLocalStorage, saveAudioState, api } = useGlobal();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>("0:00");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [nextSongs, setNextSongs] = useState<Song[]>([]);
  const [songHistory, setSongHistory] = useState<Song[]>([]);
  const [notShuffledList, setNotShuffledList] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song>(sampleSong);
  const [playInfinity, setPlayInfinity] = useState<boolean>(true);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === "undefined" || !saveAudioState) return;
    setNextSongs(loadFromLocalStorage<Song[]>("nextSongs", []));
    setSongHistory(loadFromLocalStorage<Song[]>("songHistory", []));
    setNotShuffledList(loadFromLocalStorage<Song[]>("notShuffledList", []));
    setCurrentSong(loadFromLocalStorage<Song>("currentSong", sampleSong));
    setPlayInfinity(loadFromLocalStorage<boolean>("playInfinity", true));
    setIsShuffled(loadFromLocalStorage<boolean>("isShuffled", false));
    console.log(currentSong);
  }, []);

  useEffect(() => {
    if (typeof window == "undefined" || !saveAudioState) return;

    saveToLocalStorage("nextSongs", JSON.stringify(nextSongs))
    saveToLocalStorage("songHistory", JSON.stringify(songHistory))
    saveToLocalStorage("notShuffledList", JSON.stringify(notShuffledList))
    saveToLocalStorage("currentSong", JSON.stringify(currentSong))
    saveToLocalStorage("playInfinity", JSON.stringify(playInfinity))
    saveToLocalStorage("isShuffled", JSON.stringify(isShuffled))

    console.log(currentSong, "saved");
  }, [nextSongs, songHistory, notShuffledList, currentSong, playInfinity, isPlaying, isShuffled]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio();
      
      if (saveAudioState) {const lastPlaybackTime = localStorage.getItem("lastPlaybackTime");
        if (lastPlaybackTime) {
          audioRef.current.currentTime = parseFloat(lastPlaybackTime);
        }
        
        if (localStorage.getItem("isPlaying") === "true") {
          audioRef.current.play().catch(console.error);
        }
      }
    }

    return () => {
      if (audioRef.current) {
        if (saveAudioState) {
          localStorage.setItem("lastPlaybackTime", audioRef.current.currentTime.toString());
          localStorage.setItem("isPlaying", (!audioRef.current.paused).toString());
        }
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlayInfinity = () => setPlayInfinity((v) => !v);

  const shuffleSongs = useCallback(() => {
    if (!isShuffled) {
      // Create a deep copy of nextSongs
      const originalOrder = JSON.parse(JSON.stringify(nextSongs));
      setNotShuffledList(originalOrder);

      const shuffled = [...nextSongs];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setNextSongs(shuffled);
      setIsShuffled(true);
    } else {
      setNextSongs(notShuffledList);
      setIsShuffled(false);
    }
  }, [notShuffledList, isShuffled, nextSongs]);

  const selectSong = useCallback((song: Song, continuePlaying = false) => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    setCurrentSong(song);

    const encodedTrackId = encodeURI(song.track_id);
    audioElement.src = `http://pi8080:5000/api/play?t=${encodedTrackId}`;

    if (continuePlaying) {
      audioElement.play().catch(console.error);
    }
  }, []);

  const fetchSongs = async (
    amount = 0,
    load = false,
  ): Promise<Song[] | undefined> => {
    load && setIsLoading(true);
    let returnValue: Song[] = [];
    const songAmount = amount == 0 ? 1 : amount == -1 ? null : amount;
    if (amount == 0) setPlayInfinity(true);
    const response = await api(`/songs?a=${songAmount}`, true);
    if (response.success) {
      const songs = response.data as Song[];
      if (songs.length > 0) {
        setNextSongs(songs);
        returnValue = songs;
      } else {
        console.log("No songs fetched!");
      }
    }

    setIsLoading(false);
    return returnValue;
  };

  const playNextSong = useCallback(
    (repeat = 1, startPlaying = false, ceepinHistory = false) => {
      const audioElement = audioRef.current;
      if (!audioElement || nextSongs.length === 0) return;

      const songsToSkip = Math.min(repeat, nextSongs.length);
      if (songsToSkip === 0) return;

      const wasPlaying = isPlaying;
      audioElement.pause();

      const skipped = [currentSong, ...nextSongs.slice(0, songsToSkip)];
      const remainingSongs = nextSongs.slice(songsToSkip);
      const nextSong = skipped[skipped.length - 1];
      skipped.reverse();

      if (ceepinHistory)
        setSongHistory((prev) => [...skipped.slice(1), ...prev]);
      else setSongHistory((prev) => [currentSong, ...prev]);

      setNextSongs(remainingSongs);

      if (nextSong) {
        selectSong(nextSong, wasPlaying || startPlaying);
      }
    },
    [isPlaying, nextSongs, selectSong, audioRef, currentSong],
  );

  const playPreviousSong = useCallback(() => {
    const audioElement = audioRef.current;
    if (audioElement && audioElement.currentTime > 5) {
      audioElement.currentTime = 0;
      return;
    }
    if (!audioElement || songHistory.length === 0) return;

    const wasPlaying = isPlaying;
    audioElement.pause();
    const [previousSong, ...remainingHistory] = songHistory;
    setSongHistory(remainingHistory);
    setNextSongs((prev) => [currentSong, ...prev]);
    selectSong(previousSong, wasPlaying);
  }, [currentSong, songHistory, selectSong]);

  const togglePlayPause = useCallback(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    if (audioElement.paused) {
      if (currentSong.path === "") {
        playNextSong();
      } else {
        audioElement.play().catch(console.error);
      }
    } else {
      audioElement.pause();
    }
  }, [currentSong, playNextSong]);

  const updateProgress = useCallback(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    const currentTime = audioElement.currentTime;
    setCurrentTime(formatTime(currentTime));

    if (currentTime < currentSong.duration - 5) {
      console.log(currentTime);
    }
  }, []);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    audioElement.addEventListener("timeupdate", updateProgress);
    audioElement.addEventListener("loadedmetadata", updateProgress);
    audioElement.addEventListener("ended", () => playNextSong(1, true));
    audioElement.addEventListener("pause", () => setIsPlaying(false));
    audioElement.addEventListener("play", () => setIsPlaying(true));

    return () => {
      audioElement.removeEventListener("timeupdate", updateProgress);
      audioElement.removeEventListener("loadedmetadata", updateProgress);
      audioElement.removeEventListener("ended", () => playNextSong(1, true));
      audioElement.removeEventListener("pause", () => setIsPlaying(false));
      audioElement.removeEventListener("play", () => setIsPlaying(true));
    };
  }, [updateProgress, playNextSong, setIsPlaying]);

  const addNextSong = useCallback(
    (song: Song) => {
      const songJSON = JSON.parse(JSON.stringify(song));
      const duplicates = nextSongs.map((song) => {
        song.name == songJSON.name;
      });
      song.did = duplicates.length;
      setNextSongs((prev) => [songJSON, ...prev]);
    },
    [nextSongs],
  );

  useEffect(() => {
    if (currentSong.path == "") {
        playNextSong();
    }
    if (nextSongs.length === 0 && playInfinity) {
      fetchSongs();
    } 
  }, [currentSong, playInfinity, nextSongs]);

  useEffect(() => {
    if (songHistory.length > 0) {
      if (songHistory[0].track_id == "00000000") {
        setSongHistory((prev) => [...prev.slice(1)]);
      }
    }
  }, [songHistory]);

  const playSongInList = useCallback(
    (song: Song) => {
      const indexOf = nextSongs.indexOf(song) + 1;
      playNextSong(indexOf);
    },
    [playNextSong],
  );

  return (
    <AudioContext.Provider
      value={{
        audioRef,
        isPlaying,
        nextSongs,
        isLoading,
        isShuffled,
        currentSong,
        currentTime,
        songHistory,
        playInfinity,
        fetchSongs,
        addNextSong,
        setNextSongs,
        shuffleSongs,
        playNextSong,
        playSongInList,
        togglePlayPause,
        playPreviousSong,
        togglePlayInfinity,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
