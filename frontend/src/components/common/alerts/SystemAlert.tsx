"use client";
import React, { useEffect, useRef, useState } from "react";
import { CircleAlert, TriangleAlert, MessageCircle } from "lucide-react";
import { SysAlert } from "@/interfaces/interfaces";
import Blur from "../Blur";

const SystemAlert: React.FC<{ alert: SysAlert; onClick: () => void }> = ({
  alert,
  onClick,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const { type, description } = alert;
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      onClick={onClick}
      className={`${isVisible ? "" : "scale-0"} ${type == "error" ? "rounded-[22px] bg-red-500" : type == "warning" ? "rounded-lg bg-yellow-500" : "rounded-r-[22px] rounded-t-[22px] rounded-bl-md bg-indigo-500"} group absolute bottom-5 right-5 z-50 flex h-11 cursor-pointer items-center p-1 font-bold transition-all hover:rounded-md shadow-lg`}
    >
      <span
        ref={spanRef}
        className={`relative max-w-0 overflow-hidden truncate text-clip transition-all duration-200 group-hover:ml-1 group-hover:mr-2 group-hover:max-w-60`}
      >
        <Blur
          pos="right"
          width="1.5rem"
          absolute
          gradientColor="#ef4444"
          visible={spanRef.current ? spanRef.current.scrollWidth >= 240 : true}
        />
        {description}
      </span>
      {type == "error" ? (
        <CircleAlert size={36} />
      ) : type == "warning" ? (
        <TriangleAlert size={36} />
      ) : (
        <MessageCircle size={36} />
      )}
    </div>
  );
};

export default SystemAlert;
