import axios from 'axios';

const BASE_URL = 'http://www.omdbapi.com';

var retrievedMovieList = [];

const getMovieList = async (searchString) => {
  try {
    console.log("searchString: ",searchString);
    const res = await axios.get(`${BASE_URL}/?s=${searchString}&apikey=a9e4bebd`);

    const movieList = res.data.Search;
    retrievedMovieList = movieList;
    console.log(`GET: Here's the list of movies`, movieList);

    return movieList;
  } catch (e) {
    console.error(e);
  }
};

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
  return document.getElementById(addMovieBtnId).style = 'opacity:0.8; padding:1rem; background: purple; color: yellow;  position: relative; top:-100px; text-transform: uppercase; z-Index:1; font-weight:bold; transition:all 300ms ease-in; border: solid 2px yellow';
}

const hideAddButton = (addMovieBtnId) => {
  return document.getElementById(addMovieBtnId).style = 'opacity:0'
}

const createMovieBlock = movieItem => {
  const mItemDiv = document.createElement('div');
  const mItemImage = document.createElement('img');
  const mItemTitle = document.createElement('p');
  const mItemYear = document.createElement('p');
  const mItemAddBtnDiv = document.createElement('div');
  const mItemAddInnerBtn = document.createElement('button');

  mItemDiv.setAttribute('class','movieItemDivMainClass');
  mItemDiv.setAttribute('id',movieItem.Title+movieItem.Year.substr(0,4));
  mItemDiv.addEventListener('mouseover',function(){
                                          enlargeMovieImage(movieItem.Title+movieItem.Year.substr(0,4));
                                          showAddButton("Add"+movieItem.Title+movieItem.Year.substr(0,4))
                                        });
  mItemDiv.addEventListener('mouseleave', function(){
                                            normalSizeMovieImage(movieItem.Title+movieItem.Year.substr(0,4));
                                            hideAddButton("Add"+movieItem.Title+movieItem.Year.substr(0,4))
                                          });

  mItemAddInnerBtn.setAttribute('id', "Add"+movieItem.Title+movieItem.Year.substr(0,4));
  mItemAddInnerBtn.innerHTML = "Add To Favourites";
  mItemAddInnerBtn.style = 'opacity:0;';
  mItemAddBtnDiv.setAttribute('class','addButtonMainDiv');
  mItemAddBtnDiv.appendChild(mItemAddInnerBtn)

  mItemTitle.setAttribute('id','movieTitle');
  mItemTitle.appendChild(document.createTextNode(movieItem.Title));

  mItemYear.setAttribute('id','movieYear');
  mItemYear.appendChild(document.createTextNode("Year: "+movieItem.Year));

  mItemImage.setAttribute('src', movieItem.Poster);
  mItemImage.setAttribute('alt', movieItem.Title);
  mItemImage.setAttribute('height', '200px');
  mItemImage.setAttribute('width', '200px');
  mItemDiv.appendChild(mItemImage);
  mItemDiv.appendChild(mItemTitle);
  mItemDiv.appendChild(mItemYear);
  mItemDiv.appendChild(mItemAddBtnDiv);
  return mItemDiv;
};

const addMoviesToDOM = (movies,sortParam=false) => {
  const ul = document.querySelector('ul');

  if (Array.isArray(movies) && movies.length > 0) {
    if(sortParam){
      const ul2 = document.createElement('ul');
      movies.map(movie => {
        ul2.appendChild(createMovieBlock(movie))
      });
        ul.parentNode.replaceChild(ul2,ul)
    }else{
      movies.map(movie => {
        ul.appendChild(createMovieBlock(movie))
      });

    }

  } else if (Array.isArray(movies) && movies.length===0) {
    ul.appendChild(createMovieBlock({Title:'No Movies Available'}));
  } else {
    ul.appendChild(createMovieBlock({Title:'Seems an error has occoured...'}));
  }
};

export const changeSortDirection = (direction) => {
  console.log("got clicked:: ",direction);
  const srtDirectionBtn = document.getElementById('sortDirectionButton');
  srtDirectionBtn.innerHTML = direction.trim() ===`&darr;` ? `&uarr` : `&darr;`;
}

export const sortMovies = (sortId) =>{
  console.log("executing sort!",retrievedMovieList);
  if(retrievedMovieList && retrievedMovieList.length <= 0){
    let noSearchObject = {Title:"No Movies matching your taste",
            Year:"Nope",
            Poster: "https://cdn.dribbble.com/users/1554526/screenshots/3399669/no_results_found.png"
          };
    return noSearchObject;
  }else{
    let sortedList = sortId === 'Year'? retrievedMovieList.sort((a,b)=>{return parseInt(a.Year)-parseInt(b.Year)}) :
                                        retrievedMovieList.sort((a,b)=>{return a.Title.toLowerCase() < b.Title.toLowerCase()?-1:1});

    console.log("Sorted List:", sortedList);
    return addMoviesToDOM(sortedList,true);
  }
}

export const searchMovie = () =>{
  let movieTitle = document.getElementById('searchBar').value
  getAllMovies(movieTitle,true);
}

export const getAllMovies = async (tytl="bat",srch=false) => {
  console.log("Executed after srch: ",srch,tytl);
  if(!srch){
    addMoviesToDOM(await getMovieList(tytl),false);
  }else{
    addMoviesToDOM(await getMovieList(tytl),true);
  }
};
