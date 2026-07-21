import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
const [message, setMessage] = useState('Загрузка...');

  useEffect(() => {
    axios.get('http://localhost:3000/api/ping')
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        console.error('Ошибка запроса:', error);
        setMessage('Не удалось подключиться к бэкенду');
      });
  }, []);
  return (
    <>
     <h1>Test version3</h1>
     <p>Get запрос на сервер:</p>
     <br></br>
     <p>{message}</p>
    </>
  )
}

export default App
