import { useEffect, useState } from 'react';
import '../styles/global.scss'

import { Header } from '../components/Header'
import { Player } from '../components/Player';
import { PlayerContext } from '../contexts/PlayerContexts';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeList] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeList(0);
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  return (
      <PlayerContext.Provider value={{
          episodeList, 
          currentEpisodeIndex, 
          play,
          togglePlay,
          isPlaying,
          setPlayingState,
        }}>
        <div className={styles.wrapper}>
          <main>
            <Header/>
            <Component {...pageProps} />
          </main>
          <Player/>
        </div>
      </PlayerContext.Provider>
  )
}

export default MyApp
