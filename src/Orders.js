import React, {useState, useEffect} from 'react';
import {db} from './firebase';
import './Orders.css';
import {useStateValue} from './StateProvider'
import Order from './Order';
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";



function Orders() {
  const [{basket, user}, dispatch] = useStateValue([]);
  const [orders, setOrders] = useState([]);
  const auth = getAuth();
  useEffect(() => {
    if(user){
      onSnapshot(query(collection(db, 'users', auth.currentUser.uid, 'orders'), orderBy('created', 'desc')), snapshot => {
        const orders = [];
        snapshot.forEach(doc => orders.push({id: doc.id, data: doc.data()}));
        setOrders(orders);
      });
      }else {
        setOrders([])
      }
  }, [user])
  return (
    <div className='orders'>
      <h1>Your Orders</h1>
      <div className='orders__order'>
        {orders?.map(order => (
          <Order order={order} />
        ))}
      </div>
    </div>
  )
}

export default Orders
