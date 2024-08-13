// components/OrderCard.js
import React from 'react';

const OrderCard = ({ order, onEditClick, onViewClick }) => {
  return (
    <div className="order-card" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
      <h3>{order.title}</h3>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Progress:</strong> {order.progress}%</p>
      <button onClick={() => onViewClick(order._id)}>View Details</button>
      <button onClick={() => onEditClick(order._id)}>Edit Order</button>
    </div>
  );
};

export default OrderCard;
