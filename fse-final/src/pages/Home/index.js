import React, { useState, useEffect } from 'react'
import { Container, Grid } from '@material-ui/core'
import { useApp } from '../../hooks/useApp'
import Device from '../../components/Device/index'

const Home = () => {
  const { devices, client} = useApp()
  const [dev, setDev] = useState([{}])

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
      if(!err){
        console.log("Conectado");
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

  useEffect(() => {
    setDev(devices)
  }, [dev, devices]) 

  return (
    <Container maxWidth='lg'>
    <Grid
      container
      alignContent='center'
      alignItems='center'
      direction='row'
      spacing={5}
    >
      {dev.map((device, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Device
            name={device.name}
            id={device.id}
            temperature={device.temperature}
            humidity={device.humidity}
          />
        </Grid>
      ))}
    </Grid>
    </Container>
  )
}

export default Home
