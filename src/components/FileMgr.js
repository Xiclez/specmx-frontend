import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';


const FileMgr = ({ files, isEditMode, onUpload, onDelete, onFileClick }) => {
  return (
    <div className="flex flex-col col-span-1">
      <label className="font-semibold text-xs text-gray-500 uppercase tracking-wider">Archivos</label>
      {Array.isArray(files) && files.length > 0 ? (
      files.map((fileObj, index) => (
        <div key={index} className="mt-2 flex items-center">
          <input
            type="text"
            value={fileObj.name || fileObj.url.split('/').pop()}
            onChange={(e) => {
              const updatedFiles = [...files];
              updatedFiles[index].name = e.target.value;
              onUpload(updatedFiles);
            }}
            className="p-1 border border-gray-300 rounded text-sm mr-2"
          />
<label
  onClick={() => window.open(fileObj.url, '_blank')}
  className="p-1 bg-gray-200 text-gray-700 rounded cursor-pointer"
>
  👁️
</label>
{isEditMode && (
  <button
    onClick={() => onDelete(fileObj.url)}
    className="ml-2 p-1 bg-red-500 text-white rounded"
  >
    🗑️
  </button>
)}


        </div>
      ))
      
          
      ) : (
        <span className="text-gray-500">No hay archivos</span>
      )}
      {isEditMode && (
        <div className="mt-2">
         <label
  htmlFor="fileUpload"
  className="p-2 bg-blue-500 text-white rounded cursor-pointer inline-block"
  aria-label="Subir archivo"
>
  <FontAwesomeIcon icon={faUpload} />
</label>
<input
  id="fileUpload"
  type="file"
  accept="application/pdf"
  onChange={(e) => onUpload(e.target.files)}
  className="hidden"
/>

        </div>
      )}
    </div>
  );
};

export default FileMgr;
