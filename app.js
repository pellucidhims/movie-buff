import axios from 'axios';
//const decrypt = require(__dirname+'/decryptKey');

const ALGO = process.env.ALGORITHM || '';
const KEY = process.env.SEC_KEY || '';

const BASE_URL = 'https://www.omdbapi.com';

//decrypt(process.env.API_KEY, ALGO, KEY)
const API_KEY = process.env.API_KEY;

var retrievedMovieList = [];

var myMovieBucket = [];

var randomMoviesList = [
  'Friends',
  'Bat',
  'Mission Impossible',
  'Kung fu',
  'Lagaan',
  'random'
]

//This function initiates axios call to fetch results from OMDB database and update list accordingly
const getMovieList = async (searchString) => {
  try {
    const res = await axios.get(`${BASE_URL}/?s=${searchString}&apikey=${API_KEY}`);
    let noResultsFound = [{Title:"No Movies matching your taste",
            Year:"NAN",
            Poster: "https://cdn.dribbble.com/users/1554526/screenshots/3399669/no_results_found.png"
          }]
    const movieList = res.data.Search || noResultsFound;
    retrievedMovieList = retrievedMovieList.concat(movieList.filter((movieItm,idx)=>{ return !contains(retrievedMovieList,movieItm)}));

    return movieList;
  } catch (e) {
    console.log("Some Network error occoured: ",e);
  }
};

//This function checks if a movies is part of the given movieList
const contains = (inputArr,obj) => {
    for(let item of inputArr){
      if(item.imdbID === obj.imdbID){
      return true
      }
    }
    return false;
}

export const animateElement = (id) => {
  return document.getElementById(id).style = 'transform: scale(1.2); transition:all 300ms ease-in ';
}

export const restoreElement = (id) => {
  return document.getElementById(id).style = 'transform: scale(1); transition:all 300ms ease-out';
}

const enlargeMovieImage = (movieImageDivId) => {
  return document.getElementById(movieImageDivId).style = 'position: relative; transform:scale(1.2); transition:all 300ms ease-in 0.1s; z-index:1; opacity:0.8';
}

const normalSizeMovieImage = (movieImageDivId) => {
  return document.getElementById(movieImageDivId).style = 'transform:scale(1); transition:all 300ms ease-out 0.1s ;z-index:-1; opacity:1';
}

const showAddButton = (addMovieBtnId) => {
  return document.getElementById(addMovieBtnId).style = 'opacity:0.8; padding:1rem; background: purple; color: white;  position: relative; top:-100px; text-transform: uppercase; z-Index:1; font-weight:bold; transition:all 300ms ease-in; border: dotted 2px white';
}

const hideAddButton = (addMovieBtnId) => {
  return document.getElementById(addMovieBtnId).style = 'opacity:0'
}

//This function creates thumbnail for movies with movie - Poster, Name and Year to be added to list
const createMovieBlock = (movieItem,idx,myBucketRqst=false) => {
  const mItemDiv = document.createElement('div');
  const mItemImage = document.createElement('img');
  const mItemTitle = document.createElement('p');
  const mItemYear = document.createElement('p');
  const mItemAddBtnDiv = document.createElement('div');
  const mItemAddInnerBtn = document.createElement('button');

  mItemDiv.setAttribute('class','movieItemDivMainClass');
  mItemDiv.setAttribute('id',movieItem.Title+movieItem.Year.substr(0,4)+idx);
  mItemDiv.addEventListener('mouseover',function(){
                                          enlargeMovieImage(movieItem.Title+movieItem.Year.substr(0,4)+idx);
                                          movieItem.Year !== "NAN"?showAddButton((myBucketRqst?"Remove":"Add")+movieItem.imdbID):''
                                        });
  mItemDiv.addEventListener('mouseleave', function(){
                                            normalSizeMovieImage(movieItem.Title+movieItem.Year.substr(0,4)+idx);
                                            movieItem.Year !== "NAN"?hideAddButton((myBucketRqst?"Remove":"Add")+movieItem.imdbID):''
                                          });

  mItemAddInnerBtn.setAttribute('id', (myBucketRqst?"Remove":"Add")+movieItem.imdbID);
  mItemAddInnerBtn.addEventListener("click", function(){
                                                if(myBucketRqst){
                                                  removeFromMyBucket(movieItem);
                                                }else{
                                                  addMovieToMyBucket(movieItem);
                                                }
                                                }
                                    )
  mItemAddInnerBtn.innerHTML = myBucketRqst?"Remove":"Add To Favourites";
  mItemAddInnerBtn.style = 'opacity:0;';
  mItemAddBtnDiv.setAttribute('class','addButtonMainDiv');
  mItemAddBtnDiv.appendChild(mItemAddInnerBtn)

  mItemTitle.setAttribute('id','movieTitle');
  mItemTitle.appendChild(document.createTextNode(movieItem.Title));

  mItemYear.setAttribute('id','movieYear');
  mItemYear.appendChild(document.createTextNode("Year: "+movieItem.Year));
  if(movieItem.Poster === "N/A"){
    mItemImage.setAttribute('src', "http://www.lyricsio.com/assets/img/no-movie.jpg");
  }else{
    mItemImage.setAttribute('src', movieItem.Poster);
  }

  mItemImage.setAttribute('alt', movieItem.Title);
  mItemImage.setAttribute('height', '200px');
  mItemImage.setAttribute('width', '200px');
  mItemDiv.appendChild(mItemImage);
  mItemDiv.appendChild(mItemTitle);
  mItemDiv.appendChild(mItemYear);
  movieItem.Year !== "NAN"?mItemDiv.appendChild(mItemAddBtnDiv):'';
  return mItemDiv;
};

//This function adds the movie item to user's bucket
const addMovieToMyBucket = (movieItem) => {
    if(!contains(myMovieBucket,movieItem)){
      myMovieBucket = myMovieBucket.concat(movieItem)
      addMoviesToDOM(myMovieBucket,true,true)
      let addBtn = document.getElementById('Add'+movieItem.imdbID);
      addBtn.innerHTML = 'ADDED TO FAVOURITES';
      addBtn.style.backgroundColor = 'green';
    }else{
      let addBtn = document.getElementById('Add'+movieItem.imdbID);
      addBtn.innerHTML = 'AVAILABLE IN FAVOURITES';
      addBtn.style.backgroundColor = 'orange';
    }
}

//This function removes the movie item from user's bucket
const removeFromMyBucket = (movieItem) => {
    myMovieBucket = myMovieBucket.filter((item)=>{
                                        return (item.imdbID !== movieItem.imdbID)
                                  })
    myMovieBucket && myMovieBucket.length > 0 ? addMoviesToDOM(myMovieBucket,true,true) : createEmptyDomList('myMoviesList');
    //at the same time replace movie element text in allMoviesList
    let addBtn = document.getElementById('Add'+movieItem.imdbID);
    addBtn.innerHTML = 'ADD TO FAVOURITES';
    addBtn.style.backgroundColor = 'purple';
  }

//This function is to clear the last movie item from myMovieList DOM
const createEmptyDomList = (domListName) =>{
  const emptyUl = document.getElementById(domListName);
  while (emptyUl.firstChild) {
    emptyUl.removeChild(emptyUl.firstChild);
}
}


//This function is triggered to accordingly display the tabs based on user input
export const showTab = (currPage,element) =>{
  let tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("movieListMainDiv");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("myMovieButtonStyle");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(currPage).style.display = "inline-block";
  element.style.backgroundColor = 'grey';
}

//This function makes the changes in DOM tree by attaching Movie thumbnails [created using createMovieBlock()] to ul element.
const addMoviesToDOM = (movies,sortParam=false,myMovies=false) => {
  if(myMovies){
    var ul = document.getElementById('myMoviesList');
  }else{
    var ul = document.getElementById('searchRandomList');
  }
  if (Array.isArray(movies) && movies.length > 0) {
    if(sortParam){
      const ul2 = document.createElement('ul');
      if(myMovies){
        movies.map((movie,index) => {
          ul2.appendChild(createMovieBlock(movie,index,true))
        });
      }else{
        movies.map((movie,index) => {
          ul2.appendChild(createMovieBlock(movie,index))
        });
      }
        if(myMovies){
          ul2.setAttribute('id','myMoviesList')
        }else{
          ul2.setAttribute('id','searchRandomList')
        }
        ul.parentNode.replaceChild(ul2,ul);
    }else{
      movies.map((movie,index) => {
        if(movie.Year!=="NAN"){
          ul.appendChild(createMovieBlock(movie,index))
        }
      });

    }

  } else if (Array.isArray(movies) && movies.length===0) {
    ul.appendChild(createMovieBlock({Title:'No Movies Available'}));
  } else {
    ul.appendChild(createMovieBlock({Title:'Seems an error has occoured...'}));
  }
};

//This function is triggered when sorting order is to be changed and then accordingly calls fsortMovies() to sort movies
export const changeSortDirection = (direction) => {
  const srtDirectionBtn = document.getElementById('sortDirectionButton');
  if(srtDirectionBtn.value === "0"){
    document.getElementById('sortDirectionArrow').innerHTML = "&darr;";
    document.getElementById('sortDirectionButton').title = "Sort Ascending";
    srtDirectionBtn.value = "1";
    if(retrievedMovieList && retrievedMovieList.length > 0){
      if(document.getElementById('sortButton').value){
        sortMovies(document.getElementById('sortButton').value,srtDirectionBtn.value);
      }
    }
  }else{
    document.getElementById('sortDirectionArrow').innerHTML = "&uarr;";
    document.getElementById('sortDirectionButton').title = "Sort Descending";
    srtDirectionBtn.value = "0";
    if(retrievedMovieList && retrievedMovieList.length > 0){
      if(document.getElementById('sortButton').value){
        sortMovies(document.getElementById('sortButton').value,srtDirectionBtn.value);
      }
    }
  }
}

//Sort the movies based on sort type and sort order(Ascending or Descending)
export const sortMovies = (sortId,sortOrder) =>{
  showTab('searchRandomMovies',document.getElementById('searchArenaButton'))
  if(retrievedMovieList && retrievedMovieList.length <= 0){
    let noSearchObject = [{Title:"No Movies matching your taste",
            Year:"NAN",
            Poster: "https://cdn.dribbble.com/users/1554526/screenshots/3399669/no_results_found.png"
          }]
    return addMoviesToDOM(noSearchObject,true);
  }else{
    let sortedList = sortId === 'Year'? ( sortOrder === "0"?
                                              retrievedMovieList.sort((a,b)=>{return parseInt(a.Year)-parseInt(b.Year)})
                                              :
                                              retrievedMovieList.sort((b,a)=>{return parseInt(a.Year)-parseInt(b.Year)})

                                        ) :
                                        ( sortOrder === "0"?
                                              retrievedMovieList.sort((a,b)=>{return a.Title.toLowerCase() < b.Title.toLowerCase()?-1:1})
                                              :
                                              retrievedMovieList.sort((b,a)=>{return a.Title.toLowerCase() < b.Title.toLowerCase()?-1:1})
                                         );

    return addMoviesToDOM(sortedList,true);
  }
}


//This function is triggered when user searches for a particular movie in search box
export const searchMovie = () =>{
  showTab('searchRandomMovies',document.getElementById('searchArenaButton'));
  document.getElementById('sortButton').value = "";
  let movieTitle = document.getElementById('searchBar').value;
  if(movieTitle.trim()!==""){
      getAllMovies(movieTitle,true);
  }else{
    let noSearchObject = [{Title:"Empty search has this. Enter Movie Name",
            Year:"NAN",
            Poster: "https://cdn.dribbble.com/users/1554526/screenshots/3399669/no_results_found.png"
          }]
    return addMoviesToDOM(noSearchObject,true);
  }

}

//This function gets the list of movies from  getMovieList() and then calls another function addMoviesToDOM() to append elements to DOM
export const getAllMovies = async (tytl="",srch=false) => {
  showTab('searchRandomMovies',document.getElementById('searchArenaButton'))
  if(!srch){
    let randomIdx = Math.floor(Math.random() * (randomMoviesList.length-1 - 0 + 1));
    let tytl = randomMoviesList[randomIdx];
    addMoviesToDOM(await getMovieList(tytl),false);
  }else{
    addMoviesToDOM(await getMovieList(tytl),true);
  }
};

//Execute this function right after the window loads
export const onLoadFunction = () =>{
  //Attach eventlistener for detecting 'enter key' press in search bar
  let inp = document.getElementById('searchBar');
  inp.addEventListener('keyup',(e)=>{
    if(e.keyCode === 13){
      e.preventDefault();
      if(document.getElementById('searchBar').value.trim() !== ""){
        document.getElementById('searchButton').click();
      }
    }
  })

  getAllMovies('Harry Potter',true);
  showTab('searchRandomMovies',document.getElementById('searchArenaButton'))
}
