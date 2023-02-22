const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Rescue:8nM1ONqD24BDfnCL@cluster0.9qs2qz7.mongodb.net/test';

mongoose.set('strictQuery', true)
mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'RecipeRescue'
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

// sets a schema for the 'favoriteRecipe' collection
const recipeSchema = new Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  sourceURL: { type: String, required: true }
});

// creats a model for the 'recipe' collection that will be part of the export
const Recipe = mongoose.model('recipe', recipeSchema);

// exports all the models in an object to be used in the controller
module.exports = { Recipe };
