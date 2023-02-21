import React, { useState } from 'react';

const FavoriteRecipe = (props) => {
  console.log(props);
  return (
    <div className='renderedComponent'>
      <h2>Favorite Recipe</h2>
      <ul>
        {props.recipes.map((recipe) => {
          console.log(recipe.title);
          return (
            <li key={recipe.id}>
              <button type='button'>{'<3'}</button>
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
