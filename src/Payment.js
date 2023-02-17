import React, {useState, useEffect} from 'react';
import './Payment.css';
import {useStateValue} from './StateProvider';
import CheckoutProduct from './CheckoutProduct';
import { Link, useNavigate } from 'react-router-dom';
import {CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from 'react-currency-format';
import {getBasketTotal} from './reducer'
import axios from './axios';
import {db} from './firebase'
import {collection, addDoc, setDoc, doc} from 'firebase/firestore'


function Payment() {
    const [{basket, user}, dispatch] = useStateValue();
    const stripe = useStripe();
    const elements = useElements();

    const [succeeded, setSucceeded] = useState(false)
    const [processing, setProcessing] = useState('')
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getClientSecret = async () => {
            const response = await axios({
                method: 'post',
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`
            });
            setClientSecret(response.data.clientSecret)
        }
        getClientSecret();
    }, [basket]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
      
        try {
          const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement)
            }
          });
          
          const paymentIntent = payload.paymentIntent;
          const userId = user?.uid;
          //const userRef = doc(collection(db, "users"), user?.id);
          //const ordersRef = doc(collection(userRef, "orders"), paymentIntent.id);
          const userRef = doc(db, "users", userId);
          const ordersRef = collection(userRef, "orders");
          const orderDoc = doc(ordersRef, paymentIntent.id);
      
          await setDoc(orderDoc, {
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });
      
          setSucceeded(true);
          setError(null);
          setProcessing(false);
      
          dispatch({
            type: 'EMPTY_BASKET'
          });
      
          navigate("/orders", { replace: true });
        } catch (error) {
          setError(error.message);
          setProcessing(false);
        }
      }
    const handleChange = event => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "")
    }
    
  return (
    <div className='payment'>
      <div className='payment__container'>
        <h1>
            Checkout(<Link to="/checkout">{basket?.length} items</Link>)
        </h1>
        <div className='payment__section'>
            <div className='payment__title'>
                <h3>Delivery Address</h3>
            </div>
            <div className='payment__adress'>
                <p>{user?.email}</p>
                <p>123 React Lane</p>
                <p>Los Angeles, CA</p>
            </div>
        </div>
        <div className='payment__section'>
            <div className='payment__title'>
                <h3>Review items and delivery</h3>
            </div>
            <div className='payment__items'>
                {basket.map(item => (
                    <CheckoutProduct 
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    />
                ))}
            </div>
        </div>
        <div className='payment__section'>
            <div className='payment__title'>
                <h3>Payment Method</h3>
            </div>
            <div className='payment__details'>
                <form className='form' onSubmit={handleSubmit}>
                    <CardElement onChange={handleChange} />

                    <div className='payment__priceConteiner'>
                    <CurrencyFormat
                        renderText={(value) => (
                            <h3>Order Total: {value}</h3>
                        
                        )}
                        decimalScale={2}
                        value={getBasketTotal(basket)}
                        displayType={"text"}
                        thousandSeparator={true}
                        prefix={"$"} />
                        <button disabled={processing || disabled || succeeded}>
                            <span>{processing ? <p>Processing</p> :
                            'Buy Now'}</span>
                        </button>
                    </div>
                    {error && <div>{error}</div>}
                </form>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Payment
