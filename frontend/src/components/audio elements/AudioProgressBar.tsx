import React, { useEffect, useState, useCallback, useRef } from "react";
import ProgressBar from "../progress/ProgressBar";
import { useAudio } from "./AudioContext";

// TODO nicht acurat

const AudioProgressBar: React.FC = () => {
  const { audioRef, currentSong } = useAudio();
  const [progress, setProgress] = useState<number>(0);
  const [wasPlaying, setWasPlaying] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const currentSongRef = useRef(currentSong);

  useEffect(() => {
    currentSongRef.current = currentSong;
  }, [currentSong]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      if (!isDragging) {
        const progress = (audioElement.currentTime / currentSongRef.current.duration) * 100;
        setProgress(progress);
      }
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audioRef, isDragging]);

  const updateAudioTime = useCallback((pos: number) => {
    setProgress(pos);
    const audioElement = audioRef.current;
    if (!audioElement) return;
    audioElement.currentTime = (pos / 100) * currentSongRef.current.duration;
  }, [audioRef]);

  const smartPause = useCallback(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    setIsDragging(true);
    setWasPlaying(!audioElement.paused);
    audioElement.pause();    
  }, [audioRef]);

  useEffect(() => {
    if (!isDragging && wasPlaying) {
      audioRef.current?.play();
      setWasPlaying(false);
    }
  }, [isDragging, wasPlaying, audioRef]);

  return (
    <div className="h-2 flex items-center w-full" draggable={false}>
      <ProgressBar 
        defaultProgress={0} 
        currentProgress={progress} 
        handleMouseDown={smartPause} 
        handleMouseUp={() => setIsDragging(false)} 
        updateProgress={updateAudioTime}
      />
    </div>
  );
};

export default AudioProgressBar;