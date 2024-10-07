import React from "react";
import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  loading: boolean;
  size?: number;
  stokeColor?: string;
}

const Loader: React.FC<LoaderProps> = ({ loading, size = 24, stokeColor = "currentColor" }) => {
  return (
    <div className={`absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center cursor-wait ${loading ? "" : "pointer-events-none"}`}>
      <LoaderCircle
        size={size}
        className={`${loading ? "" : "opacity-0"} animate-spin transition-all`}
        color={stokeColor}
      />
    </div>
  );
};

export default Loader;
