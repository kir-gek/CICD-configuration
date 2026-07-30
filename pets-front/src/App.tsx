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
 <div className="max-w-2xl mx-auto my-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
  <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-3">
    <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400">
      Get запрос на сервер:
    </span>
    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-medium text-emerald-400">
      200 OK
    </span>
  </div>
  <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-slate-300">
    <code>{message}</code>
  </pre>
</div>

  )
}

export default App
