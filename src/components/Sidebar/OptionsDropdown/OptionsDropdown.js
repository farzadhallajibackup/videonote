import Link from 'next/link'
import Cookie from 'universal-cookie'

import Select from '@/components/shared/Select/Select'
import ThemeToggle from '@/components/shared/ThemeToggle/ThemeToggle'
import { useGlobalContext } from '@/context/globalContext'
import { useThemeContext } from '@/context/themeContext'

const OptionsDropdown = ({ open }) => {
  const {
    toggleSettingsOpen,
    toggleModalOpen,
    resetGlobalState,
    project,
    admin,
    updateProject,
    copyToClipboard,
    projects,
  } = useGlobalContext()
  const { toggleTheme } = useThemeContext()

  const handleClick = e => {
    const modalId = e.target.getAttribute('data-modal')
    toggleModalOpen(modalId)
    toggleSettingsOpen()
  }

  const handleSignOutClick = () => {
    // remove JWT token cookie
    const cookies = new Cookie()
    cookies.remove('token')
  }

  const handleThemeToggleClick = () => {
    toggleTheme()
  }

  const handleMouseLeave = () => {
    toggleSettingsOpen(false)
  }

  const handleShareProject = () => {
    // set sharing by switching off isPrivate
    updateProject({ isPrivate: false })
    // copy link to clipboard
    copyToClipboard()
  }

  return (
    <div>
      {open && (
        <div
          onMouseLeave={handleMouseLeave}
          className='absolute right-0 z-40 w-48 py-2 text-sm capitalize transition-colors duration-300 ease-in-out border rounded-sm shadow-xl bg-themeBg'
        >
          {project && admin && (
            <Select onClick={handleClick} data-modal='current'>
              <div className='uppercase text-highlight-400'>
                {project.title}
              </div>
            </Select>
          )}
          {!admin && (
            <div className='flex items-center px-4 py-2 uppercase text-highlight-400'>
              {project.title}
            </div>
          )}

          {admin && <Select onClick={handleShareProject}>Share Project</Select>}

          {admin && (
            <>
              <Select
                onClick={handleClick}
                data-modal='create'
                animate={
                  projects.length === 0
                    ? 'animate-pulse text-highlight-400'
                    : ''
                }
              >
                create new
              </Select>
              <Select onClick={handleClick} data-modal='projects'>
                projects
              </Select>
            </>
          )}

          <Select onClick={handleClick} data-modal='settings'>
            settings
          </Select>

          {admin && (
            <Select onClick={handleClick} data-modal='user'>
              profile
            </Select>
          )}
          {admin && (
            <Link href='/hello' passHref>
              <a>
                <Select onClick={handleSignOutClick}>Sign Out</Select>
              </a>
            </Link>
          )}

          <Select onClick={handleThemeToggleClick}>
            <div className='relative flex text-md'>
              <ThemeToggle />
            </div>
          </Select>

          <Select onClick={handleClick} data-modal='help'>
            Help
          </Select>

          <Select onClick={handleClick} data-modal='about'>
            About VideoNote
          </Select>
        </div>
      )}
    </div>
  )
}

export default OptionsDropdown
