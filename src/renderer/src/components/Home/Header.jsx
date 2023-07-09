import { Box, Stack, Typography } from '@mui/material'

import icon from '../../assets/dentist.svg'
import { useEffect, useState } from 'react'

const Header = ({ settingsData, userInfo }) => {
  const [dateTime, setDateTime] = useState(
    Date.now().toLocaleString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
  )
  useEffect(() => {
    setInterval(() => {
      const datetimeNow = new Date()
      setDateTime(
        datetimeNow.toLocaleString(undefined, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric'
        })
      )
    }, 1000)
  }, [])
  return (
    <Box sx={{ mb: 1 }}>
      <Stack flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'} p={1}>
        <Stack
          flexDirection={'row'}
          alignItems={'center'}
          justifyContent={'space-evenly'}
          sx={{ width: 700 }}
        >
          <img src={icon} alt="heading image" width={100} height={100} />

          <Typography variant="h2" color={settingsData?.homeFontColor}>
            {settingsData ? settingsData?.appTitle : 'Default Title'}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="h5" fontSize={29} padding={1} color={settingsData?.homeFontColor}>
            {dateTime}
          </Typography>
          <Typography
            variant="body"
            className="capitalize"
            textAlign={'end'}
            color={settingsData?.homeFontColor}
            mr={5}
          >
            User: {userInfo?.name}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Header
