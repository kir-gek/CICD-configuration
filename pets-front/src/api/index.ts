import axios from 'axios';

// Создаем экземпляр Axios
const $host = axios.create({
  // withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,
});

const $authHost = axios.create({
  // withCredentials: true,
  baseURL: import.meta.env.VITE_API_URL,

});

// добавляем токен в локальное хранилище]
const authInterceptor = (config: any) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}

$authHost.interceptors.request.use(authInterceptor)   //будет отрабатывать при каждом запросе и подсталять токен в хедер авторизейшн

export {
  $host,
  $authHost
}