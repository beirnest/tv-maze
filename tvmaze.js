"use strict";

const $showsList = $("#shows-list");
const $episodesList = $("#episodes-list")
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const $getEpisodes = $(".Show-getEpisodes")
let $searchQuery = $("#search-query");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let response = await axios.get("http://api.tvmaze.com/search/shows?q=" + term);
  return response.data;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    let link = show.show.image.medium ? show.show.image.medium : "https://www.allianceplast.com/wp-content/uploads/no-image-1024x1024.png";
    const $show = $(
        `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${link}" 
              alt="${show.show.name}" 
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.show.name}</h5>
             <div><small>${show.show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  let episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  console.log(episodes);
  return episodes.data;
}

/** Given list of episodes, go thru list and add each episode to DOM*/

function populateEpisodes(episodes) { 
  $episodesList.empty();
    for (let episode of episodes) {
    let $episode = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);
    $episodesList.append($episode);  }
    $episodesArea.show();
}

/**Navigate to div that contains show information and get back show ID. Use show ID to get and populate episodes */
async function searchForEpisodesAndDisplay(evt) {
  const thisShow = $(evt.target).closest(".Show");
  const showID = $(thisShow).data("show-id");
  const episodes = await getEpisodesOfShow(showID);
  populateEpisodes(episodes);
}

/**Wait for click on button and get episodes */
$showsList.on("click", ".Show-getEpisodes", async function (evt) {
  evt.preventDefault();
  await searchForEpisodesAndDisplay(evt);
});


