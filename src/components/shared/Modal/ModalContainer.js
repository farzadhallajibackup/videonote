import { motion } from 'framer-motion'

import CloseModalBtn from './CloseModalBtn'

const ModalContainer = ({
  toggle,
  children,
  motionKey = 'modal',
  zIndex = null,
  ...props
}) => {
  const variants = {
    initial: { opacity: 0, y: '-40%', x: '-50%' },
    animate: { opacity: 1, y: '-50%', transition: { duration: 0.2 } },
    exit: { opacity: 0, y: '-60%', transition: { duration: 0.2 } },
  }

  return (
    <motion.div
      key={motionKey}
      initial='initial'
      animate='animate'
      exit='exit'
      variants={variants}
      className={`${
        zIndex ? zIndex : 'z-30'
      } absolute w-full max-w-lg transform -translate-x-1/2 -translate-y-1/2 max-h-11/12 top-1/2 left-1/2`}
      {...props}
    >
      <div className='relative w-full p-6 mx-auto border rounded-sm shadow-md border-themeText bg-themeBg'>
        <CloseModalBtn toggle={toggle} />
        {children}
      </div>
    </motion.div>
  )
}

export default ModalContainer
