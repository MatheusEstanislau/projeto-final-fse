import React, { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardActionArea,
  Typography,
  Button,
  TextField,
  makeStyles,
  Box
} from '@material-ui/core'
import { useApp } from '../../hooks/useApp'

const Device = ({ name, id, temperature, humidity }) => {
  const [showInput, setShowInput] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [deviceTemperature, setDeviceTemperature] = useState(0)
  const [deviceHumidity, setDeviceHumidity] = useState(0)
  const { client } = useApp()

  client.on('message', function (topic, message) {
    if (topic.match(/temperatura/i)) {
      const parsed = JSON.parse(message)
      setDeviceTemperature(parsed.temperature)
    } else {
      const parsed = JSON.parse(message)
      setDeviceHumidity(parsed.humidity)
    }
  })
  const handleClick = () => {
    setShowInput(true)
  }

  const handleChange = (e) => {
    setDeviceName(e.target.value)
  }

  const publishName = useCallback(() => {
    if (deviceName !== '') {
      client.publish(
        `fse2020/150141220/dispositivos/${id}`,
        `{ "deviceName": "${deviceName}"}`
      )
      setShowInput(false)
    }
  })

  useEffect(() => {
    client.subscribe(`fse2020/150141220/${deviceName}/#`)
  }, [publishName])

  const useStyles = makeStyles((theme) => ({
    card: {
      backgroundColor: '#EDEDED',
      marginTop: '2rem',
      marginLeft: '2rem',
      padding: '1rem',
      border: '1px solid black',
      borderRadius: '10px',
    },
    addNameButton: {
      backgroundColor: '#00BFFF',
      color: 'white',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    sendButton: {
      backgroundColor: '#00BFFF',
      color: 'white',
    },
    textBox: {
      display: 'flex',
      justifyContent: 'space-between'
    },
  }))

  const styles = useStyles()

  client.on('message', function(topic, message){
    console.log(message.toString());
  })

  return (
    <Card className={styles.card}>
      <Typography>{`Device Id: ${id}`}</Typography>
      <Typography>{`Device name: ${deviceName}`}</Typography>
      <Typography>{`Temperature: ${deviceTemperature}`}</Typography>
      <Typography>{`Humidity: ${deviceHumidity}`}</Typography>
      {name === '' ? (
        <Box>
          <Button 
            className={styles.addNameButton} 
            onClick={() => handleClick()}>
              Add name
          </Button>
        </Box>
      ) : null}
      {showInput ? (
        <Box className={styles.textBox}>
          <TextField variant='outlined' onChange={(e) => handleChange(e)} />
          <Button className={styles.sendButton} onClick={() => publishName()}>Send</Button>
        </Box>
      ) : null}
    </Card>
  )
}

export default Device
