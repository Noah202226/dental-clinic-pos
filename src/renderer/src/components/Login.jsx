import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'

const Login = ({ setIsLogin, settingsInfo, setUserInfo }) => {
  const userRef = useRef()
  const pwdRef = useRef()

  const [isLoading, setIsLoading] = useState(false)

  const ipcRenderer = window.ipcRenderer
  const checkUser = () => {
    const account = {
      name: userRef.current.children[1].children[0].value,
      pwd: pwdRef.current.children[1].children[0].value
    }

    ipcRenderer.send('check-user', account)

    setIsLoading(true)
  }

  const exitApp = () => {
    ipcRenderer.send('exit-app')
  }

  useEffect(() => {
    ipcRenderer.on('validated-user', (e, args) => {
      const user = JSON.parse(args)

      if (user !== null) {
        toast.success('Successfully login', { position: toast.POSITION.BOTTOM_RIGHT })

        setTimeout(() => {
          setUserInfo(user)
          setIsLogin(true)
        }, 3000)
      } else {
        console.log(args)
        toast.error('Login failed, User not found!' + args.name, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
        setIsLoading(false)
      }
    })

    setTimeout(() => {
      userRef.current.children[1].children[0].focus()
    }, 2000)
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: settingsInfo?.loginBgColor,
        gap: 2
      }}
    >
      <Typography variant="h3" color={settingsInfo?.homeFontColor}>
        {settingsInfo?.loginTitle ? settingsInfo?.loginTitle : 'Default : Dental Clinic Program'}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-around',
          width: '30%',
          gap: 2
        }}
      >
        <TextField
          type="text"
          label="Username"
          ref={userRef}
          disabled={isLoading}
          fullWidth
          focused
        />
        <TextField type="password" label="Password" ref={pwdRef} disabled={isLoading} fullWidth />

        <Stack
          width={'100%'}
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-between'}
          mt={2}
        >
          <Button variant="contained" onClick={checkUser} color="success" sx={{ width: '100%' }}>
            Login
          </Button>
        </Stack>

        <ToastContainer autoClose={1000} pauseOnFocusLoss={false} pauseOnHover={false} />
      </Box>
    </Box>
  )
}

export default Login
