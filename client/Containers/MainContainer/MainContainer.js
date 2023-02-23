import React, { useEffect, useState } from 'react';
import Ingredients from '../../Components/Ingredients/Ingredients';
import FavoriteRecipe from '../../Components/FavoriteRecipe/FavoriteRecipe';
import { Link } from 'react-router-dom';

import styles from './MainContainer.module.css'

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
      return favoriteRecipes.length ? (
        <FavoriteRecipe favoriteRecipes={favoriteRecipes} setFavoriteRecipes={setFavoriteRecipes} />
      ) : (
        <p>You have not pinned any favorite recipe</p>
      );
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
    <div className={styles.wrapper}>
      <div>
        <button className={styles.button}>
          <Link to='/signup'>Sign Up</Link>
        </button>
        <button className={styles.button}>
          <Link to='/login'>Log In</Link>
        </button>
        <button className={styles.button} onClick={handleLogoutClick}>
          Log Out
        </button>
      </div>

      <div className={styles.buttonHolder}>
        <button className={styles.button} onClick={() => setRenderedPage('ingredients')}>
          DISCOVER RECIPES
        </button>
        <button className={styles.button} onClick={handleRecipeClick}>
          YOUR FAVORITES
        </button>
      </div>
      <div className={styles.errorContainer}>
        {errorMessage ? <p>{errorMessage}</p> : null}
        {renderPage()}
      </div>
    </div>
  );
};
export default MainContainer;
