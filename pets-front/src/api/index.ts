import axios from 'axios';

const $host = axios.create({
    // Исправлено: добавлен http:// для дефолтного url, если переменная окружения пуста
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
});



export { $host };
