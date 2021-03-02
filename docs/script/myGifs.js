loadMyGifs();


/*_____________________LOAD FAVORITES GIFS FROM LOCAL STORAGE_____________________*/
async function loadMyGifs() {
    myGifs_list = getMyGifs()
    containerMyGifs.innerHTML = "";
    if (myGifs_list.length > 0) {      
        let data = await fetch(`https://api.giphy.com/v1/gifs?ids=${myGifs_list.join(',')}&api_key=${APIkey}`);
        let gifs  = await data.json()
        if (gifs.data.length > 0) {
            for (let i = 0; i < gifs.data.length; i++) {
                let div = document.createElement('div');
                div.classList.add('myGif_card')
                let img = document.createElement('img');
                div.innerHTML = `<div id="${gifs.data[i].id}" class="myGif_card-options">
                                    <div class="options-gif">
                                        <button id="myGif_btn-remove" class="opcion-button">
                                            <img src="./images/icon-trash-hover.svg" class="option-button-close" alt="icono-favorito">
                                        </button>
                                        <button id="myGif_btn-download" class="opcion-button">
                                            <img src="images/icon-download.svg" alt="icono-descarga">
                                        </button>
                                        <button id="myGif_btn-max" class="opcion-button">
                                            <img src="images/icon-max-hover.svg" alt="icono-maximizar">
                                        </button>
                                    </div>
                                    <div class="option-description">
                                        <p class="description user">${gifs.data[i].username}</p>
                                        <p class="description titulo">${gifs.data[i].title}</p>
                                    </div>
                                </div>`;
                div.querySelector('#myGif_btn-remove').addEventListener('click', () => {
                    removeMyGif(gifs.data[i].id)                   
                });
                div.querySelector('#myGif_btn-download').addEventListener('click', () => {
                    downloadGif(gifs.data[i].images.original.url);
                });
                div.querySelector('#myGif_btn-max').addEventListener('click', () => {
                    maximizeGif(gifs.data[i].id);
                });          
                //to maximize on click when width <750
                div.addEventListener('click', () => {
                    if (maxWidth.matches){
                        maximizeGif(gifs.data[i].id);
                    }
                })   
                img.srcset = `${gifs.data[i].images.downsized_large.url}`;
                img.alt = `${gifs.data[i].id}`;
                div.appendChild(img);
                containerMyGifs.appendChild(div);
                containerMyGifs.classList.remove('hidden');
                containerEmptyMyGifs.classList.add('hidden');
            }
        }        
    } else {
        containerMyGifs.classList.add('hidden');
        containerEmptyMyGifs.classList.remove('hidden');
    }
}

function removeMyGif(idGif) {
    let myGifIndex = myGifs_list.indexOf(idGif);     
    myGifs_list.splice(myGifIndex, 1);    
    localStorage.setItem('myGifs', JSON.stringify(myGifs_list));
    loadMyGifs();    
}