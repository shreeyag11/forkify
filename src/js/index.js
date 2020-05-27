// Global app controller
import axios from 'axios';

async function getResult(query) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    try {
        const res = await axios(`${proxy}https://forkify-api.herokuapp.com/api/search?&q=${query}`);
        console.log(res.data.recipes);
    } catch (error) {
        alert(error);
    }
}
getResult('pizza');