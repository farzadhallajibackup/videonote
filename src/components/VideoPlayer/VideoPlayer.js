import { motion } from 'framer-motion'
import ReactPlayer from 'react-player'

import { useGlobalContext } from '@/context/globalContext'
import { useVideoContext } from '@/context/videoContext'

import ActionInput from '../ActionInput/ActionInput'
import style from './videoPlayer.module.scss'

export default function VideoPlayer() {
  const { projects } = useGlobalContext()
  const {
    url,
    playing,
    volume,
    playbackRate,
    playerRef,
    handleReady,
    handleProgress,
    handlePlayerError,
    handleDuration,
  } = useVideoContext()

  const videoContentVariants = {
    initial: {
      opacity: 0,
      x: '-100%',
    },
    animate: {
      opacity: 1,
      x: 0,
    },
    exit: {
      opacity: 0,
      x: '-100%',
    },
  }
  return (
    // wrapper to position input
    <motion.div
      key='videoContent'
      initial='initial'
      animate='animate'
      exit='exit'
      variants={videoContentVariants}
      id='videoContent'
      className='relative w-full h-full'
    >
      {/* resposive wrapper */}
      <div className={`${style.playerWrapper} w-full h-full`}>
        {url && (
          <ReactPlayer
            url={url}
            onError={handlePlayerError}
            controls={false}
            playing={playing}
            volume={volume}
            playbackRate={playbackRate}
            progressInterval={500}
            onDuration={handleDuration}
            onReady={handleReady}
            onProgress={handleProgress}
            config={{
              youtube: {
                playerVars: { showinfo: 0, autoplay: 0 },
              },
              vimeo: {},
            }}
            className={`${style.reactPlayer} `}
            width='100%'
            height='100%'
          />
        )}
      </div>
      {/* input wrapper */}
      {playerRef.current && projects.length > 0 && (
        <motion.div
          key='action-input'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className='absolute bottom-0 z-10 w-2/3 h-12 mb-8 transform -translate-x-1/2 left-1/2'>
            <ActionInput />
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
