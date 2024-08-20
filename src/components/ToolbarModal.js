import React from 'react';

const ToolbarModal = ({ onEdit, onSave, onDelete, onCancel, isFormOpen, isEditMode }) => {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <button
        onClick={onEdit}
        disabled={!isFormOpen}
        className="p-2 bg-blue-500 text-white rounded disabled:bg-blue-300"
      >
        Editar
      </button>
      <button
        onClick={onSave}
        disabled={!isFormOpen || !isEditMode}
        className="p-2 bg-green-500 text-white rounded disabled:bg-green-300"
      >
        Guardar
      </button>
      <button
        onClick={onDelete}
        disabled={!isFormOpen}
        className="p-2 bg-red-500 text-white rounded disabled:bg-red-300"
      >
        Borrar
      </button>
      <button
        onClick={onCancel}
        disabled={!isEditMode}
        className="p-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
      >
        Cancelar
      </button>
    </div>
  );
};

export default ToolbarModal;
