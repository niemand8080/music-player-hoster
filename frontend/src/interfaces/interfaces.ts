interface Song {
  name: string;
  artist_name: string;
  artist_track_id: string;
  album: string;
  genres: string;
  birth_date: number;
  duration: number;
  global_played: number;
  added: number;
  track_id: string;
  last_played: number;
  path: string;
  yt_link: string;
  file_exists: 0 | 1;
  did: number | undefined;
}

interface SysAlert {
  type: AlertType;
  message: any;
  description?: string;
  solutions?: { title: string, description: string }[];
}

type UserType = {
  usename: string;
  email: string;
  session: string;
  roles: string[];
  admin: boolean;
  guest: boolean;
  img_path: string;
}

type PageType = { 
  path: string, 
  displayName?: string, 
  main?: boolean, 
  noHeader?: boolean,
};

type MusicLayoutType = "horizontal" | "vertical";
type SongSearchType = "name" | "artist_name" | "album" | "genres";
type AlertType = "default" | "warning" | "success" | "error" | "info";

export type {
  PageType,
  Song,
  UserType,
  SysAlert,
  MusicLayoutType,
  SongSearchType,
  AlertType,
};
