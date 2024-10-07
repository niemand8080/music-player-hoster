"use client";
import React, { useEffect, useRef, useState } from "react";
import { ListStart, Copy } from "lucide-react";

type icons = "ListStart" | "Copy";

interface SelectButonProps {
  children: React.ReactNode;
  className: string;
  notActiveClass?: string;
  activeClass?: string;
  floatPercentag?: number;
  options: {
    name?: string;
    desc?: string;
    icon?: icons;
    state?: "danger";
    func?: () => void;
    border?: boolean;
  }[];
}

const SelectButon: React.FC<SelectButonProps> = ({
  children,
  className,
  notActiveClass,
  floatPercentag = 0,
  activeClass,
  options,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setIsActive(false), 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleActive = () => setIsActive((prev) => !prev);

  return (
    <div className="no-select relative flex flex-col">
      <button
        ref={buttonRef}
        className={`${className} ${isActive ? activeClass : notActiveClass} transition-all`}
        onClick={toggleActive}
      >
        {children}
      </button>
      <div
        style={{ transform: `translateX(-${floatPercentag * 1.27}px)` }}
        className={`${isActive ? "mt-10" : "pointer-events-none mt-8 opacity-0"} absolute z-50 w-40 rounded-lg border border-gray-600 transition-all`}
      >
        {options
          ? options.map(({ name, desc, icon, state, func, border }, index) =>
              border ? (
                <div
                  key={index}
                  className={`min-h-[6px] cursor-default bg-gray-900 px-1 text-sm text-gray-400 transition-all first:rounded-t-lg last:rounded-b-lg`}
                ></div>
              ) : (
                <div
                  key={index}
                  onClick={func && func}
                  style={{
                    color: state
                      ? state == "danger"
                        ? "red"
                        : "currentColor"
                      : "currentColor",
                  }}
                  className="flex cursor-pointer items-center justify-between bg-gray-800 px-2 py-[4px] transition-all first:rounded-t-lg first:pt-2 last:rounded-b-lg last:pb-2 hover:bg-gray-700"
                >
                  <div className="flex flex-col leading-5">
                    {name}
                    <span className="text-gray-400">{desc}</span>
                  </div>
                  {icon == "ListStart" ? <ListStart /> : null}
                  {icon == "Copy" ? <Copy /> : null}
                </div>
              ),
            )
          : null}
      </div>
    </div>
  );
};

export default SelectButon;
