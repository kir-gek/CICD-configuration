import { Dogs } from "./components/dogs/Dogs";

function App() {
  return (
    // Увеличили max-w-2xl до max-w-6xl, чтобы карточки встали в красивый ряд
    <div className="max-w-6xl mx-auto my-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 shadow-xl">
      <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-3">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400">
           Список крутых породпп!!!!!!:
        </span>
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-400">
           Тест 1(фронт онли начало ветки):
        </span>
        <p>Делаем тест для проверки копирования БД</p>
      </div>
      <Dogs />
    </div>
  );
}

export default App;
