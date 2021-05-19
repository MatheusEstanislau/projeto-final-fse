import React, { useState } from 'react'
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
import Switch from '../Switch'
import esp32 from '../../assets/esp32.jpg'
import mp3 from '../../utils/audioPlayer'
import { CSVLink } from 'react-csv'
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  card: {
    paddingBottom: 10
  },
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
  alarmBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))

const Device = ({ name, id }) => {
  const [showInput, setShowInput] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [deviceName, setDeviceName] = useState('')
  const [deviceTemperature, setDeviceTemperature] = useState(0)
  const [deviceHumidity, setDeviceHumidity] = useState(0)
  const { device, client } = useApp()
  const [registred, setRegistred] = useState(false)
  const [isAlarmOn, setIsAlarmOn] = useState(true)
  const [lamp, setLamp] = useState(true)
  const [logData, setLogData] = useState([['Command', 'State', 'Time']])

  const handleClick = () => {
    setShowInput(!showInput)
  }

  const handleChange = (e) => {
    setDeviceName(e.target.value)
  }

  const showConfirm = () => {
    setConfirm(true)
  }

  const publishName = () => {
    if (deviceName !== '') {
      device.subscribe(`fse2020/150141220/${deviceName}/#`)
      client.publish(
        `fse2020/150141220/dispositivos/${id}`,
        `{ "installedRoom": "${deviceName}" }`
      )
      setShowInput(false)
      setConfirm(false)
      setRegistred(true)
    }
  }

  const handleNewMessage = (topic, message) => {
    if (topic === `fse2020/150141220/${deviceName}/temperatura`) {
      const parsed = JSON.parse(message)
      if (parsed.temperature !== -1) setDeviceTemperature(parsed.temperature)
    } else if (topic === `fse2020/150141220/${deviceName}/umidade`) {
      const parsed = JSON.parse(message)
      if (parsed.humidity !== -1) setDeviceHumidity(parsed.humidity)
    } else if (topic === `fse2020/150141220/${deviceName}`) {
      const parsed = JSON.parse(message)
      if (parsed?.alarm === 1) {
        playAlarm()
      }
    }
  }

  device.on('message', handleNewMessage)

  const playAlarm = () => {
    if (!isAlarmOn) {
      mp3.play()
      setLogData((prevState) => [
        ...prevState,
        [
          'Play alarm',
          `${!isAlarmOn}`,
          `${moment().format('DD-MM-YYYY hh:mm:ss')}`,
        ],
      ])
    }
  }

  const toggleAlarm = () => {
    setIsAlarmOn(!isAlarmOn)
    client.publish(
      `fse2020/150141220/dispositivos/${id}`,
      `{ "alarm" : ${isAlarmOn} }`
    )
    setLogData((prevState) => [
      ...prevState,
      [
        'Toogle Alarm',
        `${isAlarmOn}`,
        `${moment().format('DD-MM-YYYY hh:mm:ss')}`,
      ],
    ])
  }

  const toggleLamp = () => {
    setLamp(!lamp)
    client.publish(
      `fse2020/150141220/dispositivos/${id}`,
      `{ "lamp" : ${lamp} }`
    )
    setLogData((prevState) => [
      ...prevState,
      [
        'Toogle Lamp',
        `${lamp}`,
        `${moment().format('DD-MM-YYYY hh:mm:ss')}`,
      ],
    ])
  }

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
        {registred ? (
          <>
            <Typography>{`Temperature: ${deviceTemperature} ºC`}</Typography>
            <Typography>{`Humidity: ${deviceHumidity} %`}</Typography>
            <Box className={styles.alarmBox}>
              <Typography>Alarm: </Typography>
              <Switch state={!isAlarmOn} onChange={() => toggleAlarm()} />
            </Box>
            <Box className={styles.alarmBox}>
              <Typography>Lamp: </Typography>
              <Switch state={!lamp} onChange={() => toggleLamp()} />
            </Box>
          </>
        ) : null}
      </Box>
      {name === '' ? (
        <Box className={styles.boxButton}>
          <Button
            className={styles.addNameButton}
            onClick={() => handleClick()}
          >
            {showInput ? 'Cancel' : 'Add Name'}
          </Button>
        </Box>
      ) : null}
      {showInput ? (
        <Box className={styles.textBox}>
          <TextField
            className={styles.textField}
            variant='outlined'
            onChange={(e) => handleChange(e)}
            fullWidth
          />
          <Button className={styles.sendButton} onClick={() => showConfirm()}>
            Send
          </Button>
        </Box>
      ) : null}
      {confirm ? (
        <Box className={styles.boxButton}>
          <Button
            className={styles.addNameButton}
            onClick={() => publishName()}
          >
            Confirm
          </Button>
        </Box>
      ) : null}
      <CSVLink className={styles.boxButton} data={logData}>Download Log</CSVLink>
    </Card>
  )
}

export default Device
