import React from 'react';

import styles from './RecipeList.module.css'

// recipes -> [ { id, title, image, missedIngredients, usedIngredients, sourceURL } ];
const RecipesList = (props) => {
  // function to favorite a recipe
  const saveRecipe = (recipe) => {
    fetch('/favoriteRecipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/JSON'
      },
      body: JSON.stringify({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        sourceURL: recipe.sourceURL
      })
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  if (!props.recipes) return null;

  else if (props.recipes && props.dropDownVal === 'None'){
      return (
        <div className={styles.wrapper}>
          <ul className={styles.recipeList}>
          {console.log('recipeinformation:', props.recipes.recipeInformation)}
            {props.recipes.recipes.map((recipe) => (
              <li key={recipe.id} className={styles.recipe}>
                <button className={styles.heartButton} type='button' onClick={() => saveRecipe(recipe)}>
                ♡
                </button>
                <a className={styles.recipeLink} href={recipe.sourceURL}>{recipe.title}</a><br/>
                <img className={styles.image} src={recipe.image} alt={recipe.title} /><br/>
                <div>MISSING INGREDIENTS: {recipe.missedIngredients.join(', ')}</div><br/>
                <h4>-------------------------------------------------------</h4>
              </li>
            ))}
          </ul>
        </div>
      );
    }

  else if (props.recipes && props.dropDownVal){
    let filteredRecipes = [];

    for (let i = 0; i < props.recipes.recipeInformation.length; i++) {
      if (props.recipes.recipeInformation[i].diets.includes(props.dropDownVal)) filteredRecipes.push(i)
    }
    
    const results = []

    for (let i = 0; i < props.recipes.recipes.length; i++) {
      let recipe = props.recipes.recipes[i];
      if (filteredRecipes.includes(i)) results.push(
        <li key={recipe.id}>
            <button className='heartbutton' type='button' onClick={() => saveRecipe(recipe)}>
              ♡
            </button>
            <a className='recipeLink' href={recipe.sourceURL}>{recipe.title}</a><br/>
            <img style={{borderRadius: 10, margin: 5, maxHeight: 75}} src={recipe.image} alt={recipe.title} /><br/>
            {/* <div>MISSING INGREDIENTS: {recipe.missedIngredients.join(', ')}</div><br/>                   */}
            
        </li>
      )
    }


    console.log('filtered', filteredRecipes)
    console.log('results', results)

    return (
      <div className='mainContainer'>
        <ul className='recipesList'>
          {results}
          {console.log(results)}
          {console.log(filteredRecipes)}
        </ul>
      </div>
    )
  }
  //   
};
  


// }

export default RecipesList;