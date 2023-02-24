import React, { Component } from 'react';
import MainContainer from './Containers/MainContainer/MainContainer';
import styles from './styles.module.css';
import logo from './assets/logo.png'

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(logo)
    return (
      <div className={styles.root}>
        {/* <h1 className={styles.title}>RECIPE RESCUE 2.0</h1> */}
        {/* <img src='https://cdn.discordapp.com/attachments/1077719502441164860/1078435145729724446/Super_Sogbu__1_-removebg-preview.png'/> */}
        {/* <img src={require('./assets/logo.png')} alt='logo'/> */}
        <MainContainer />
      </div>
    );
  }
}

export default App;
