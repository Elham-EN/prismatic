import React, { ReactElement, useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { ModalType, selectAppState, setActiveModal } from '../../redux/app/appSlice'
import { handleKeyDown, handleKeyUp } from './keyPressHandlers'
import { getTheme } from '../../theme/themeRegistry'
import { Window } from '../../react/components/page/Window'
import { Header } from '../../react/components/page/Header'
import { Footer } from '../../react/components/page/Footer'
import { Body } from '../../react/components/page/Body'
import { HelpModal } from '../modals/help/HelpModal'
import { UserModal } from '../modals/user/UserModal'
import { SettingsModal } from '../modals/settings/SettingsModal'
import { PlayingView } from '../views/PlayingView'
import { handleWindowResize } from './resizeHandlers'

export function Main(): ReactElement {
  const { theme } = useAppSelector(selectAppState)
  const dispatch = useAppDispatch()

  // listen for keyboard events
  const receiveKeyDown = (event: KeyboardEvent): void => {
    handleKeyDown(event, dispatch)
  }
  const receiveKeyUp = (event: KeyboardEvent): void => {
    handleKeyUp(event, dispatch)
  }
  useEffect(() => {
    document.addEventListener('keydown', receiveKeyDown)
    document.addEventListener('keyup', receiveKeyUp)
    return function cleanup() {
      document.removeEventListener('keydown', receiveKeyDown)
      document.removeEventListener('keyup', receiveKeyUp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // listen for window resize
  const receiveResize = (): void => handleWindowResize()
  useEffect(() => {
    receiveResize() // fire once on main load
    window.addEventListener('resize', receiveResize)
    return function cleanup() {
      window.removeEventListener('resize', receiveResize)
    }
  }, [])

  // set up callbacks
  function openModal(modal: ModalType | undefined): () => void {
    return function () {
      dispatch(setActiveModal(modal))
    }
  }

  return (
    <ThemeProvider theme={getTheme(theme)}>
      <Window>
        <Header
          onClickHelp={openModal(ModalType.help)}
          onClickPerson={openModal(ModalType.user)}
          onClickSettings={openModal(ModalType.settings)}
        />
        <Body>
          <PlayingView />
        </Body>
        <Footer />
      </Window>
      <HelpModal />
      <UserModal />
      <SettingsModal />
    </ThemeProvider>
  )
}
