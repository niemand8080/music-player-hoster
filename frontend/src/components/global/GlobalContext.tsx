"use client";
import React, {
  createContext,
  lazy,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  PageType,
  Song,
  SysAlert,
  UserType,
} from "@/interfaces/interfaces";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

// TODO use api function for each fetch

// TODO save nextSongs, songHistory and currentSong (curre ntTime) in cookies / local storage
// TODO log-in and sign-in

interface GlobalContextType {
  user: UserType | undefined;
  allPages: { [key: string]: PageType };
  pageList: PageType[];
  mainPages: PageType[];
  currentPage: PageType;
  clientBrowser: string;
  systemAlerts: SysAlert[];
  saveAudioState: boolean;
  toggleSaveAudioState: () => void;
  changePage: (page: PageType | undefined, loadPage?: boolean, changeURL?: boolean) => void;
  addSystemAlerts: (alert: SysAlert) => void;
  copyToClipboard: (text: string) => void;
  api: <T = any>(
    path: string,
    asJSON: boolean,
  ) => Promise<{ success: boolean; error?: any; data?: T }>;
  filter: (query: string, list: Song[] | "DB") => Promise<Song[]>;
  formatTime: (time: number) => string;
  loadFromLocalStorage: <T>(key: string, defaultValue: T) => T;
  saveToLocalStorage: <T>(key: string, value: T) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const allPages: { [key: string]: PageType } = {
    home: { path: "/home", displayName: "Home", main: true },
    libary: { path: "/libary", displayName: "Libary", main: true },
    "log-in": { path: "/auth/log-in", displayName: "Log in", noHeader: true },
    "sign-in": { path: "/auth/sign-in", displayName: "Sign in", noHeader: true },
    "for-you": { path: "/for-you", displayName: "For You", main: true },
    "random-player": { path: "/random-player", displayName: "Random Player", main: true },
    "*": { path: "/not-found", displayName: "Page Not Found", noHeader: true }
  };
  const mainPages: PageType[] = Object.values(allPages).filter(({ main }) => main);
  const pageList: PageType[] = Object.values(allPages);

  const pathname = usePathname();
  
  const [currentPage, setCurrentPage] = useState<PageType>(
    pageList.filter(({ path }) => path == pathname)[0] || allPages["*"]
  );
  const [clientBrowser, setClientBrowser] = useState<string>("");
  const [systemAlerts, setSystemAlerts] = useState<SysAlert[]>([]);
  const [saveAudioState, setSaveAudioState] = useState<boolean>(() => JSON.parse(window.localStorage.getItem("saveAudioState") || "") == "true");
  const [user, setUser] = useState<UserType>();

  const router = useRouter();

  const changePage = (page: PageType | undefined, loadPage: boolean = true, changeURL: boolean = true) => {
    const path = page && page.path || allPages["*"].path;
    if (loadPage) router.push(path);
    else if (changeURL) window.history.pushState({}, "", path);

    // console.log(pageList.filter(({ path }) => path == pathname)[0], page && page || allPages["*"]);
    setCurrentPage(page && page || allPages["*"]);
  };

  const loadFromLocalStorage = <T,>(key: string, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      const parsedItem = JSON.parse(item);
      if (typeof parsedItem !== typeof defaultValue) return defaultValue;
      return parsedItem as T;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      const sysError: SysAlert = {
        type: "error",
        description: `Error loading ${key} from localStorage`,
        message: error
      };
      addSystemAlerts(sysError);
      return defaultValue;
    }
  };

  const saveToLocalStorage = <T,>(key: string, value: T) => {
    if (typeof window === "undefined") return;
    try {
      const itemToSave = JSON.stringify(value);
      localStorage.setItem(key, itemToSave);
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      const sysError: SysAlert = {
        type: "error",
        description: `Error saving ${key} to localStorage`,
        message: error
      };
      addSystemAlerts(sysError);
    }
  };

  const toggleSaveAudioState = () => {
    saveToLocalStorage("saveAudioState", JSON.stringify(!saveAudioState));
    setSaveAudioState((v) => !v);
    if (typeof window == "undefined") return;
    console.log(JSON.stringify(!saveAudioState), JSON.parse(window.localStorage.getItem("saveAudioState") || "") == "true");
  };

  const api = async <T = any,>(
    path: string,
    asJSON = true,
  ): Promise<{ success: boolean; error?: any; data?: T }> => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${path}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      if (asJSON) {
        const json: T = await response.json();
        return { success: true, data: json };
      } else {
        return { success: true, data: response as T };
      }
    } catch (error) {
      console.error("Error: ", error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      const fetch = originalFetch.apply(this, args).then((response) => {
        return response;
      });

      const url: string = args[0] as string;
      if (!url.endsWith("/ping")) {
        fetch.catch((error) => {
          const sysAlert: SysAlert = {
            type: "error",
            description: "API not responding",
            message: error,
            solutions: [
              {
                title: "API",
                description: "API is probably off, so wait untill it's not.",
              },
            ],
          };
          addSystemAlerts(sysAlert);
        });
      }

      return fetch;
    };
  }, []);

  const addSystemAlerts = (alert: SysAlert) => {
    setSystemAlerts((prev) => [alert, ...prev]);
  };

  const copyToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  };

  useEffect(() => {
    const setBrowser = async () => {
      const res = await api("/client_browser");
      setClientBrowser(res.data.browser);
    };
    setBrowser();
  }, []);

  // TODO make this more specific
  const filter = async (
    query: string,
    list: Song[] | "DB",
  ): Promise<Song[]> => {
    const filter = query.toLowerCase();
    const filterSplit = filter.split(" ");
    if (filter == "") return [];

    const getListFromDB = async (): Promise<Song[]> => {
      if (list != "DB") return [];
      const res = await api(`/search?q=${encodeURI(filter)}`, true);
      return res.data as Song[];
    };

    const dbList = await getListFromDB();

    const currentList = list == "DB" ? dbList : list;

    const calculateRelevance = (song: Song): number => {
      const query = (song.name + song.artist_name).toLowerCase();
      const splitQuery = query.split(" ");
      let relevance = -song.name.length / 10;
      let filterIndex = 0;
      let space = 0;

      for (let i = 0; i < splitQuery.length; i++) {
        if (filterSplit.includes(splitQuery[i])) relevance += 10;
      }

      for (let i = 0; i < query.length && filterIndex < filter.length; i++) {
        if (query[i] === filter[filterIndex]) {
          relevance += space > 0 ? 1 : 5;
          filterIndex++;
          space = 0;
        } else {
          space++;
        }
      }

      if (filter === song.track_id) relevance += 1000;
      if (song.file_exists === 0) relevance -= 500;

      return relevance;
    };

    const sorted = currentList
      .map((song) => ({ song, relevance: calculateRelevance(song) }))
      .sort((a, b) => b.relevance - a.relevance)
      .map((item) => item.song);

    const filtered = sorted
      .filter(
        (song, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.name === song.name &&
              t.artist_name === song.artist_name &&
              t.did === song.did,
          ),
      )
      .filter((song) => song.file_exists !== 0)
      .slice(0, 6);

    return filtered;
  };

  const formatTime = (time: number): string => {
    const form = (str: string): string =>
      str.startsWith("0") ? str.slice(1) : str;
    const days = Math.floor(time / (60 * 60 * 24));
    const hours = Math.floor(time / (60 * 60))
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((time / 60) % 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    let result = `${form(minutes)}:${seconds}`;

    if (days != 0) {
      result = `${days}:${hours}:${minutes}:${seconds}`;
    } else if (hours != "00") {
      result = `${form(hours)}:${minutes}:${seconds}`;
    }

    return result;
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        allPages,
        pageList,
        mainPages,
        currentPage,
        clientBrowser,
        systemAlerts,
        saveAudioState,
        toggleSaveAudioState,
        changePage,
        addSystemAlerts,
        copyToClipboard,
        api,
        filter,
        formatTime,
        saveToLocalStorage,
        loadFromLocalStorage,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within an GlobalProvider");
  }
  return context;
};
