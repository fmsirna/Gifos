
//Slider Elements
const btnleft = document.getElementById('btn-anterior')
const btnright = document.getElementById('btn-siguiente')

window.onload = function () {    
    loadTrending();        
};



// load slide trending
async function loadTrending() {      
    let data =  await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${APIkey}`)
    let gifsTrending = await data.json()    
    let container = document.getElementById('contenedor-cards');       
    for (let i = 0; i < 25; i++) {
        let divtrending = document.createElement('div');
        let imggif = document.createElement('img');
        divtrending.classList.add('card');        
        // to check if gif is already in storage and leave it the heart favorite button active
        isAfavoriteGif(gifsTrending.data[i].id)==1 ? heartFav = "images/icon-fav-hover.svg" : heartFav = "./images/icon-fav-active.svg";        
        divtrending.innerHTML = `<div id="${gifsTrending.data[i].id}" class="card-opciones">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src=${heartFav} id="img" alt="icono-favorito">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button" onclick= "downloadGif('${gifsTrending.data[i].images.original.url}','${gifsTrending.data[i].title}')">
                                            <img src="images/icon-download-hover.svg" alt="icono-descarga">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max-hover.svg" alt="icono-maximizar">
                                        </button>
                                    </div>
                                    <div class="trending-description">
                                        <p class="description userTrending">${gifsTrending.data[i].username}</p>
                                        <p class="description tituloTrending">${gifsTrending.data[i].title}</p>
                                    </div>
                                </div>`;
        //Button Events
        divtrending.querySelector('#btn-favorito').addEventListener('click', () => {
            //to set and unset heart favorite css
            let heartImg=  divtrending.querySelector('#img')            
            if (heartImg.getAttribute("src") == "./images/icon-fav-active.svg"){
             heartImg.src = "./images/icon-fav-hover.svg";              
            }
            else{heartImg.src = "./images/icon-fav-active.svg";}
            addFavorite(gifsTrending.data[i].id);
            if(ccontainer_fav){ // if is in favorites section, load it                
                loadFavorites()                
            }
        });       
        divtrending.querySelector('#btn-max').addEventListener('click', () => {
            maximizeGif(gifsTrending.data[i].id);
        });        
        divtrending.addEventListener('touchstart', () => {
            maximizeGif(gifsTrending.data[i].id);
        })
        //to maximize on click when width <750
        divtrending.addEventListener('click', () => {
            if (maxWidth.matches){
             maximizeGif(gifsTrending.data[i].id);
            }
        })   
        imggif.srcset = `${gifsTrending.data[i].images.downsized_large.url}`
        imggif.alt = `${gifsTrending.data[i].id}`;
        divtrending.appendChild(imggif);
        imggif.classList.add('card-img');
           
        container.appendChild(divtrending);        
    }
};



/*_____________________TRENDING ARROW SCROLL_____________________*/
btnleft.onclick = function () {
    document.getElementsByClassName('contenedor-trending')[0].scrollLeft -= 460;
};
btnright.onclick = function () {
    document.getElementsByClassName('contenedor-trending')[0].scrollLeft += 460;
};