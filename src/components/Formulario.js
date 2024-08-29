import React, { useState, useEffect } from 'react';
import IdMgr from './idMgr';
import FileMgr from './FileMgr';
import CsfUploader from './CsfUploader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faSave, faTrash, faPlusCircle, faEllipsisV } from '@fortawesome/free-solid-svg-icons';


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
  onFileDelete,
}) => {
  const [initialFormData, setInitialFormData] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});
  const [activeTab, setActiveTab] = useState('info');

  useEffect(() => {
    if (isEditMode) {
      setInitialFormData(formData);
    }
  }, [isEditMode, formData]);

  const handleInputChange = (field, value) => {
    const updatedValue = Array.isArray(value)
      ? value.map((val) => (typeof val === 'object' ? val._id.toString() : val.toString()))
      : typeof value === 'object' ? [value._id.toString()] : value.toString();
    
    onInputChange(field, updatedValue);
  
    if (updatedValue !== initialFormData[field]) {
      setModifiedFields(prev => ({ ...prev, [field]: updatedValue }));
    } else {
      setModifiedFields(prev => {
        const updatedFields = { ...prev };
        delete updatedFields[field];
        return updatedFields;
      });
    }
  };

  const getResourceName = (field) => {
    switch (field) {
      case 'clienteId':
        return 'cliente';
      case 'empresaId':
        return 'empresa';
      case 'proyectoId':
        return 'proyecto';
      case 'tareaId':
        return 'tarea';
      case 'servicioId':
        return 'servicio';
      case 'facturaId':
        return 'factura';
      case 'colaboradorId':
        return 'colaborador';
      case 'usuarioId':
        return 'usuario';
      default:
        return 'resource';
    }
  };

  const renderFormField = (field, value = '') => {
    const recurso = getResourceName(field);

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
            <IdMgr
              endpoint={`http://localhost:3010/api/${recurso}/get${recurso.charAt(0).toUpperCase()}${recurso.slice(1)}s`}
              existingIds={Array.isArray(value) ? value.map(item => item.toString()) : []}
              isEditMode={isEditMode}
              onSelect={(selectedId) => handleInputChange(field, selectedId)}
              onDelete={(selectedId) => {
                const updatedArray = value.filter(item => item.toString() !== selectedId);
                handleInputChange(field, updatedArray);
              }}
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
            value.map((fileObj, index) => (
              <div key={index} className="mt-2 flex items-center">
                <span className="text-sm text-gray-500">{fileObj.url.split('/').pop()}</span>
                <button
  onClick={() => handleFileClick(fileObj.url)}
  className="ml-2 p-1 bg-gray-200 text-gray-700 rounded"
  aria-label="Opciones de archivo"
>
  <FontAwesomeIcon icon={faEllipsisV} />
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
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        </div>
      );
    }
  };

  const renderForm = () => {
    const filteredHeaders = headers.filter(header => !header.endsWith('Id') && header !== 'files');

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHeaders.map((header) => renderFormField(header, formData[header]))}
      </div>
    );
  };

  const handleSave = () => {
    onSave(modifiedFields);
  };

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white w-3/4 max-w-4xl p-8 rounded-lg shadow-lg overflow-y-auto max-h-full relative">
        <button
  onClick={onClose}
  className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
  aria-label="Cerrar"
>
  <FontAwesomeIcon icon={faTimes} />
</button>

          <div className="flex items-center space-x-4 mb-4">
            {!isCreateMode && (
              <>
                <button
  onClick={onEdit}
  className="p-2 bg-blue-500 text-white rounded"
  aria-label="Editar"
>
  <FontAwesomeIcon icon={faEdit} />
</button>

<button
  onClick={onSave}
  disabled={!isEditMode}
  className="p-2 bg-green-500 text-white rounded"
  aria-label="Guardar"
>
  <FontAwesomeIcon icon={faSave} />
</button>

<button
  onClick={onDelete}
  className="p-2 bg-red-500 text-white rounded"
  aria-label="Borrar"
>
  <FontAwesomeIcon icon={faTrash} />
</button>

              </>
            )}
            {isCreateMode && (
             <button
             onClick={onSave}
             className="p-2 bg-green-500 text-white rounded"
             aria-label="Crear"
           >
             <FontAwesomeIcon icon={faPlusCircle} />
           </button>
           
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-4">
              {isCreateMode ? 'Crear Nuevo Registro' : 'Detalles del Elemento Seleccionado'}
            </h3>
            <div className="flex space-x-4 mb-4">
              <label
                onClick={() => setActiveTab('info')}
                className={`p-2 rounded cursor-pointer ${activeTab === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Información
              </label>
              <label
                onClick={() => setActiveTab('relations')}
                className={`p-2 rounded cursor-pointer ${activeTab === 'relations' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Relaciones
              </label>
              <label
                onClick={() => setActiveTab('files')}
                className={`p-2 rounded cursor-pointer ${activeTab === 'files' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
              >
                Archivos
              </label>
            </div>
            {isCSFMode && (
              <div className="mb-4">
                <CsfUploader onUploadComplete={onUploadComplete} />
              </div>
            )}
            {activeTab === 'info' && renderForm()}
            {activeTab === 'relations' && (
              headers.filter(header => header.endsWith('Id')).map((header) => (
                <IdMgr
                  key={header}
                  endpoint={`http://localhost:3010/api/${getResourceName(header)}/get${getResourceName(header).charAt(0).toUpperCase()}${getResourceName(header).slice(1)}s`}
                  existingIds={formData[header] || []}
                  isEditMode={isEditMode}
                  onSelect={(selectedId) => handleInputChange(header, [...(formData[header] || []), selectedId])}
                  onDelete={(selectedId) => handleInputChange(header, (formData[header] || []).filter(id => id !== selectedId))}
                />
              ))
            )}
            {activeTab === 'files' && (
              <FileMgr
                files={formData.files || []}
                isEditMode={isEditMode}
                onUpload={(newFiles) => onFileUpload('files', newFiles)}
                onDelete={(fileUrl) => onFileDelete('files', fileUrl)}
                onFileClick={handleFileClick}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default Formulario;
