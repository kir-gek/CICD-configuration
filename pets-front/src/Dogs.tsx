import { useEffect, useState } from 'react';
import { fetchDogs } from './api/index'; // Не забудьте импортировать Dog, если он там описан

export const Dogs: React.FC = () => {
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getDogsData = async () => {
            try {
                setLoading(true);
                const data = await fetchDogs();
                setDogs(data);
            } catch (err) {
                console.error('Ошибка при получении собак:', err);
                setError('Не удалось подключиться к бэкенду');
            } finally {
                setLoading(false);
            }
        };

        getDogsData();
    }, []);

    // Спиннер под стиль Slate темы
    if (loading) {
        return (
            <div className="flex h-48 flex-col items-center justify-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                <p className="text-sm font-mono text-slate-400">Loading api data...</p>
            </div>
        );
    }

    // Красивое неоновое темное окно ошибки
    if (error) {
        return (
            <div className="mx-auto max-w-md rounded-lg bg-red-950/30 p-4 text-center text-red-400 shadow-sm border border-red-900/50 font-mono text-sm">
                <p>{error}</p>
            </div>
        );
    }

    if (dogs.length === 0) {
        return (
            <div className="text-center py-8 font-mono text-sm text-slate-500">
                [ Array is empty. No dogs found ]
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Сетка карточек: 1 на мобилках, 2 на планшетах, 3 на десктопе */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {dogs.map(dog => (
                    <div 
                        key={dog.id} 
                        className="flex flex-col justify-between rounded-xl bg-slate-900 p-5 shadow-inner border border-slate-800/80 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-indigo-500/5 hover:-translate-y-0.5"
                    >
                        <div>
                            {/* Имя собаки */}
                            <h2 className="mb-2 text-base font-bold text-slate-100 tracking-tight capitalize">
                                {dog.title}
                            </h2>
                            {/* Описание */}
                            <p className="text-sm leading-relaxed text-slate-400 font-sans">
                                {dog.description}
                            </p>
                        </div>
                        
                        {/* Технический футер в стиле JSON/Лога */}
                        <div className="mt-4 border-t border-slate-800/60 pt-3 flex items-center justify-between font-mono text-[11px] text-slate-500">
                            <span>ID: {dog.id}</span>
                            <span>{new Date(dog.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
