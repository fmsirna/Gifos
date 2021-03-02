
loadTrendingTopics();  
/*_____________________LOAD TRENDING SLIDE_____________________*/

//Load 5 trending topics to select
async function loadTrendingTopics() {    
    let data = await fetch(`https://api.giphy.com/v1/trending/searches?api_key=${APIkey}&limit=5&rating=g`);
    let trendingSug = await data.json()
    if (trendingSug.data.length > 0) {
        let items_lista = "";
        for (let i = 0; i < 5; i++) {
            let items = `<li>${trendingSug.data[i]}</li>`;
            items_lista = items_lista + items;
        }
        lista_trending.innerHTML = items_lista;       
    }
}
  

/*_____________________Autocomplete of the Search imput (DROPDOWN)____________________*/

input_search.addEventListener('input', () => autoComplete());

async function autoComplete() {
    param_busqueda = input_search.value;
    if (param_busqueda) {        
        let data = await fetch(`https://api.giphy.com/v1/tags/related/${param_busqueda}?api_key=${APIkey}&limit=4&rating=g`);
        let array = await data.json()
        if (array.data.length > 0) {            
            lista_autocomplete.innerHTML = "";
            for (let i = 0; i < array.data.length; i++) {
                let li = document.createElement('li');
                li.innerHTML = ` <img src="images/icon-search-modo-noct.svg" alt="icon-search"/><p>${array.data[i].name}</p>`;
                // seleccionar busqueda de lista autocomplete
                li.addEventListener('click', (e) => {
                    restoreValues() 
                    ActiveSearch()
                    param_busqueda = e.target.textContent;    
                    searchLoad(param_busqueda, offset);
                    input_search.value=`${param_busqueda}`
                })
                lista_autocomplete.appendChild(li);
            }           
            lista_autocomplete.classList.remove('hidden');
            lista_autocomplete.classList.add('lista-busqueda');
            
       
        } else {}
    } else {  //Hide drop down list
        lista_autocomplete.classList.add('hidden');
        lista_autocomplete.classList.remove('lista-busqueda');
    }    
}


/*_____________________ SEARCH FUNCTIONALITIES ____________________*/


//Click on magnifying glass to search
lupa_busqueda.addEventListener('click', () => {
    ActiveSearch()
    restoreValues() 
    param_busqueda = input_search.value
    searchLoad(param_busqueda,offset); 
    location.href= '#home_search'    
});

//Press Enter key to Search
input_search.addEventListener('keyup', (e) => {
    if (e.key === "Enter") {
        ActiveSearch()
        restoreValues() 
        param_busqueda = input_search.value
        searchLoad(param_busqueda,offset);   
        location.href= '#home_search'            
    }
});
// to search by trending topic
lista_trending.addEventListener('click', (e) => {
    restoreValues() 
    ActiveSearch()
    param_busqueda = e.target.textContent;    
    searchLoad(param_busqueda, offset);
    input_search.value=`${param_busqueda}`
    location.href= '#home_search' 
})
//click on SEE MORE
btn_vermas.addEventListener('click', () => { 
    offset = offset +13;    
    searchLoad(param_busqueda, offset);
});

function restoreValues() {
    offset =0;
    resultados.innerHTML = "";    
    resultados.classList.add('resultados-gifs'); 
    titulo.classList.add('hidden'); 
    lista_autocomplete.classList.add('hidden');
    lista_autocomplete.classList.remove('lista-busqueda');
}


// to remove magnifying glass and add close button (cross)
function ActiveSearch() {            
    lupa_busqueda.classList.add( 'hidden');
    close_search.classList.remove('hidden');
    input_search.classList.add( 'active-search');    
}

// to clean with close button (cross)
close_search.addEventListener('click', () =>clean());
function clean() {    
    lupa_busqueda.classList.remove( 'hidden');
    close_search.classList.add('hidden');  
    btn_vermas.classList.add('hidden'); 
    input_search.classList.remove( 'active-search');  
    restoreValues()
    input_search.value=""
}

//to put the magnying glass when clicked to write (focus)
input_search.addEventListener('focus', () => focus());
function focus(){
    lupa_busqueda.classList.remove( 'hidden');
    close_search.classList.add('hidden'); 
}

/*_____________________LOAD SEARCH ARRAY____________________*/
async function searchLoad(parametro,offset) {       
    let data = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${APIkey}&limit=12&q=${parametro}&offset=${offset}`);
    let array = await data.json();
    if (array.data.length > 0) {
        for (let i = 0; i <  array.data.length; i++) {
            let div = document.createElement('div');
            let img = document.createElement('img');
            div.classList.add('card-search');  
             // to check if gif is already in storage and leave it the heart favorite button active
             isAfavoriteGif(array.data[i].id)==1 ? heartFav = "images/icon-fav-hover.svg" : heartFav = "./images/icon-fav-active.svg";
                  
            div.innerHTML = `<div class="card-opciones-search">
                                    <div class="opciones-gif">
                                        <button id="btn-favorito" class="opcion-button">
                                            <img src=${heartFav} id="img" alt="icono-busqueda">
                                        </button>
                                        <button id="btn-download" class="opcion-button" >
                                            <img src="images/icon-download.svg" alt="icono-busqueda">
                                        </button>
                                        <button id="btn-max" class="opcion-button">
                                            <img src="images/icon-max-hover.svg" alt="icono-busqueda">
                                        </button>
                                    </div>
                                    <div class="option-description">
                                        <p class="description user">${array.data[i].username}</p>
                                        <p class="description titulo">${array.data[i].title}</p>
                                    </div>                                    
                                </div>`;
            // Button events
           div.querySelector('#btn-download').addEventListener('click', () => {
                downloadGif(array.data[i].images.original.url,array.data[i].title);
            });
            div.querySelector('#btn-max').addEventListener('click', () => {
                maximizeGif(array.data[i].id);
            });       
            //to maximize on click when width <750
            div.addEventListener('click', () => {
                if (maxWidth.matches){
                 maximizeGif(array.data[i].id);
                }
            })            
            div.querySelector('#btn-favorito').addEventListener('click', () => {
            //to set and unset heart favorite css
            let heartImg=  div.querySelector('#img')            
            if (isAfavoriteGif(array.data[i].id)!=1){
             heartImg.src = "./images/icon-fav-hover.svg";              
            }
            else{heartImg.src = "./images/icon-fav-active.svg";}
            addFavorite(array.data[i].id);
            if(container_fav){ // if is in favorites section, load it                
                loadFavorites()                
            }
            });    
            img.srcset = `${array.data[i].images.downsized_large.url}`;
            img.alt = `${array.data[i].id}`;
            img.classList.add('card-img-search');
            div.appendChild(img);
            resultados.appendChild(div);
            resultados.classList.remove('hidden');
        }
        titulo.innerHTML = `${parametro}`;
        titulo.classList.remove('hidden');
        btn_vermas.classList.remove('hidden');
    }  else {
        resultados.classList.remove('resultados-gifs', 'hidden');
        resultados.classList.add('d-sinresultados');
        titulo.innerHTML = 'Lorem Ipsum';
        let imagen = document.createElement('img');
        imagen.srcset = './images/icon-busqueda-sin-resultado.svg';
        imagen.classList.add('img-sinresultados');
        resultados.appendChild(imagen);
        let texto = document.createElement('h3');
        texto.innerHTML = "Intenta con otra búsqueda";
        texto.classList.add('text-sinresultados');
        resultados.appendChild(texto);
        btn_vermas.classList.add('hidden');
    }
}
