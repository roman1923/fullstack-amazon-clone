import React, {useState} from 'react';
import './Login.css';
import {Link} from 'react-router-dom';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


function Login() {
  const history = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    function push(){
      history('/')
    }

    const signIn = e => {
        e.preventDefault()

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then(auth => {
          push('/')
        })
        .catch(error => alert(error.message))

    }
    const register = e => {
        e.preventDefault();

        auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((auth) => {
          console.log(auth);
          if (auth) {
            push()
          }
        })
        .catch(error => alert(error.message))
    }
  return (
    <div className='login'>
      <Link to='/'>
        <img
        alt='img'
        className='login__logo'
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png" />
        </Link>
        <div className='login__container'>
            <h1>Sign-in</h1>
            <form>
                <h5>E-mail</h5>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} />

                <h5>Password</h5>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

                <button type="submit" onClick={signIn} className='login__signInButton'>Sign In</button>
            </form>
            <p>By signing-in you agree to Amazon clone
                Conditions of Use & Sale. Please
                see our Privacy Notice, our Cookies Notice
                and our Interest-Based Ads
                Notice.</p>

            <button onClick={register} className='login__registerButton'>
                Create your Amazon Account</button>
        </div>
    </div>
  )
}

export default Login
