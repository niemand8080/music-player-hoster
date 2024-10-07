"use client";
import React from "react";
import { useGlobal } from "../global/GlobalContext";
import ToggleSwitch from "../common/buttons/ToggleSwitch";

const Header: React.FC = () => {
  const { currentPage, mainPages, changePage, allPages, user, saveAudioState, toggleSaveAudioState } = useGlobal();
  return (
    <div className={`${currentPage.noHeader && "opacity-0 pointer-events-none duration-0"} fixed left-0 top-0 z-50 flex h-16 w-screen items-center justify-between border-b border-b-gray-700 p-3 px-4 backdrop-blur-lg transition-all duration-300`}>
      <h1 className="text-3xl font-bold">Music Streamer</h1>
      <div className="flex gap-4 no-select">
        <div className={`flex items-center gap-5 text-lg`}>
          {mainPages
            ? mainPages.map((page, index) => (
                <button
                  key={index}
                  onClick={() => changePage(page)}
                  className={`${currentPage.path.startsWith(page.path) && "text-indigo-500"} transition-color p-1 duration-300 hover:text-indigo-500`}
                >
                  {page.displayName}
                </button>
              ))
            : null}
        </div>
        <div className="w-[1px] bg-gray-600"></div>
        <div className="h-10 py-[6px]">
          <ToggleSwitch 
            title={`Save Audio State: ${saveAudioState ? "True" : "False"}`} 
            onClick={toggleSaveAudioState}
            state={saveAudioState}
          />
          {/* <button 
            title={`Save Audio State: ${saveAudioState ? "True" : "False"}`}
            onClick={toggleSaveAudioState}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              saveAudioState ? 'bg-indigo-600' : 'bg-gray-700'
            }`}
          >
            <span 
              className={`absolute inset-y-0.5 left-0.5 flex items-center justify-center w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                saveAudioState ? 'transform translate-x-5 rotate-[360deg]' : ''
              }`}
            >
              <Check size={16} className={`${!saveAudioState && "opacity-0"} text-indigo-600 transition-all absolute`} />
              <X size={16} className={`${saveAudioState && "opacity-0"} text-gray-600 transition-all absolute`} />
            </span>
          </button> */}
        </div>
        <div className="w-[1px] bg-gray-600"></div>
        {user && !user.guest ? (
          <div className="h-10 w-10 rounded-full bg-gray-700/90 backdrop-blur-sm border border-gray-500 cursor-pointer"></div>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => changePage(allPages["log-in"])} className="items-center justify-center flex my-1 border border-gray-500/50 rounded-md px-2 py-1 bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm hover:from-gray-700/50 hover:to-gray-600/50 hover:border-gray-400/50 transition-all duration-300">
              Log in
            </button>
            <button onClick={() => changePage(allPages["sign-in"])} className="items-center justify-center flex my-1 border border-gray-500/50 rounded-md px-2 py-1 bg-gradient-to-br from-gray-800/50 to-gray-700/50 backdrop-blur-sm hover:from-gray-700/50 hover:to-gray-600/50 hover:border-gray-400/50 transition-all duration-300">
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
