"use client";
import React, { useState } from "react";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import ProgressBar from "../progress/ProgressBar";
import { useAudio } from "./AudioContext";

interface Props {
  loading: boolean;
}

const VolumeBar: React.FC<Props> = ({ loading }) => {
  const { audioRef } = useAudio();
  const [progress, setProgress] = useState<number>(100);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const changeVolume = () => {
    let pos = 100
    if (progress == 100) {
      pos = 0
    } else if (progress >= 66) {
        pos = 100
    } else if (progress >= 33) {
        pos = 66
    } else {
        pos = 33
    }
    setProgress(pos);
    changeVolumeTo(pos);
  };

  const changeVolumeTo = (volume: number) => {
    setProgress(volume);
    const audioElement = audioRef.current;
    if (!audioElement) return;
    audioElement.volume = volume / 100;
  };

  return (
    <div className="group h-7 flex justify-center items-center gap-2">
      <div
        onClick={changeVolume}
        className={`${isDragging ? "text-gray-50" : "text-gray-500"} relative flex h-7 w-7 cursor-pointer items-center justify-center transition-all duration-75 group-hover:text-gray-50`}
      >
        <VolumeX
          size={24}
          className={`absolute transition-all ${progress == 0 ? "opacity-100" : "opacity-0"}`}
        />
        <Volume2
          size={24}
          className={`absolute transition-all ${progress > 66 ? "opacity-100" : "opacity-0"}`}
        />
        <Volume1
          size={24}
          className={`absolute transition-all ${progress > 33 ? "opacity-100" : "opacity-0"}`}
        />
        <Volume
          size={24}
          className={`absolut transition-all ${progress > 0 ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <ProgressBar 
        currentProgress={progress} 
        updateProgress={changeVolumeTo} 
        defaultProgress={100} 
        loading={loading} 
        setDragging={setIsDragging}
      />
    </div>
  );
};

export default VolumeBar;
