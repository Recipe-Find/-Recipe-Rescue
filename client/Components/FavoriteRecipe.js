import React, { useState } from 'react';

const FavoriteRecipe = ({ favoriteRecipes, setFavoriteRecipes }) => {
  //---------------------------HANDLE CLICK METHODS-----------------------------
  const handleDeleteClick = (recipeID) => {
    //Obtain the favorite recipe card
    // const faveRecipeCard = e.target.parentElement;
    //Obtain the recipe id which is the 4th child in faveRecipeCard
    // const recipeID = faveRecipeCard.childNodes[3].innerHTML;

    // console.log(recipeID);

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
    <div className='faveContainer'>
      <h3 className='savedTitle'>SAVED RECIPES</h3><br/>
      <ul className='faverecipesList'>
        {favoriteRecipes.map((recipe) => {
          console.log(recipe.title);
          return (
            <li key={recipe.id}>
              <button className='x' type='button' onClick={() => handleDeleteClick(recipe._id)}>
              ⨉
              </button>
              <a href={recipe.sourceURL}>{recipe.title}</a><br/>
              <img style={{borderRadius: 10, margin: 5}} src={recipe.image} alt={recipe.title} /><br/>
              {/* The _id is put hidden since this is keep for information only. _id can be used when update/delete is needed */}
              <p style={{ visibility: 'hidden' }}>{recipe._id}</p>
              <h4>-------------------------------------------------------</h4>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
``
export default FavoriteRecipe;
