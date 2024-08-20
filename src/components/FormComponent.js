import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PencilIcon } from '@heroicons/react/outline';

const FormComponent = ({ resource, tabs = [], fetchUrl, createUrl, updateUrl, formData, onChange, isEditable }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].name : '');
  const [isLoading, setIsLoading] = useState(!!id);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`${fetchUrl}/${id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching ${resource}: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          onChange({ ...formData, ...data });
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error.message);
          setErrorMessage(error.message);
          setIsLoading(false);
        });
    }
  }, [id, fetchUrl, resource, onChange, formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const requestOptions = {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    };

    const endpoint = id ? `${updateUrl}/${id}` : createUrl;

    fetch(endpoint, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error saving ${resource}: ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (!id) {
          navigate(`/${resource}/view/${data._id}`);
        }
      })
      .catch((error) => {
        console.error(error.message);
        setErrorMessage(error.message);
      });
  };

  const handleChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      onChange({ ...formData, [name]: value });
    } else {
      console.error("Event target is not defined. Please check your input or onChange handling.");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-md shadow-md">
      {isLoading ? (
        <div className="text-center text-gray-500">Cargando...</div>
      ) : errorMessage ? (
        <div className="text-center text-red-500">{errorMessage}</div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {resource && id 
                ? `Detalles de ${resource.charAt(0).toUpperCase() + resource.slice(1)}`
                : resource
                ? `Crear ${resource.charAt(0).toUpperCase() + resource.slice(1)}`
                : 'Formulario'}
            </h2>
            {id && !isEditable && (
              <button onClick={() => navigate(`/${resource}/edit/${id}`)} className="text-yellow-500 hover:text-yellow-700">
                <PencilIcon className="h-6 w-6" />
              </button>
            )}
          </div>

          <div className="flex mb-4">
            {tabs.map(tab => (
              <button
                key={tab.name}
                className={`py-2 px-4 ${activeTab === tab.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'} rounded-t`}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tabs.find(tab => tab.name === activeTab)?.fields.map(field => (
              <div key={field.name} className="mb-4">
                <label className="block text-gray-700">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  required={field.required}
                  readOnly={!isEditable || field.readOnly}
                />
              </div>
            ))}
            {isEditable && (
              <div className="col-span-full mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => navigate(`/${resource}`)}
                  className="bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};

export default FormComponent;
