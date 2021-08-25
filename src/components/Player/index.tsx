import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";
import Slider from "rc-slider";

import "rc-slider/assets/index.css";

import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationString";

const Player: React.FC = () => {

  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress ] = useState(0)
  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    isLooping,
    toggleLoop,
    hasPrevious,
    toggleShuffle,
    isShuffling
  } = usePlayer();

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }


  useEffect(() => {
    if(!audioRef.current){
      return
    }

    if(isPlaying){
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
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
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? 
            <Slider
            max={episode.duration}
            value={progress} 
            trackStyle={{ backgroundColor: '#04d361' }} 
            railStyle={{ backgroundColor: '#9f75ff' }}
            handleStyle={{ borderColor:'#04d361', borderWidth: 3 }}
            /> 
            : <div className={styles.emptySlider} />}
          </div>
          <span>{convertDurationToTimeString(episode?.duration) ?? 0}</span>
        </div>
            
        {
          episode && (
            <audio 
              ref={audioRef}
              src={episode.url}
              autoPlay
              loop={isLooping}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}
            />
          )
        }

        <div className={styles.buttons}>
          <button 
          type="button" 
          disabled={!episode || episodeList.length === 1} 
          onClick={() => toggleShuffle()}
          className={ isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" disabled={!episode || !hasPrevious} onClick={() => playPrevious()}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button type="button" className={styles.playButton} onClick={togglePlay} disabled={!episode}>
            {
              isPlaying 
              ? <img src="/pause.svg" alt="Tocar" />
              : <img src="/play.svg" alt="Tocar" />

            }
          </button>
          <button type="button" disabled={!episode || !hasNext} onClick={() => playNext()}>
            <img src="/play-next.svg" alt="Tocar proxima" />
          </button>
          <button 
          type="button" 
          disabled={!episode}
          onClick={() => toggleLoop()}
          className={ isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Player;
