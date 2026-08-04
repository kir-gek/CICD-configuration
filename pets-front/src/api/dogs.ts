import { $host } from "./index"

export interface Dog {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export const fetchDogs = async (): Promise<Dog[]> => {
    const response = await $host.get<Dog[]>('/dogs');
    return response.data;
};

export const createDog = async (title: string, description: string) => {
    const { data } = await $host.post('/dogs', { title, description })
    return data
}

export const updateDog = async (id: number, title: string, description: string) => {
    const { data } = await $host.put('/dogs', { id, title, description })
    return data
}

export const deleteDog = async (id: number) => {
    const { data } = await $host.delete(`/dogs/${id}`)
    return data
}