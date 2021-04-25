import Image from 'next/image';
import {useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';


import { playContext } from '../../contexts/PlayerContexts';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  
  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState
  } = playContext();

  const episode = episodeList[currentEpisodeIndex];

  // Função do audio, integrando com as key do teclado multimidía.
  useEffect(() => {
    if(!audioRef.current) {
      return
    }
    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  },[isPlaying])

  // Função do audio, ouvir o quando audio tocar ou quando mudar para outro
  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  // Função do Slider, mudar o time do audio ao mover-lo
  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount)
  }

  function handleEpisodeEnded() {
    if(hasNext){
      playNext()
    }else {
      clearPlayerState()
      setProgress(0)
    }
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>
{/* Imagem - Thumbnail */}
      { episode ? (
      <div className={styles.currentEpisode}>
        <Image 
          width={592}
          height={592}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <strong>{episode.title}</strong>
        <span>{episode.members}</span>
      </div>
      ) : (
      <div className={styles.empytPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      ) }

{/* Slider */}

      <footer className={!episode ? styles.empyt : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
            <div className={styles.slider}>
             {episode ? (
               <Slider 
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{backgroundColor: '#04d361'}}
                railStyle={{backgroundColor: '#9f75ff'}}
                handleStyle={{borderColor: '#04d361', borderWidth: 4}}
               />
             ) : (
              <div className={styles.empytSlider} />
             ) }
            </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        
{/* Audio */}
        {episode && (
          <audio 
            ref={audioRef} 
            src={episode.url} 
            autoPlay
            loop={isLooping}
            onPlay={()=> setPlayingState(true)}
            onPause={()=> setPlayingState(false)}
            onEnded={handleEpisodeEnded}
            onLoadedMetadata={setupProgressListener}
          />
        )}

{/* Controles - Buttons */}
        <div className={styles.buttons}>
          <button 
            type="button" 
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
            disabled={!episode || episodeList.length === 1}
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>

          <button 
            type="button" 
            onClick={togglePlay} 
            className={styles.playButton} 
            disabled={!episode}
          >

           {!isPlaying ? (
            <img src="/play.svg" alt="Tocar"/>
           ) : (
            <img src="/pause.svg" alt="Tocar"/>
           )}

          </button>

          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button 
            type="button" 
            onClick={toggleLoop} 
            disabled={!episode}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}