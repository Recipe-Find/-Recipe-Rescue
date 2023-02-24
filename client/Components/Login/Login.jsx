import React, { useState } from 'react';
import { useInput } from '../CustomHooks';

import styles from './Login.module.css'

const Login = () => {
  //--------------------------STATES OF LOGGING IN -----------------------------
  const [username, [setUsername, userNameOnChange]] = useInput('');
  const [password, [setPassword, passwordOnChange]] = useInput('');
  const [errorMessage, setErrorMessage] = useState(null);

  //----------------------------FORM SUMISSION---------------------------------
  /** When Login button is clicked, submit a post request to login with username & password
   * If username & password match database, backend will redirect to homepage
   * If either not match, backend will send back an error message => display the error message
   */
  const handleFormSubmit = (e) => {
    //Prevent the page reload
    e.preventDefault();
    console.log('submit');
    //Send post request with username & password to login
    fetch(`/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      //If not being redirect to recipe page, then get the text message
      .then((res) => {
        console.log(res);
        //If username & password match, redirect according backend url
        if (res.redirected) {
          return (window.location.href = res.url);
        }
        //Else, get the error message from backend
        return res.json();
      })
      .then((errorMess) => {
        // Set ErrorMessage state => this will cause errorMessage to be rendered
        setErrorMessage(errorMess);
        //Reset username & password
        setUsername('');
        setPassword('');
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.heading}>WELCOME BACK!</h1>
      <div className={styles.input}>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor='username'>username: </label>
          <input className={styles.inputBox} type='text' name='username' onChange={userNameOnChange} value={username} />
        </div>
        <div>
          <label htmlFor='password'>password: </label>
          <input className={styles.inputBox} type='password' name='password' onChange={passwordOnChange} value={password} />
        </div>
        {errorMessage ? <p>{errorMessage}</p> : null}
        <button className={styles.button} type='submit'>LOG IN</button>
      </form>
      </div>
    </div>
  );
};
export default Login;
