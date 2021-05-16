import React, { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardActionArea,
  Typography,
  Button,
  TextField,
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

  return (
    <Card>
      <Typography>{`Device Id: ${id}`}</Typography>
      <Typography>{`Device name: ${deviceName}`}</Typography>
      <Typography>{`Temperature: ${deviceTemperature}`}</Typography>
      <Typography>{`Humidity: ${deviceHumidity}`}</Typography>
      {name === '' ? (
        <Button onClick={() => handleClick()}>Add name</Button>
      ) : null}
      {showInput ? (
        <>
          <TextField variant='outlined' onChange={(e) => handleChange(e)} />
          <Button onClick={() => publishName()}>Send</Button>
        </>
      ) : null}
    </Card>
  )
}

export default Device
