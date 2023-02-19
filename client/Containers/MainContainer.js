import React, { useState } from 'react';
import SavedRecipes from '../Components/SavedRecipes';
import Ingredients from '../Components/Ingredients';

const MainContainer = () => {
  // create state for rendered page, initially show ingredients component -> for users to enter ingredients
  const [renderedPage, setRenderedPage] = useState('ingredients');

  const renderPage = () => {
    // if renderedPage is 'ingredients'
    // return <Ingredients /> componenet
    // if renderedPage is 'saved'
    // return <SavedRecipes /> component
    // else render null
    if (renderedPage === 'ingredients') {
      return <Ingredients />;
    } else if (renderedPage === 'saved') {
      return <SavedRecipes />;
    } else {
      return null;
    }
  };

  //adding onClick methods on our buttons to {useState} hook to assign state as either ingredients or saved
  //we then call renderPage() -> depending on our state set by buttons
  //render either Ingredients or Saved Recipes Component
  return (
    <div>
      <div className='buttons'>
        <button className='ingredientsButton' onClick={() => setRenderedPage('ingredients')}>
          Enter Ingredients
        </button>
        <button className='recipesButton' onClick={() => setRenderedPage('saved')}>
          Saved Recipes
        </button>
      </div>
      {renderPage()}
    </div>
  );
};
export default MainContainer;
