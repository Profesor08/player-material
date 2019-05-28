export interface TrackUser {
  id: number;
  kind: string;
  permalink: string;
  username: string;
  last_modified: string;
  uri: string;
  permalink_url: string;
  avatar_url: string;
}

export interface Track {
  kind: string;
  id: number;
  created_at: string;
  user_id: number;
  duration: number;
  commentable: boolean;
  state: string;
  original_content_size: number;
  last_modified: string;
  sharing: string;
  tag_list: string;
  permalink: string;
  streamable: boolean;
  embeddable_by: string;
  downloadable: boolean;
  purchase_url: null;
  label_id: null;
  purchase_title: null;
  genre: string;
  title: string;
  description: string;
  label_name: string;
  release: string;
  track_type: string;
  key_signature: string;
  isrc: string;
  video_url: null;
  bpm: null;
  release_year: null;
  release_month: null;
  release_day: null;
  original_format: string;
  license: string;
  uri: string;
  user: TrackUser;
  attachments_uri: string | null;
  permalink_url: string | null;
  artwork_url: string | null;
  waveform_url: string | null;
  stream_url: string;
  playback_count: number;
  download_count: number;
  favoritings_count: number;
  comment_count: number;
}

export interface TrackData {
  kind: string;
  created_at: string;
  track: Track;
  playlist: string | null;
}

export interface LikesResponse {
  collection: TrackData[];
  next_href?: string;
}

export interface Profile {
  country: string | null;
  subscriptions: [];
  city: string | null;
  description: string | null;
  track_count: number;
  discogs_name: string | null;
  public_favorites_count: number;
  id: number;
  reposts_count: number;
  myspace_name: string | null;
  website_title: string | null;
  last_modified: string;
  first_name: string | null;
  plan: string;
  playlist_count: number;
  website: string | null;
  kind: string;
  last_name: string | null;
  uri: string;
  followings_count: number;
  full_name: string;
  avatar_url: string | null;
  followers_count: number;
  online: boolean;
  permalink: string;
  permalink_url: string;
  username: string;
}

interface CoverSize {
  x500: string;
  x400: string;
  x300: string;
  x100: string;
  x67: string;
  x47: string;
  x32: string;
  x20: string;
  x18: string;
  x16: string;
}

const coverSize: CoverSize = {
  x500: "t500x500",
  x400: "crop",
  x300: "t300x300",
  x100: "large",
  x67: "t67x67",
  x47: "badge",
  x32: "small",
  x20: "tiny",
  x18: "tiny",
  x16: "mini",
};

function buildUrl(url: string, params?: { [key: string]: any }): string {
  if (params) {
    return (
      url +
      "?" +
      Object.keys(params)
        .map((param: string) => {
          return `${param}=${encodeURIComponent(params[param])}`;
        })
        .join("&")
    );
  } else {
    return url;
  }
}

async function get(url: string, params?: {}): Promise<any> {
  const response = await fetch(buildUrl(url, params));
  const json = await response.json();

  return json;
}

async function getProfileData(profileUrl: string): Promise<Profile> {
  try {
    return await get(`https://api.soundcloud.com/resolve`, {
      client_id: process.env.REACT_APP_SC_CLIENT_ID,
      url: profileUrl,
    });
  } catch (err) {
    throw new Error("Unable to load Soundcloud profile data.");
  }
}

async function getProfileLikes(
  profile: Profile,
  progressCallback?: (tracks: Track[]) => void,
): Promise<Track[]> {
  let tracks: Track[] = [];

  let response: LikesResponse = await get(
    `https://api.soundcloud.com/e1/users/${profile.id}/likes`,
    {
      format: "json",
      limit: 24,
      date: Date.now(),
      client_id: process.env.REACT_APP_SC_CLIENT_ID,
      linked_partitioning: 1,
    },
  );

  while (response.next_href) {
    tracks = tracks.concat(prepeareTracks(response.collection));

    if (progressCallback) {
      progressCallback(tracks);
    }

    response = await get(response.next_href);
  }

  tracks = tracks.concat(prepeareTracks(response.collection));

  return tracks;
}

function prepeareTracks(tracks: TrackData[]): Track[] {
  const tracks2 = tracks
    .filter(track => track.track !== null)
    .map(track => prepeareTrack(track));
  return tracks2;
}

function prepeareTrack(trackData: TrackData): Track {
  const track = trackData.track;

  return {
    ...track,
    artwork_url: getArtwork(track, coverSize.x500),
    stream_url:
      track.stream_url + "?client_id=" + process.env.REACT_APP_SC_CLIENT_ID,
  };
}

function getArtwork(track: Track, size: string): string {
  if (track.artwork_url !== null) {
    return track.artwork_url.replace(/large/, size);
  } else if (track.user.avatar_url !== null) {
    if (track.user.avatar_url.includes("default_avatar")) {
      return process.env.PUBLIC_URL + "no-cover.svg";
    } else {
      return track.user.avatar_url.replace(/large/, size);
    }
  }

  return "";
}

let shuffleTracks: Track[] = [];

export function getRandomTrack(
  tracks: Track[],
  currentTrack: Track | null,
): Track {
  let foundTrack = tracks[Math.floor(Math.random() * tracks.length)];

  if (tracks.length > 1 && currentTrack && foundTrack.id === currentTrack.id) {
    return getRandomTrack(tracks, currentTrack);
  }

  return foundTrack;
}

export function next(
  tracks: Track[],
  track: Track | null,
  shuffle: boolean,
): Track | null {
  const findNextTrack = (): Track | null => {
    if (track) {
      const trackId = track.id;
      const trackIndex = tracks.findIndex(track => track.id === trackId);

      if (trackIndex < tracks.length - 1) {
        return tracks[trackIndex + 1] || null;
      } else if (tracks.length > 0) {
        return tracks[0] || null;
      }
    }

    return null;
  };

  const findRandomTrack = (): Track | null => {
    const foundTrack = getRandomTrack(tracks, track);

    if (foundTrack) {
      shuffleTracks.push(foundTrack);
    }

    return foundTrack || null;
  };

  if (shuffle) {
    return findRandomTrack();
  } else {
    return findNextTrack();
  }
}

export function prev(
  tracks: Track[],
  track: Track | null,
  shuffle: boolean,
): Track | null {
  const findPrevTrack = (): Track | null => {
    if (track) {
      const trackId = track.id;
      const trackIndex = tracks.findIndex(track => track.id === trackId);

      if (trackIndex > 0) {
        return tracks[trackIndex - 1] || null;
      } else if (tracks.length > 0) {
        return tracks[tracks.length - 1] || null;
      }
    }

    return null;
  };

  if (shuffle) {
    if (shuffleTracks.length > 1) {
      shuffleTracks.pop();
      return shuffleTracks.pop() || null;
    } else {
      return findPrevTrack();
    }
  } else {
    return findPrevTrack();
  }
}

export default class Tracks {
  static async demo(): Promise<Track[]> {
    const tracks: TrackData[] = require("../sc.json");

    return prepeareTracks(tracks);
  }

  static async profileLikes(
    profileUrl: string,
    progressCallback?: (tracks: Track[]) => void,
  ): Promise<Track[]> {
    const profile: Profile = await getProfileData(profileUrl);
    const tracks: Track[] = await getProfileLikes(profile, progressCallback);

    return tracks;
  }
}
