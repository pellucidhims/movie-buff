import axios from 'axios';

const BASE_URL = 'http://www.omdbapi.com';

const getMovieList = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/?s=bat&apikey=a9e4bebd`);

    const movieList = res.data.Search;

    console.log(`GET: Here's the list of movies`, movieList);

    return movieList;
  } catch (e) {
    console.error(e);
  }
};

const enlargeMovieImage = (movieImageDivId) => {
  return document.getElementById(movieImageDivId).style = 'position: relative; transform:scale(1.5); transition:all 300ms ease-in 0.1s; z-index:1; opacity:0.8';
}

const normalSizeMovieImage = (movieImageDivId) => {
  return document.getElementById(movieImageDivId).style = 'transform:scale(1); transition:all 300ms ease-out 0.1s ;z-index:-1; opacity:1';
}

const showAddButton = (addMovieBtnId) => {
  return document.getElementById(addMovieBtnId).style = 'opacity:1; background: rgba(0, 0, 0, .3); color: yellow; position: relative;top:-100px; text-align: center;'
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
  mItemAddInnerBtn.innerHTML = "Add To Collection";
  mItemAddInnerBtn.style = 'opacity:0;position: relative;top:-100px; text-align: center;';
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

const addMoviesToDOM = movies => {
  const ul = document.querySelector('ul');

  if (Array.isArray(movies) && movies.length > 0) {
    movies.map(movie => {
      ul.appendChild(createMovieBlock(movie));
    });
  } else if (Array.isArray(movies) && movies.length===0) {
    ul.appendChild(createMovieBlock({Title:'No Movies Available'}));
  } else {
    ul.appendChild(createMovieBlock({Title:'Seems an error has occoured...'}));
  }
};

export const getAllMovies = async () => {
  console.log("Executed after");
  addMoviesToDOM(await getMovieList());
};
