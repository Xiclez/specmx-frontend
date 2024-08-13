// components/OrderList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OrderCard from './OrderCard';

const OrderList = ({ onEditClick, onViewClick }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/order/getOrders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="order-list">
      {orders.map((order) => (
        <OrderCard 
          key={order._id} 
          order={order} 
          onEditClick={onEditClick} 
          onViewClick={onViewClick} 
        />
      ))}
    </div>
  );
};

export default OrderList;
