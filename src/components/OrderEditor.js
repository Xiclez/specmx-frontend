// components/OrderEditor.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderEditor = ({ orderId, onSave }) => {
  const [order, setOrder] = useState({
    clientId: '',
    collaboratorId: '',
    title: '',
    description: '',
    status: 'En progreso',
    progress: 0
  });

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/getOrder${orderId}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (orderId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/order/updateOrder/${orderId}`, order);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/order/createOrder`, order);
      }
      onSave();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  return (
    <div className="order-editor">
      <h2>{orderId ? 'Edit Order' : 'Create Order'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Client ID:</label>
          <input
            type="text"
            name="clientId"
            value={order.clientId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Collaborator ID:</label>
          <input
            type="text"
            name="collaboratorId"
            value={order.collaboratorId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={order.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={order.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <select
            name="status"
            value={order.status}
            onChange={handleChange}
          >
            <option value="En progreso">En progreso</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>
        <div>
          <label>Progress:</label>
          <input
            type="number"
            name="progress"
            value={order.progress}
            onChange={handleChange}
            min="0"
            max="100"
            required
          />
        </div>
        <button type="submit">{orderId ? 'Update Order' : 'Create Order'}</button>
      </form>
    </div>
  );
};

export default OrderEditor;
