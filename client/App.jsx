import React, { Component } from 'react';
import MainContainer from './Containers/MainContainer';
import './styles.css';

class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1 className='recipeRescue'>RECIPE RESCUE 🥢</h1>
        <MainContainer />
      </div>
    );
  }
}

export default App;
