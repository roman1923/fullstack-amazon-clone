import React, { useEffect } from 'react';
import './App.css';
import Header from './Header';
import Home from './Home';
import Checkout from './Checkout';
import Login from './Login';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {auth} from './firebase'
import { useStateValue } from './StateProvider';
import Payment  from './Payment';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Orders from './Orders';

const promise = loadStripe('pk_test_51MaPQmAWfyUNaO7H0CVyIeXSRo0AjBwCUbzJgtTl1FZgmX1NbwOLTlHf72wNhkbUisHaQW2iK8TQVvhtAdnhEGJL00g0vesNQj');

function App() {
  const [{}, dispatch] = useStateValue();
  useEffect(() => {
    auth.onAuthStateChanged(authUser => {
      console.log('THE USER IS >>> ', authUser);

    if (authUser) {
      dispatch({
        type: 'SET_USER',
        user: authUser
      })
    } else {
      dispatch({
        type: 'SET_USER',
        user: null
      })
    }
    })
  }, [])
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path='/' element={<Header />}>
            <Route index element={<Home />} />
            <Route path='/checkout' element={<Checkout />} /> 
            <Route path='/login' element={<Login />} />
            <Route path='/payment' element={(<Elements stripe={promise}>
              <Payment />
            </Elements>)} /> 
            <Route path='/orders' element={<Orders />} />       
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
