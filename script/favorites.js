

loadFavorites();


/*_____________________LOAD FAVORITES GIFS FROM LOCAL STORAGE_____________________*/
async function loadFavorites() {
    favorite_list = getLocalStorageGifs()
    container_fav.innerHTML = "";
    if (favorite_list.length > 0) {      
        let data = await fetch(`https://api.giphy.com/v1/gifs?ids=${favorite_list.join(',')}&api_key=${APIkey}`);
        let gifsFav  = await data.json()
        if (gifsFav.data.length > 0) {
            for (let i = 0; i < gifsFav.data.length; i++) {
                let div = document.createElement('div');
                div.classList.add('card-fav')
                let img = document.createElement('img');
                div.innerHTML = `<div id="${gifsFav.data[i].id}" class="card-options-fav">
                                    <div class="options-gif">
                                        <button id="btn-removeFav" class="opcion-button">
                                            <img src="./images/icon-fav-active.svg" class="option-button-close" alt="icono-favorito">
                                        </button>
                                        <button id="btn-descargar" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-descarga">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max-hover.svg" alt="icono-maximizar">
                                        </button>
                                    </div>
                                    <div class="option-description">
                                        <p class="description user">${gifsFav.data[i].username}</p>
                                        <p class="description titulo">${gifsFav.data[i].title}</p>
                                    </div>
                                </div>`;
                div.querySelector('#btn-removeFav').addEventListener('click', () => {
                    removeFavorite(gifsFav.data[i].id)                   
                });
                div.querySelector('#btn-descargar').addEventListener('click', () => {
                    downloadGif(gifsFav.data[i].images.original.url);
                });
                div.querySelector('#btn-max').addEventListener('click', () => {
                    maximizeGif(gifsFav.data[i].id);
                });          
                //to maximize on click when width <750
                div.addEventListener('click', () => {
                    if (maxWidth.matches){
                        maximizeGif(gifsFav.data[i].id);
                    }
                })   
                img.srcset = `${gifsFav.data[i].images.downsized_large.url}`;
                img.alt = `${gifsFav.data[i].id}`;
                div.appendChild(img);
                container_fav.appendChild(div);
                container_fav.classList.remove('hidden');
                contenedor_emptyFav.classList.add('hidden');
            }
        }        
    } else {
        container_fav.classList.add('hidden');
        contenedor_emptyFav.classList.remove('hidden');
    }
}

function removeFavorite(idGifFavorito) {
    let favIndex = favorite_list.indexOf(idGifFavorito);     
    favorite_list.splice(favIndex, 1);    
    localStorage.setItem('favoriteGifs', JSON.stringify(favorite_list));
    loadFavorites();    
}