import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Modal } from "../Modal";
import { ConfirmModal } from "../Modal/ConfirmModal";
import { EditDog } from "./EditDog";

interface AdminOneDog {
  title: string;
  description: string;
  ID: number;
  updateDogsList: () => void;
  deleteCurrentDog: () => void;
  updateCurrentDog: (
    ID: number,
    currentTitle: string,
    currentDescription: string,
  ) => void;
}

export const OneDog: React.FC<AdminOneDog> = ({
  title,
  description,
  ID,
  updateCurrentDog,
  deleteCurrentDog,
  updateDogsList,
}) => {
  const [modalType, setModalType] = useState<string | null>(null);

  const openModal = (type: string) => setModalType(type);
  const closeModal = () => setModalType(null);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-blue-300 relative group">
      {/* Заголовок и кнопки */}
      <div className="p-5 pb-3 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800 truncate pr-10">
              {title}
            </h3>
            <p className="text-gray-600">
              <span className="font-semibold">Описание:</span> {description}
            </p>
            <span className="text-sm text-gray-500">id: {ID}</span>
          </div>

          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => openModal("dogEdit")}
              className="p-2 bg-white text-blue-600 rounded-full hover:bg-blue-50 transition-all shadow-md hover:shadow-lg"
              title="Редактировать"
            >
              <Pencil size={16} />
            </button>
            <button
              disabled={ID === 1}
              onClick={() => openModal("dogDelete")}
              className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-all shadow-md hover:shadow-lg"
              title="Удалить"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={modalType === "dogDelete"} onClose={closeModal}>
        <ConfirmModal
          title1={`Удалить породу ${title} ?`}
          actionConfirm={deleteCurrentDog}
          onClose={closeModal}
        />
      </Modal>

      <Modal isOpen={modalType === "dogEdit"} onClose={closeModal}>
        <EditDog
          ID={ID}
          title={title}
          description={description}
          updateDogsList={updateDogsList}
          updateCurrentDog={updateCurrentDog}
        />
      </Modal>
    </div>
  );
};
