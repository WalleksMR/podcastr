import {createContext, useState, ReactNode, useContext} from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Array<Episode>;
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index:number) => void;
  playNext: () => void;
  togglePlay: () => void;
  playPrevious: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  clearPlayerState: () => void;

}

type PlayerContextProviderProps = {
  children: ReactNode
}

export const PlayerContext = createContext({} as PlayerContextData);

export function playContext() {
  return useContext(PlayerContext);
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeList] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeList(0);
    setIsPlaying(true)
    setIsShuffling(false)
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeList(index);
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function toggleLoop(){
    setIsLooping(!isLooping)
  }

  function toggleShuffle(){
    setIsShuffling(!isShuffling)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length)
      setCurrentEpisodeList(nextRandomEpisodeIndex)

    }else if(hasNext) {
      setCurrentEpisodeList(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if(hasPrevious){
      setCurrentEpisodeList(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeList(0);
  }

  return (
      <PlayerContext.Provider value={{ 
        episodeList,  
        currentEpisodeIndex, 
        hasPrevious,
        isPlaying, 
        isLooping, 
        isShuffling,
        playList,
        hasNext,
        play,
        setPlayingState,
        playNext,
        playPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        clearPlayerState,
      }}>

        {children}

      </PlayerContext.Provider>
  )
}