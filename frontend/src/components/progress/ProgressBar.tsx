"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";

interface ProgressBarProps {
  loading?: boolean;
  defaultProgress: number;
  currentProgress: number;
  updateProgress: (progress: number) => void;
  handleMouseDown?: () => void;
  handleMouseUp?: () => void;
  setDragging?: (draging: boolean) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ loading, defaultProgress, currentProgress, updateProgress, handleMouseDown, handleMouseUp, setDragging }) => {
  const [progress, setProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateBarProgress = useCallback((clientX: number) => {
    const containerElement = containerRef.current;
    if (!containerElement) return;

    const rect = containerElement.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setProgress(pos * 100);
    
    updateProgress(pos * 100);
  }, []);

  const handleMouseDownIntern = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    updateBarProgress(e.clientX);
    if (handleMouseDown) handleMouseDown();
  }, [updateBarProgress]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setIsMoving(true);
      updateBarProgress(e.clientX);
    }
  }, [isDragging, updateBarProgress]);

  const handleMouseUpIntern = useCallback(() => {
    setIsDragging(false);
    setIsMoving(false);
    if (handleMouseUp) handleMouseUp();
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpIntern);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpIntern);
    };
  }, [handleMouseMove, handleMouseUpIntern]);

  useEffect(() => {
    setProgress(defaultProgress);
  }, [defaultProgress]);

  useEffect(() => {
    setProgress(currentProgress);
  }, [currentProgress]);

  useEffect(() => {
    setDragging && setDragging(isDragging);
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      role="slider"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      tabIndex={0}
      onMouseDown={handleMouseDownIntern}
      className={`${isDragging ? "h-2" : "h-1.5"} overflow-hidden w-full rounded-full bg-gray-700 cursor-pointer transition-all`}
    >
      <div 
        className={`${isDragging ? "h-2" : "h-1.5"} ${loading ? "bg-gray-500" : "bg-indigo-500"} ${isMoving ? "" : "transition-all"}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;