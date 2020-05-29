import axios from 'axios';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        try {
            const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/get?&rId=${this.id}`);
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.author = res.data.recipe.publisher;
            this.title = res.data.recipe.title;
            this.url = res.data.recipe.source_url;
        } catch (error) {
            alert(`error ${error}`);
        }
    }

    calcTime() {
        //Assume that we need 15 min for 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIngredients = this.ingredients.map(el => {
            // Uniform ingredients
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // Remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // Parse ingredients into count, units and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
                const arrCount= arrIng.slice(0,unitIndex);

                let count;
                if(arrCount.length === 1){
                    //Just one digit
                    count = arrCount[0].replace('-','+');
                } else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                //There is NO unit, but 1st element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //There is NO index and NO number
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            }
            return ingredient;
        })
        this.ingredients = newIngredients;
    }
}