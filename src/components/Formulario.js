import React from 'react';
import SearchBar from './SearchBar';
import CsfUploader from './CsfUploader';

const Formulario = ({
  isModalOpen,
  isCreateMode,
  isEditMode,
  isCSFMode,
  formData,
  headers,
  resourceData,
  onClose,
  onEdit,
  onSave,
  onDelete,
  onInputChange,
  onFileUpload,
  onUploadComplete,
  handleFileClick,
}) => {
  const renderFormField = (field, value = '') => {
    const recurso = field.replace('Id', '').toLowerCase();

    if (field.endsWith('Id')) {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
            {field.replace('Id', '')}
          </label>
          {!isEditMode && !isCreateMode ? (
            <span>
              {resourceData[value?._id] ? (
                recurso === 'cliente'
                  ? `${resourceData[value?._id].Nombre} ${resourceData[value?._id].ApellidoPaterno}`
                  : recurso === 'empresa'
                  ? resourceData[value?._id].DenominacionRazonSocial
                  : recurso === 'proyecto' || recurso === 'tarea'
                  ? `${resourceData[value?._id].nombre} (${resourceData[value?._id].fechaInicio})`
                  : recurso === 'servicio'
                  ? `${resourceData[value?._id].nombre} (${resourceData[value?._id].createdAt.split('T')[0]})`
                  : recurso === 'factura' || recurso === 'colaborador'
                  ? `${resourceData[value?._id].nombre} ${resourceData[value?._id].apellido}`
                  : recurso === 'usuario'
                  ? resourceData[value?._id].email
                  : 'No match'
              ) : (
                "N/A"
              )}
            </span>
          ) : (
            <SearchBar
              endpoint={`http://localhost:3010/api/${recurso}/get${recurso.charAt(0).toUpperCase()}${recurso.slice(1)}s`}
              onSelect={(selectedId) => onInputChange(field, selectedId)}
            />
          )}
        </div>
      );
    } else if (field === 'profilePhoto') {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Foto de Perfil</label>
          {typeof value === 'string' && value ? (
            <img src={value} alt="Foto de Perfil" className="w-32 h-32 object-cover rounded-md" />
          ) : (
            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-md">
              <span className="text-gray-500">No hay foto</span>
            </div>
          )}
          {(isEditMode || isCreateMode) && (
            <div className="mt-2">
              <input
                id="profilePhotoUpload"
                type="file"
                accept="image/*"
                onChange={(e) => onFileUpload(field, e.target.files)}
                className="hidden"
              />
              <label
                htmlFor="profilePhotoUpload"
                className="mt-2 p-2 bg-blue-500 text-white rounded cursor-pointer inline-block"
              >
                Subir
              </label>
            </div>
          )}
        </div>
      );
    } else if (field === 'files') {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Archivos</label>
          {Array.isArray(value) && value.length > 0 ? (
            value.map((fileUrl, index) => (
              <div key={index} className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">{fileUrl.split('/').pop()}</span>
                <button
                  onClick={() => handleFileClick(fileUrl)}
                  className="ml-2 p-1 bg-gray-200 text-gray-700 rounded"
                >
                  &#x22EE;
                </button>
              </div>
            ))
          ) : (
            <span className="text-gray-500">No hay archivos</span>
          )}
          {(isEditMode || isCreateMode) && (
            <div className="mt-2">
              <input
                id="fileUpload"
                type="file"
                accept="application/pdf"
                onChange={(e) => onFileUpload(field, e.target.files)}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="p-2 bg-blue-500 text-white rounded cursor-pointer inline-block"
              >
                Subir
              </label>
            </div>
          )}
        </div>
      );
    } else if (Array.isArray(value)) {
      if (typeof value[0] === 'string') {
        return (
          <div key={field} className="space-y-4 col-span-1">
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</h4>
            {value.map((item, index) => (
              <div key={index} className="flex flex-col">
                <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  Elemento {index + 1}
                </label>
                <input
                  type="text"
                  value={item}
                  readOnly={!isEditMode && !isCreateMode}
                  className="p-2 border border-gray-300 rounded text-sm"
                  style={{ minWidth: '0', width: 'auto', maxWidth: '100%' }}
                  onChange={(e) => onInputChange(`${field}[${index}]`, e.target.value)}
                />
              </div>
            ))}
          </div>
        );
      } else {
        return (
          <div key={field} className="space-y-4 col-span-1">
            <h4 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</h4>
            {value.map((item, index) => (
              <div key={index} className="space-y-2 pl-4 border-l-2 border-gray-200">
                <h5 className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Elemento {index + 1}</h5>
                {Object.keys(item).map((subKey) => (
                  <div key={subKey} className="flex flex-col">
                    <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{subKey}</label>
                    <input
                      type="text"
                      value={item[subKey]}
                      readOnly={!isEditMode && !isCreateMode}
                      className="p-2 border border-gray-300 rounded text-sm"
                      style={{ minWidth: '0', width: 'auto', maxWidth: '100%' }}
                      onChange={(e) => onInputChange(`${field}[${index}].${subKey}`, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</label>
          <span>{value?.name || value?.Nombre || value?.nombre || "N/A"}</span>
        </div>
      );
    } else {
      return (
        <div key={field} className="flex flex-col col-span-1">
          <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">{field}</label>
          <input
            type="text"
            value={value}
            readOnly={!isEditMode && !isCreateMode}
            className="p-2 border border-gray-300 rounded text-sm"
            style={{ minWidth: '0', width: 'auto', maxWidth: '100%' }}
            onChange={(e) => onInputChange(field, e.target.value)}
          />
        </div>
      );
    }
  };

  const renderForm = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {headers.map((header) => renderFormField(header, formData[header]))}
      </div>
    );
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white w-3/4 max-w-4xl p-8 rounded-lg shadow-lg overflow-y-auto max-h-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
          >
            X
          </button>
          <div className="flex items-center space-x-4 mb-4">
            {!isCreateMode && (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={onSave}
                  disabled={!isEditMode}
                  className="p-2 bg-green-500 text-white rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={onDelete}
                  className="p-2 bg-red-500 text-white rounded"
                >
                  Borrar
                </button>
              </>
            )}
            {isCreateMode && (
              <button
                onClick={onSave}
                className="p-2 bg-green-500 text-white rounded"
              >
                Crear
              </button>
            )}
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold mb-4">
              {isCreateMode ? 'Crear Nuevo Registro' : 'Detalles del Elemento Seleccionado'}
            </h3>
            {isCSFMode && (
              <div className="mb-4">
                <CsfUploader onUploadComplete={onUploadComplete} />
              </div>
            )}
            {renderForm()} {/* Usando formData para asegurar que los campos estén editables */}
          </div>
        </div>
      </div>
    )
  );
};

export default Formulario;
