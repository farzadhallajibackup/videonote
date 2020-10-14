import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import isEmail from 'validator/lib/isEmail'

import { useNotificationContext } from '@/context/notificationContext'
import ModalInput from '@/shared/Modal/ModalInput'
import ModalPrimaryBtn from '@/shared/Modal/ModalPrimaryBtn'
import { fetcher } from '@/utils/clientHelpers'

export default function Login({ toggleLoginView, handleLogin, handleEmail }) {
  const { addAlert } = useNotificationContext()
  const [user, setUser] = useState({ loginEmail: '', loginPassword: '' })

  // passing back email input to global page for autofill on register page if need be
  useEffect(() => {
    handleEmail(user.loginEmail)
  }, [user.loginEmail])

  const handleChange = e => {
    setUser({ ...user, [e.target.id]: e.target.value })
  }

  const isValidCredentials = () => {
    const validEmail = isEmail(user.loginEmail)
    const validPassword = user.loginPassword.length > 4
    return validEmail && validPassword
  }
  const handleSubmit = e => {
    e.preventDefault()

    if (!isValidCredentials())
      return addAlert({ type: 'error', msg: 'Invalid credentials provided' })

    requestLogin()
  }

  const requestLogin = async () => {
    console.log('logging in user')
    const body = {
      email: user.loginEmail,
      password: user.loginPassword,
    }
    const { res, data } = await fetcher('/api/login', body)

    // 302 = found
    if (res.status === 302) {
      // addAlert({
      //   type: 'info',
      //   msg: `Signing in: ${data.user.username || data.user.email}`,
      //   duration: 1000,
      // })
      handleLogin(data)
    } else {
      if (data.msg.includes('registration required')) toggleLoginView(false)
      addAlert({ type: 'error', msg: data.msg })
    }
  }

  const handleSwitchView = () => {
    toggleLoginView(false)
  }

  return (
    <motion.div
      key='login-modal'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className='w-full max-w-sm mx-auto overflow-hidden border rounded-sm border-themeText'
    >
      <div className='px-6 py-4'>
        <Link href='/hello' passHref>
          <a>
            <h2 className='text-3xl font-bold text-center text-themeAccent'>
              VideoNote
            </h2>
          </a>
        </Link>

        <h3 className='mt-1 text-xl font-medium text-center text-themeText'>
          Welcome back!
        </h3>

        <p className='mt-1 text-center text-themeText2'>
          Sign in to your account
        </p>

        <form>
          <div className='w-full mt-4'>
            <ModalInput
              type='email'
              id='loginEmail'
              placeholder='Email Address'
              aria-label='Email Address'
              value={user.loginEmail}
              onChange={handleChange}
              autoFocus
            />
          </div>

          <div className='w-full mt-4'>
            <ModalInput
              type='password'
              id='loginPassword'
              placeholder='Password'
              aria-label='Password'
              value={user.loginPassword}
              onChange={handleChange}
            />
          </div>

          <div className='flex items-center justify-end mt-4'>
            <ModalPrimaryBtn handleClick={handleSubmit}>Login</ModalPrimaryBtn>
          </div>
        </form>
      </div>

      <div className='flex items-center justify-center py-4 text-center'>
        <span className='text-sm text-themeText2'>Don't have an account? </span>

        <button
          onClick={handleSwitchView}
          className='mx-2 text-sm font-bold transition-colors duration-300 ease-in-out focus:outline-none text-themeAccent2 hover:text-themeAccent'
        >
          Register
        </button>
      </div>
    </motion.div>
  )
}
