// Global app controller
import Search from './models/Search';
import { elements, renderLoader, clearLoader } from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';

/**-Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */
const state = {};

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
            console.log(state.recipe);
        } catch (e) {
            alert(`Error Processing Recipe`);
        }
    }

}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
