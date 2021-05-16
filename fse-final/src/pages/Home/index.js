import React, { useState, useEffect, memo } from 'react'
import { Typography, Grid } from '@material-ui/core'
import mqtt from 'mqtt'
import { useApp } from '../../hooks/useApp'
import Device from '../../components/Device/index'

const Home = () => {
  const { devices, addDevice, client} = useApp()
  const [dev, setDev] = useState([{}])
  const [message, setMessage] = useState('')

  const memoizedValue = (id) => {
    const auxArray = dev
    const found = auxArray.find((element) => element.id === id)
    if (found) {
    } else {
      auxArray.push({ id: id, name: '', temperature: 0, humidity: 0 })
      setDev(auxArray)
    }
  }

  client.on('connect', function () {
    client.subscribe('fse2020/150141220/dispositivos/#', function (err) {
    })
  })

  client.on('message', function (topic, message) {
    var deviceString = 'dispositivos'
    if (topic.includes(deviceString)) {
      const messageParsed = JSON.parse(message)
      memoizedValue(messageParsed.id)
    }
  })

  useEffect(() => {
    setDev(devices)
  }, [dev, devices])

  // const [data, setData] = useState('');
  // const fetchData = async () => {
  //   const {data } = await api.get('hello')
  //   setData(data.hello)
  // }
  // setInterval(() => fetchData(), 2000)

  return (
    <Grid
      container
      alignContent='center'
      alignItems='center'
      direction='row'
      spacing={3}
    >
      {dev.map((device, index) => (
        <Grid item sm={3} key={index}>
          <Device
            name={device.name}
            id={device.id}
            temperature={device.temperature}
            humidity={device.humidity}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default Home
