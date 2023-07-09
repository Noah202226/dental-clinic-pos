import Login from './components/Login'
import Home from './components/Home'
import { useEffect, useRef, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'

function App() {
  const [isLogin, setIsLogin] = useState(false)
  const [userInfo, setUserInfo] = useState()

  const ipcRenderer = window.ipcRenderer

  const exitRef = useRef()

  // settings
  const [settingInfo, setSettingInfo] = useState()

  const exitApp = () => {
    ipcRenderer.send('exit-app')
  }

  useEffect(() => {
    ipcRenderer.on('closing-app', () => exitRef.current.showModal())

    ipcRenderer.send('get-settings')

    ipcRenderer.on('settings-data', (e, args) => {
      const settingsData = JSON.parse(args)

      setSettingInfo(settingsData[0])
    })
  }, [])

  return (
    <Box>
      <dialog
        ref={exitRef}
        style={{
          width: 280,
          backgroundColor: settingInfo?.homeBgColor,
          color: settingInfo?.homeFontColor,
          padding: 10,
          height: 100,
          borderRadius: 30
        }}
      >
        <Typography variant="h6" textAlign={'center'} fontStyle={'italic'}>
          Do you really want to exit?
        </Typography>

        <Stack
          width={'100%'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-around'}
          pt={2}
        >
          <Button variant="contained" onClick={exitApp} color="error">
            Exit
          </Button>
          <Button variant="outlined" onClick={() => exitRef.current.close()} color="warning">
            Cancel
          </Button>
        </Stack>
      </dialog>
      {isLogin ? (
        <Home settingsInfo={settingInfo} userInfo={userInfo} />
      ) : (
        <Login setIsLogin={setIsLogin} settingsInfo={settingInfo} setUserInfo={setUserInfo} />
      )}
    </Box>
  )
}

export default App
