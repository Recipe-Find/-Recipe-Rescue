import React, { Component } from 'react';
import MainContainer from './Containers/MainContainer/MainContainer';
import styles from './styles.module.css';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.background}>
        <h1 className={styles.title}>RECIPE RESCUE 2.0</h1>
        <img src='/assets/logo.png'></img>
        <MainContainer />
      </div>
    );
  }
}

export default App;
