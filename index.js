const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// enabling CORS for any unknown origin
app.use(cors());
app.use(express.json())

const recipesFilePath = path.join(__dirname, "recipes.json")

app.get("/", (req, res) => {
    res.send("Hello world, home page here!")
});

app.get('/recipes', (req, res) => {
    // Read the JSON file
    fs.readFile(recipesFilePath, 'utf8', (err, data) => {
        // We read the file located at the filepath, encoding is utf8, and, just like req/res, we have an err/data variable
        // If we have something in the err variable, we could handle that with an if statement, for now, let's keep it simple
        // Data will hold the data read in from the file
        // Parse the JSON data from the file, turning it into JSON data.
        const recipes = JSON.parse(data);
        // Send the recipes as JSON response
        res.json(recipes);
    });
});

app.get("/cuisine-data", (req, res) => {
    fs.readFile(recipesFilePath, 'utf8', (err, data) => {
        const recipes = JSON.parse(data);
        const occurances = recipes.reduce((accumulator, recipe) => {
            const currentCuisine = recipe.cuisine;
            if(accumulator[currentCuisine]){
                accumulator[currentCuisine] += 1;
            } else {
                accumulator[currentCuisine] = 1;
            }
            return accumulator;
        }, {})
        // console.log(occurances)
        res.json(occurances);
    })
})

app.post("/recipes", (req, res) => {
    const newRecipe = req.body;
    fs.readFile(recipesFilePath, 'utf8', (err, data) => {
        const recipes = JSON.parse(data); // Parse the existing JSON array
        recipes.push(newRecipe); // Add the new object to the array
        console.log(recipes)
        // Write the updated array back to the file
        fs.writeFile(recipesFilePath, JSON.stringify(recipes), () => {});
    });
    res.send("Recipe added, storing your favourite dishes")
});

app.listen(port, () => {
    console.log("Server is running on http://localhost:", port)
});
