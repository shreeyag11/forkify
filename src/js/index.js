// Global app controller
import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';

/**-Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */
const state = {};
window.state = state;
/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // Get query from view
    // const query = searchView.getInput();
    const query = 'pizza';
    //New search object and add to state
    if (query) {
        state.search = new Search(query);
        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try{
            //Search for recipe
            await state.search.getResult();
            //Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err){
            alert( `Something went wrong with the search..`);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('click', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const gotToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, gotToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    //Get ID from URL
    const id = window.location.hash.replace('#', '');
    if (id) {
        //Prepare UI for display
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight recipe
        searchView.highlightSelected(id);

        //Create new recipe object
        state.recipe = new Recipe(id);
        try {
            //Get recipe data
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (e) {
            alert(`Error Processing Recipe`+e);
        }
    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/** 
 * LIST CONTROLLER
*/
const controlList = () => {
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update item list
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
 
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } 
    if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateItem(id,val);
    }
});

elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button is clicked
        if(state.recipe.servings >1){
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
});

window.l = new List();

