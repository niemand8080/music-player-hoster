"use client";
import React from "react";
import { useAudio } from "@/components/audio elements/AudioContext";

const Page: React.FC = () =>  {
  const { currentSong } = useAudio();
  return (
    <div className="flex h-screen w-full items-center justify-center">
      Random Player: {currentSong.name}
    </div>
  );
}

export default Page