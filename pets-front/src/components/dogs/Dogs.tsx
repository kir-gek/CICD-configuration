import { useEffect, useState } from "react";
import {
  createDog,
  deleteDog,
  fetchDogs,
  updateDog,
  type Dog,
} from "../../api/dogs";
import { OneDog } from "./OneDog";

export const Dogs: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreator, setOpenCreator] = useState<boolean>(false);
  const [currentDescription, setCurrentDescription] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");

  const [confirm, setConfirm] = useState(false);

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

  const createNewDog = async () => {
    try {
      await createDog(currentTitle, currentDescription);
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

  return (
    <div className="w-full">
      {/* Сетка карточек: 1 на мобилках, 2 на планшетах, 3 на десктопе */}

      {dogs.length === 0 && (
        <div className="text-center py-8 font-mono text-sm text-slate-500">
          [ Array is empty. No dogs found ]
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{dogsAll}</div>
      <button className="bg-sky-100" onClick={() => setOpenCreator(true)}>
        Добавить породу
      </button>

      {openCreator && (
        <div className="bg-sky-50">
          <button
            onClick={() => setOpenCreator(false)}
            className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-all shadow-md hover:shadow-lg"
            title="Удалить"
          >
            ❌
          </button>
          <h2 className="text-xl font-bold mb-4">Создать породу</h2>
          <form>
            <input
              type="text"
              placeholder="Заголовок породы"
              className="w-full p-2 border rounded-lg mb-2"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Описание"
              className="w-full p-2 border rounded-lg mb-2"
              value={currentDescription}
              onChange={(e) => setCurrentDescription(e.target.value)}
            />

            <button
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              type="button"
              onClick={() => setConfirm(true)}
            >
              Создать
            </button>
          </form>
          {confirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 text-center animate-fadeIn">
                <h2 className="text-xl font-bold text-gray-800">Вы уверены?</h2>
                <p className="text-gray-600 mt-2">Создать эту породу?</p>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-semibold shadow-lg mr-2"
                    onClick={() => {
                      createNewDog();
                      setConfirm(false);
                    }}
                  >
                    ✅ Да, изменить
                  </button>
                  <button
                    type="button"
                    className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg hover:bg-gray-400 transition font-semibold shadow-lg ml-2"
                    onClick={() => setConfirm(false)}
                  >
                    ❌ Отмена
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
