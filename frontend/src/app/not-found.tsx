"use client";
import { useGlobal } from "@/components/global/GlobalContext";
import React, { useEffect } from "react";
import Link from "next/link";

export default function Page() {
  const { changePage, allPages } = useGlobal();

  useEffect(() => {
    changePage(allPages["*"], false, false);
  }, []);

  return (
    <div className="h-screen w-screen">
      <h1 className="text-9xl font-bold relative top-52 text-center w-screen animate-fade-in-bottom drop-shadow-lg">
        <span className="text-indigo-500 drop-shadow-2xl">404</span>
        {" "}Page Not Found
      </h1>
      <div className="absolute overflow-clip bottom-80 left-1/2 -translate-x-1/2 p-5 rounded-full flex items-center justify-center">
        <div className="w-full h-full bg-indigo-500/30 inline-flex absolute animate-pulse shadow-lg duration-500"></div>
        <Link
          href={"/home"}
          className="z-10 flex items-center justify-center px-6 py-3 text-xl font-semibold text-white bg-indigo-600 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Return Home
        </Link>
      </div>
    </div>
  );
}
