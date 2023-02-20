import React, { useEffect, useState } from 'react';
import Ingredients from '../Components/Ingredients';
import FavoriteRecipe from '../Components/FavoriteRecipe';
import { Link } from 'react-router-dom';

const MainContainer = () => {
  //-------------------------STATE OF MAIN CONTAINER------------------------
  // create state for rendered page, initially show ingredients component -> for users to enter ingredients
  const [renderedPage, setRenderedPage] = useState('ingredients');
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const renderPage = () => {
    // if renderedPage is 'ingredients'
    // return <Ingredients /> componenet
    // if renderedPage is 'saved'
    // return <SavedRecipes /> component
    // else render null
    if (renderedPage === 'ingredients') {
      //Pass the setErrorMessage to reset error message when the searchbox in Ingredients component is used
      return <Ingredients setErrorMessage={setErrorMessage} />;
    } else if (renderedPage === 'saved') {
      //Pass array of favoriteRecipes to render
      return <FavoriteRecipe recipes={favoriteRecipes} />;
    } else {
      return null;
    }
  };

  //-----------------------HANDLE CLICK METHOD---------------------------------
  /**When click on Favorite Recipes button, fetch a get request for /favoriteRecipe
   * If logged in, res will have status 200, and a json of data for favorite recipe information
   * If not logged in, res status will not be ok => display error for login to view recipe
   */
  const handleRecipeClick = async () => {
    const res = await fetch('/favoriteRecipe');
    if (res.ok) {
      setFavoriteRecipes(await res.json());
      setRenderedPage('saved');
    } else {
      setErrorMessage('Please login to view your favorite recipes');
    }
  };
  /**When click logout, send a delete request to /logout
   * => redirect to homepage
   */
  const handleLogoutClick = () => {
    fetch('/logout', {
      method: 'DELETE'
    })
      .then((res) => {
        if (res.redirected) {
          return (window.location.href = res.url);
        }
      })
      .catch((err) => console.log(err));
  };

  //adding onClick methods on our buttons to {useState} hook to assign state as either ingredients or saved
  //we then call renderPage() -> depending on our state set by buttons
  //render either Ingredients or Saved Recipes Component
  return (
    <div>
      <div className='login-signup'>
        <button className='login'>
          <Link to='/login'>Log In</Link>
        </button>
        <button className='signup'>
          <Link to='/signup'>Sign Up</Link>
        </button>
        <button className='logout' onClick={handleLogoutClick}>
          Log Out
        </button>
      </div>
      <div className='buttons'>
        <button className='ingredientsButton' onClick={() => setRenderedPage('ingredients')}>
          Enter Ingredients
        </button>
        <button className='recipesButton' onClick={handleRecipeClick}>
          Favorite Recipes
        </button>
      </div>
      {errorMessage ? <p>{errorMessage}</p> : null}
      {renderPage()}
    </div>
  );
};
export default MainContainer;
