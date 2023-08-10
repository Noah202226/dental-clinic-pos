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

  // get settings
  const [settingsID, setsettingsID] = useState()
  const [loginBgColor, setLoginBgColor] = useState('#ee0eee')
  const [loginTitle, setLoginTitle] = useState()
  const [appTitle, setAppTitle] = useState()
  const [homeBgColor, setHomeBgColor] = useState()
  const [homeFontColor, setHomeFontColor] = useState()
  const [container1, setContainer1] = useState()
  const [container1BgColor, setContainer1BgColor] = useState()
  const [container2, setContainer2] = useState()
  const [container2BgColor, setContainer2BgColor] = useState()

  const exitApp = () => {
    ipcRenderer.send('exit-app')
  }

  useEffect(() => {
    ipcRenderer.on('closing-app', () => exitRef.current.showModal())

    ipcRenderer.send('get-settings')

    ipcRenderer.on('settings-data', (e, args) => {
      const settingsData = JSON.parse(args)

      setSettingInfo(() => settingsData[0])

      setsettingsID(settingsData[0]._id)
      setLoginTitle(() => settingsData[0].loginTitle)
      setLoginBgColor(() => settingsData[0]?.loginBgColor)
      setAppTitle(() => settingsData[0]?.appTitle)
      setHomeBgColor(settingsData[0]?.homeBgColor)
      setHomeFontColor(settingsData[0]?.homeFontColor)
      setContainer1(settingsData[0]?.containerTitle1)
      setContainer1BgColor(settingsData[0]?.container1BgColor)
      setContainer2(settingsData[0]?.containerTitle2)
      setContainer2BgColor(settingsData[0]?.container2BgColor)
    })
  }, [])

  // useEffect(() => {
  //   setAppTitle(() => settingInfo?.appTitle)
  //   setLoginBgColor(() => settingInfo?.loginBgColor)
  // }, [settingInfo])

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
        <Home
          settingsInfo={settingInfo}
          userInfo={userInfo}
          appTitle={appTitle}
          setAppTitle={setAppTitle}
          container1={container1}
          setContainer1={setContainer1}
          container1BgColor={container1BgColor}
          setContainer1BgColor={setContainer1BgColor}
          container2={container2}
          setContainer2={setContainer2}
          container2BgColor={container2BgColor}
          setContainer2BgColor={setContainer2BgColor}
          homeBgColor={homeBgColor}
          setHomeBgColor={setHomeBgColor}
          homeFontColor={homeFontColor}
          setHomeFontColor={setHomeFontColor}
          loginBgColor={loginBgColor}
          setLoginBgColor={setLoginBgColor}
          loginTitle={loginTitle}
          setLoginTitle={setLoginTitle}
          settingsID={settingsID}
        />
      ) : (
        <Login setIsLogin={setIsLogin} settingsInfo={settingInfo} setUserInfo={setUserInfo} />
      )}
    </Box>
  )
}

export default App
