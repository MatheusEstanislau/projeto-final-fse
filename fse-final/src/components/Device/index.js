import React, { useState, useEffect } from 'react'
import {
  Card,
  Typography,
  Button,
  TextField,
  makeStyles,
  CardMedia,
  Box,
} from '@material-ui/core'
import { useApp } from '../../hooks/useApp'
import { useCallback } from 'react'
import esp32 from '../../assets/esp32.jpg'

const Device = ({ name, id, temperature, humidity }) => {
  const [showInput, setShowInput] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [deviceTemperature, setDeviceTemperature] = useState(0)
  const [deviceHumidity, setDeviceHumidity] = useState(0)
  const { device, client } = useApp()

  const handleClick = () => {
    setShowInput(true)
  }

  const handleChange = (e) => {
    setDeviceName(e.target.value)
  }

  const publishName = useCallback(() => {
    if (deviceName !== '') {
      console.log(`fse2020/150141220/${deviceName}/#`)
      device.subscribe(`fse2020/150141220/${deviceName}/#`)
      client.publish(
        `fse2020/150141220/dispositivos/${id}`,
        `{ "installedRoom": "${deviceName}"}`
      )
      setShowInput(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceName])

  useEffect(() => {
    const handleNewMessage = (topic, message) => {
      if (topic === `fse2020/150141220/${deviceName}/temperatura`) {
        const parsed = JSON.parse(message)
        setDeviceTemperature(parsed.temperature)
      } else if (topic === `fse2020/150141220/${deviceName}/umidade`) {
        const parsed = JSON.parse(message)
        setDeviceHumidity(parsed.humidity)
      }
    }
    device.on('message', handleNewMessage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publishName])

  const useStyles = makeStyles((theme) => ({
    card: {},
    title: {
      textAlign: 'center',
    },
    addNameButton: {
      backgroundColor: 'rebeccapurple',
      color: 'white',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    sendButton: {
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
      backgroundColor: 'rebeccapurple',
      color: 'white',
    },
    textField: {
      [`& fieldset`]: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    },
    textBox: {
      padding: 10,
      display: 'flex',
      justifyContent: 'space-between',
    },
    media: {
      height: 100,
    },
    boxButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      padding: 5,
      display: 'flex',
      flexDirection: 'column',
    },
  }))

  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <Typography
        className={styles.title}
        variant='h6'
      >{`Device Id: ${id}`}</Typography>
      <CardMedia className={styles.media} image={esp32} title='Paella dish' />
      <Box className={styles.content}>
        <Typography>{`Device name: ${
          deviceName ? deviceName : 'Choose '
        }`}</Typography>
        <Typography>{`Temperature: ${deviceTemperature}`}</Typography>
        <Typography>{`Humidity: ${deviceHumidity}`}</Typography>
      </Box>

      {name === '' ? (
        <Box className={styles.boxButton}>
          <Button
            className={styles.addNameButton}
            onClick={() => handleClick()}
          >
            Add name
          </Button>
        </Box>
      ) : null}
      {showInput ? (
        <Box className={styles.textBox}>
          <TextField
            className={styles.textField}
            variant='outlined'
            onChange={(e) => handleChange(e)}
          />
          <Button className={styles.sendButton} onClick={() => publishName()}>
            Send
          </Button>
        </Box>
      ) : null}
    </Card>
  )
}

export default Device
