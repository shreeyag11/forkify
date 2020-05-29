// Global app controller
import Search from './models/Search';
import { elements, renderLoader,clearLoader } from './views/base';
import * as searchView from './views/searchView';

/**-Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipe
 */
const state = {};

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();
    //New search object and add to state
    if(query) {
        state.search = new Search(query);
        //Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        //Search for recipe
        await state.search.getResult();
        //Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('click', e => {
    e.preventDefault();
    controlSearch();
});