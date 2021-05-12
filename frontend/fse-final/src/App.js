import api from './api/services/api'
import React, {useState, useEffect} from 'react'

function App() {
  const [response, setResponse] = useState();
  const fetchData = async () => {
    const {data} = await api.get('/hello')
    setResponse(data.hello)
  }
  useEffect(() => {
    fetchData()
  }, []);
  return (
    <div>{response}</div>
  );
}

export default App;
