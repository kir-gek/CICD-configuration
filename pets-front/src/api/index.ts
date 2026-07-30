import axios from 'axios';

// Описываем интерфейс прямо здесь, чтобы экспортировать его вместе с запросом
export interface Dog {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

const $host = axios.create({
    // Исправлено: добавлен http:// для дефолтного url, если переменная окружения пуста
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000',
});

// Функция запроса собак
export const fetchDogs = async (): Promise<Dog[]> => {
    // Делаем запрос к /api/dogs (базовый URL подставится автоматически)
    const response = await $host.get<Dog[]>('/api/dogs');
    return response.data;
};

export { $host };
