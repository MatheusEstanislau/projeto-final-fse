import React, { useState, useEffect } from 'react'
import {
  Container,
  Grid,
  CircularProgress,
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core'
import { useApp } from '../../hooks/useApp'
import Device from '../../components/Device/index'

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxCircularProgress: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

const Home = () => {
  const classes = useStyles()
  const { client } = useApp()
  const [dev, setDev] = useState([])

  const memoizedValue = (id) => {
    console.log('entrei')
    if (id !== undefined) {
      setDev((prevState) => [
        ...prevState,
        { id: id, name: '', temperature: 0, humidity: 0 },
      ])
    }
  }

  const handleMqtt = () => {
    client.on('connect', function () {
      client.subscribe('fse2020/150141220/dispositivos/#', function (err) {
        if (!err) {
          console.log('Conectado')
        }
      })
    })

    client.on('message', function (topic, message) {
      var deviceString = 'dispositivos'
      if (topic.includes(deviceString)) {
        const messageParsed = JSON.parse(message)
        memoizedValue(messageParsed.id)
      }
    })
  }

  useEffect(() => {
    handleMqtt()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Container maxWidth='lg'>
      <Grid
        container
        alignContent='center'
        alignItems='center'
        direction='row'
        spacing={5}
        className={classes.grid}
      >
        {dev.length > 0 ? (
          dev.map((device, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Device
                name={device.name}
                id={device.id}
                temperature={device.temperature}
                humidity={device.humidity}
              />
            </Grid>
          ))
        ) : (
          <Box className={classes.boxCircularProgress}>
            <CircularProgress />
            <Typography variant='h5'>No Device Registered</Typography>
          </Box>
        )}
        {console.log(dev)}
      </Grid>
    </Container>
  )
}

export default Home
