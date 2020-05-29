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
}