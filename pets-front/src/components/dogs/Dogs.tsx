import { useEffect, useState } from "react";
import { deleteDog, fetchDogs, updateDog, type Dog } from "../../api/dogs";
import { OneDog } from "./OneDog";

export const Dogs: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateDogsList = async () => {
    try {
      setLoading(true);
      const data = await fetchDogs();
      setDogs(data);
    } catch (err) {
      console.error("Ошибка при получении собак:", err);
      setError("Не удалось подключиться к бэкенду");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    updateDogsList();
  }, []);

  const deleteCurrentDog = async (id: number) => {
    try {
      await deleteDog(id);
      updateDogsList();
    } catch (error: any) {
      console.error("Ошибка при удалении", error);
    }
  };

  const updateCurrentDog = async (
    ID: number,
    currentTitle: string,
    currentDescription: string,
  ) => {
    try {
      await updateDog(ID, currentTitle, currentDescription);
      updateDogsList();
    } catch (error: any) {
      console.error("Ошибка при изменении", error);
    }
  };

  let dogsAll = dogs.map((dog: Dog) => (
    <OneDog
      key={dog.id}
      title={dog.title}
      description={dog.description}
      ID={dog.id}
      updateCurrentDog={updateCurrentDog}
      updateDogsList={() => updateDogsList()}
      deleteCurrentDog={() => deleteCurrentDog(dog.id)}
    />
  ));

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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dogsAll}</div>
    </div>
  );
};
