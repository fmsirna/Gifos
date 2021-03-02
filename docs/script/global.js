const APIkey = "4XJBKHwCh7IhhV3ZHOa3c8VaaOarlzMX";
var tema = 'light';

//Search Elements (input)
let input_search = document.getElementById('in-busqueda');
let lista_autocomplete = document.getElementById('lista-autocomplete');
let lupa_busqueda = document.getElementById('lupa-busqueda');
let close_search = document.getElementById('cerrar-busqueda');
let maxWidth = window.matchMedia("(max-width: 750px)")
let offset= 0;
//slider trending Elements
let lista_trending = document.getElementById('lista-trending');
let btn_vermas = document.getElementById('btn-vermas');
let heartFav;
let titulo = document.getElementById('titulo-resultados');
let resultados = document.getElementById('resultados-gifs');
//favorite 
let container_fav = document.getElementById('favorites-gifs');
let contenedor_emptyFav = document.getElementById('non-favorites');
let myGifs_list,favorite_list;
//my gifs
let containerMyGifs = document.getElementById('myGifs_gifs');
let containerEmptyMyGifs = document.getElementById('myGifs_empty');


modeChange()


/*________________GET DATA FROM LOCAL STORAGE_____________________*/
function getLocalStorageGifs() {
    favorite_list = JSON.parse(localStorage.getItem('favoriteGifs'));  
    if(!favorite_list)
    {favorite_list=[]}
    return  favorite_list
}
function getMyGifs() {
    myGifs_list = JSON.parse(localStorage.getItem('myGifs'));  
    if(!myGifs_list)
    {myGifs_list=[]}
    return  myGifs_list
}

/*________________  BURGUER MENU _______________________ */

let btnmenu = document.getElementById('menu-burguer');
btnmenu.addEventListener("click", function () {
document.getElementById('ul-menu').classList.toggle("menudesplegado");    
})


/*_____________________DARK MODE_____________________*/


document.getElementById('liModoMocturno').addEventListener("click", function () {
    tema = localStorage.getItem('mode');    
    tema = tema === 'dark' ? 'light' : 'dark'; 
    localStorage.setItem('mode',tema)   
    modeChange()    
})

function modeChange() {
    tema = localStorage.getItem('mode');
    if (!tema){localStorage.setItem('mode', 'light');}
    if (tema === 'dark'){
        document.documentElement.setAttribute('data-theme', 'dark')
        if (lupa_busqueda){
           lupa_busqueda.src ='images/icon-search-modo-noct.svg'  
        }                 
   }
   else{
       document.documentElement.setAttribute('data-theme', 'none')
       if (lupa_busqueda){
       document.getElementById('lupa-busqueda').setAttribute('src', 'images/icon-search.svg') 
       }           
   } 
   document.getElementById('sp-tema').innerHTML = tema == 'dark' ? 'Diurno' : 'Nocturno';
}


// to check if gif is already in storage and leave it the heart favorite button active
function isAfavoriteGif(favoriteId) {      
    favorite_list = getLocalStorageGifs()
    let checkDuplciated = favorite_list.find(id => id == favoriteId)
    if(!checkDuplciated)
    {      
    return 1 // to use it as a return value to know if its already there
    }
}


/*_____________________  GIFS BUTTON FUNCTIONS   ____________________*/


async function downloadGif(urlGif,title) {    
  let a = document.createElement('a');
  // get image as blob
  let response = await fetch(urlGif);
  let file = await response.blob();
  // use download attribute 
  a.download = title;
  a.href = window.URL.createObjectURL(file);
  //store download url in javascript   
  //click on element to start download
  a.click();    
}

// add to favorite button 
function addFavorite(favoriteId) {    
    favorite_list = getLocalStorageGifs()
    let checkDuplciated = favorite_list.find(id => id == favoriteId)
    if(!checkDuplciated) // if it is not in local storage, add it
    {
    favorite_list.push(favoriteId);
    localStorage.setItem('favoriteGifs', JSON.stringify(favorite_list));   
    }
    else{
    //else, remove it from local storage, the heart is removed before.
        let favIndex = favorite_list.indexOf(favoriteId);     
        favorite_list.splice(favIndex, 1);    
        localStorage.setItem('favoriteGifs', JSON.stringify(favorite_list));
        }
}

/*_____________________ maximize button _____________________*/
async function maximizeGif(idGif) {
    if (!!idGif) {        
        let data = await fetch(`https://api.giphy.com/v1/gifs/${idGif}?api_key=${APIkey}`);
        let gif = await data.json();
        let contenedor_maximizado = document.getElementById('gif-max');
        contenedor_maximizado.style.display = 'flex';
         // to check if gif is already in storage and leave it the heart favorite button active
         isAfavoriteGif(gif.data.id)==1 ? heartFav = "images/icon-fav-hover.svg" : heartFav = "./images/icon-fav-active.svg";
                      
        contenedor_maximizado.innerHTML =
            `<button id="btnmax-close" class="close-button">
                    <img src="images/close.svg" alt="icono-busqueda">
             </button>
             <img srcset="${gif.data.images.downsized_large.url}"
                    alt="${gif.data.id}" id="img-maximizado" class="img-maximizado">
             <article>
                   <div>
                       <p>${gif.data.username}</p>
                       <p class="titulo">${gif.data.title}</p>
                   </div>
                   <div class="maximizado-buttons">
                       <button id="btnmax-favorito"  class="max-button">
                           <img src=${heartFav} id="img" alt="icono-busqueda">
                       </button>
                       <button id="btnmax-download"  class="max-button"">
                           <img src="images/icon-download.svg" alt="icono-busqueda">
                       </button>
                   </div>
             </article>`;
        
        contenedor_maximizado.querySelector('#btnmax-favorito').addEventListener('click', (e) => {                       
            let heartImg=  contenedor_maximizado.querySelector('#img')            
            if (heartImg.getAttribute("src") == "./images/icon-fav-active.svg"){
             heartImg.src = "./images/icon-fav-hover.svg";              
            }
            else{heartImg.src = "./images/icon-fav-active.svg";}
            addFavorite(gif.data.id);
            if(container_fav){ // if is in favorites section, load it                
                loadFavorites()                
            }      
        });
        contenedor_maximizado.querySelector('#btnmax-download').addEventListener('click', () => {
            downloadGif(gif.data.images.original.url);
        });
        contenedor_maximizado.querySelector('#btnmax-close').addEventListener('click', () => {
            contenedor_maximizado.style.display = 'none';
        });
    }
};


/*_____________________ maximize button (MY GIFS) (changed delete button)_____________________*/
async function maximizeGifMyGifs(idGif) {
    if (!!idGif) {        
        let data = await fetch(`https://api.giphy.com/v1/gifs/${idGif}?api_key=${APIkey}`);
        let gif = await data.json();
        let contenedor_maximizado = document.getElementById('gif-max');
        contenedor_maximizado.style.display = 'flex';        
                      
        contenedor_maximizado.innerHTML =
            `<button id="btnmax-close" class="close-button">
                    <img src="images/close.svg" alt="icono-busqueda">
             </button>
             <img srcset="${gif.data.images.downsized_large.url}"
                    alt="${gif.data.id}" id="img-maximizado" class="img-maximizado">
             <article>
                   <div>
                       <p>${gif.data.username}</p>
                       <p class="titulo">${gif.data.title}</p>
                   </div>
                   <div class="maximizado-buttons">
                       <button id="btnmax-remove"  class="max-button">
                           <img src="./images/icon-trash-hover.svg" id="img" alt="icono-busqueda">
                       </button>
                       <button id="btnmax-download"  class="max-button"">
                           <img src="images/icon-download.svg" alt="icono-busqueda">
                       </button>
                   </div>
             </article>`;
        
        contenedor_maximizado.querySelector('#btnmax-remove').addEventListener('click', (e) => {           
            removeMyGif(gif.data.id);     
            loadMyGifs()
            contenedor_maximizado.style.display = 'none';       
        });
        contenedor_maximizado.querySelector('#btnmax-download').addEventListener('click', () => {
            downloadGif(gif.data.images.original.url);
        });
        contenedor_maximizado.querySelector('#btnmax-close').addEventListener('click', () => {
            contenedor_maximizado.style.display = 'none';
        });
    }
};
