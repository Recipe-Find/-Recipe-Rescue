import React, { useState } from 'react';

const FavoriteRecipe = ({ favoriteRecipes, setFavoriteRecipes }) => {
  //---------------------------HANDLE CLICK METHODS-----------------------------
  const handleDeleteClick = (e) => {
    //Obtain the favorite recipe card
    const faveRecipeCard = e.target.parentElement;
    //Obtain the recipe id which is the 4th child in faveRecipeCard
    const recipeID = faveRecipeCard.childNodes[3].innerHTML;

    //Fetch a DELETE request for the selected recipeID
    fetch(`/favoriteRecipe?id=${recipeID}`, {
      method: 'DELETE'
    })
      .then((res) => res.json())
      .then((updateFavoriteRecipes) => {
        //Update the list of favorite recipe. This will trigger rendering of all favorite recipes
        setFavoriteRecipes(updateFavoriteRecipes);
      })
      .catch((err) => console.log({ err }));
  };

  //--------------------------RENDER PAGE---------------------------------------
  return (
    <div className='renderedComponent'>
      <h2>Favorite Recipe</h2>
      <ul>
        {favoriteRecipes.map((recipe) => {
          console.log(recipe.title);
          return (
            <li key={recipe.id}>
              <button type='button' onClick={handleDeleteClick}>
                {'x'}
              </button>
              <a href={recipe.sourceURL}>{recipe.title}</a>
              <img src={recipe.image} alt={recipe.title} />
              {/* The _id is put hidden since this is keep for information only. _id can be used when update/delete is needed */}
              <p style={{ visibility: 'hidden' }}>{recipe._id}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FavoriteRecipe;
