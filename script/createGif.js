let div_descripcion = document.getElementById('div-descripcion');
let steps = document.getElementsByClassName('step');

let btn_begin = document.getElementById('btn-comenzar');
let btn_record = document.getElementById('btn-grabar');




/*_____________________EVENTOS BOTONES_____________________*/
btn_begin.addEventListener("click", () => {
    visual();
    videoAccess()
});


/*_____________________FUNCIONES GRABACIÓN_____________________*/
function visual() {
    div_descripcion.innerHTML = "<h2>¿Nos das acceso </br> a tu cámara?</h2><p>El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.</p>";
    btn_begin.hidden = true;
    steps[0].classList.add('pasoactivo');
}

function videoAccess() {
    //video
    var constraints = { audio: false, video: {  height: {max: 480} } };
    //permisos para la captura de vídeo
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            video.play()
            
            btn_record.hidden = false;
            steps[0].classList.remove('pasoactivo');
            steps[1].classList.add('pasoactivo');
        }).catch(function (error) {
            alert('Debes permitir el acceso a tu cámara para continuar');
            console.error(error);
        });
}