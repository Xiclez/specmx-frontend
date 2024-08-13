// components/OrderManagement.js
import React, { useState } from 'react';
import OrderList from './OrderList';
import OrderEditor from './OrderEditor';

const OrderManagement = () => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsEditing(true);
  };

  const handleViewClick = (orderId) => {
    setSelectedOrderId(orderId);
    setIsEditing(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    setSelectedOrderId(null);
  };

  return (
    <div className="order-management">
      <h1>Order Management</h1>
      {isEditing ? (
        <OrderEditor orderId={selectedOrderId} onSave={handleSave} />
      ) : (
        <OrderList onEditClick={handleEditClick} onViewClick={handleViewClick} />
      )}
    </div>
  );
};

export default OrderManagement;
