import renderSearchResults from './utils/renderSearchResults';
import { NUMBER_OF_RESULTS, SEARCH_ENDPOINT, ACCESS_KEY, AFFILIATE } from './utils/constants';
import renderSearchPage from './utils/renderSearchPage';

// Set up the search parameters:
let urlParams = new URLSearchParams(window.location.search);
let searchEndpoint = new URL(SEARCH_ENDPOINT);
let searchParams = {
  affiliate: AFFILIATE,
  access_key: ACCESS_KEY,
  query: urlParams.get('query'),
  offset: urlParams.get('offset') || 0,
  limit: NUMBER_OF_RESULTS,
};

Object.keys(searchParams).forEach(function (key) {
  searchEndpoint.searchParams.append(key, searchParams[key]);
});
// Get the results, convert them to JSON, then render them:
// When the results are returned, check that the status is 200
// then render the results:
function reqLoaded() {
  if (this.status === 200) {
    let resJSON = JSON.parse(this.responseText);
    renderSearchPage(resJSON, urlParams, NUMBER_OF_RESULTS);
  } else {
    renderSearchResults(`${noResults()}`, false);
  }
}
// If timeout:
function reqTimeout() {
  renderSearchResults(`${noResults()}`, false);
}

let req = new XMLHttpRequest();
req.addEventListener('load', reqLoaded);
req.open('GET', searchEndpoint);
req.timeout = 5000; //timeout after 5 seconds
req.addEventListener('timeout', reqTimeout);
req.send();