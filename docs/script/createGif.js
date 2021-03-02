let div_descripcion = document.getElementById('div-descripcion');
let steps = document.getElementsByClassName('step');
let counter = document.getElementById('counter-recording');
let img_gif = document.getElementById('gif-recorded');
let img_uploadedGif = document.getElementById('img-uploadedGif');
let text_uploadedGif = document.getElementById('text-uploadedGif');
let div_uploadedGif = document.getElementById('div-uploadedGif');
let options_uploadedGif = document.getElementById('options-uploadedGif');

//buttons
let btn_begin = document.getElementById('btn-begin');
let btn_record = document.getElementById('btn-record');
let btn_stop = document.getElementById('btn-stop');
let btn_upload = document.getElementById('btn-upload');
let btn_repeat = document.getElementById('btn-repeat');
let btn_download = document.getElementById('btn-download');
let btn_link = document.getElementById('btn-link');

var video = document.querySelector('video');
let interval, minutes, hours, seconds
let recorder, gifBlob;
/*_____________________EVENTOS BOTONES_____________________*/
btn_begin.addEventListener("click", () => {
    
    visual();
    videoAccess()
});
btn_record.addEventListener("click", record);
btn_stop.addEventListener("click", stopRecord);
btn_repeat.addEventListener("click", repeatRecording);
btn_upload.addEventListener("click", uploadGif);

/*_____________________FUNCIONES GRABACIÓN_____________________*/
function visual() {
    div_descripcion.classList.add('div-descripcion')
    div_descripcion.classList.remove('hidden')
    div_descripcion.innerHTML = "<h2>¿Nos das acceso </br> a tu cámara?</h2><p>El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</p>";
    steps[0].classList.add('stepActive');
}

function videoAccess() {    
    btn_begin.hidden = true;
    var constraints = { audio: false, video: true};    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            video.play()            
            recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,                
                onGifRecordingStarted: function() {
                 console.log('started')
               },
              });
            btn_record.hidden = false;
            div_descripcion.classList.add('hidden')
            div_descripcion.classList.remove('div-descripcion')
        }).catch(function (error) {
            alert('Debes permitir el acceso a tu cámara para continuar');
            console.error(error);
            btn_begin.hidden = false;
        });
}


function record() {
    recorder.startRecording();
    btn_record.hidden = true;
    btn_stop.hidden = false;
    counter.hidden = false;
    steps[0].classList.remove('stepActive');
    steps[1].classList.add('stepActive');
    

    /*_____________________CALCULATE RECORD TIMING_____________________*/
    seconds = 0, minutes = 0, hours = 0;
    interval = setInterval(() => {
        seconds++;
        counter.innerHTML = seconds;
        if (seconds == 60) {
            minutes++;
            seconds = 0;
        }
        if (minutes == 60) {
            hours++;
            minutes = 0;
        }
        counter.innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000);
}

function stopRecord() {
    recorder.stopRecording(function () {
        gifBlob = recorder.getBlob()
    });    
    img_gif.hidden = false;
    img_gif.src = URL.createObjectURL(gifBlob);  
    btn_upload.hidden = false;
    btn_stop.hidden = true;        
    counter.hidden = true;
    btn_repeat.hidden = false;
    steps[1].classList.remove('stepActive');
    steps[2].classList.add('stepActive');
}

function repeatRecording() {
    recorder.clearRecordedData();
    img_gif.hidden = true;
    btn_upload.hidden = true;
    btn_repeat.hidden = true;  
    btn_begin.hidden = false;
    steps[2].classList.remove('stepActive');
    steps[0].classList.add('stepActive');    
    videoAccess()       
}

async function uploadGif() {
    btn_upload.hidden = true;    
    btn_repeat.hidden = true;
    div_uploadedGif.classList.add('div-uploadedGif')    
    let data = new FormData();
    data.append('file', gifBlob, 'migif.gif')    
    const response = await fetch(`https://upload.giphy.com/v1/gifs?api_key=${APIkey}
    `, {
      method: 'POST',
      body: data
    })
    const responseJson = await response.json()    
    AddToMyGifs(responseJson.data.id)    
    loadGifInfo(responseJson.data.id);    
    img_uploadedGif.srcset = 'images/check.svg';
    text_uploadedGif.innerHTML = "GIFO subido con éxito";  
    options_uploadedGif.classList.add('options-uploadedGif') 
}
/*_____________________ADD MY GIFS TO LOCAL STORAGE_____________________*/
function AddToMyGifs(myGifId) {
    myGifs_list = getMyGifs()
    myGifs_list.push(myGifId);
    localStorage.setItem('myGifs', JSON.stringify(myGifs_list));
}
async function loadGifInfo(idGif){    
    let data = await fetch(`https://api.giphy.com/v1/gifs/${idGif}?api_key=${APIkey}`);
    let gifInfo = await data.json();
    //Events for buttons
    btn_link.addEventListener("click", function copyLink() {
        var enlace = gifInfo.data.url;
        var inputTemporalLink = document.createElement("input");
        inputTemporalLink.setAttribute("value", enlace);
        document.body.appendChild(inputTemporalLink);
        inputTemporalLink.select();
        document.execCommand("copy");
        document.body.removeChild(inputTemporalLink);
    });
    btn_download.addEventListener("click", () => {
        downloadGif(gifInfo.data.images.original.url,'My Gif');
    });
}    