document.querySelector(".drop-area").addEventListener('drop',handleDrop)
document.querySelector(".clear-btn").addEventListener('click', clearFile)
document.querySelector(".send-btn").addEventListener('click', sendFile)
let progressBar = document.getElementById('progress-bar')
let dt;

window.addEventListener("dragover", function (e) {
    e = e || event;
    e.preventDefault();
}, false);
window.addEventListener("drop", function (e) {
    e = e || event;
    e.preventDefault();
}, false);

function highlight() {
    document.querySelector('.drop-area').classList.add('active')
    document.querySelector(".drag-drop-bg").classList.remove('inactive')
}

function unhighlight() {
    document.querySelector('.drop-area').classList.remove('active')
    document.querySelector(".drag-drop-bg").classList.add('inactive')
}
function clearFile(e) {
    e.preventDefault()
    dt.files = undefined
    document.querySelector("form").reset()
    document.querySelector(".label").classList.add('inactive')
    document.querySelector(".form-select").classList.add('inactive')
    document.querySelector(".clear-btn").classList.add('inactive')
    document.querySelector(".send-btn").classList.add('inactive')
    progressBar.classList.add('inactive')
}
function handleDrop(e) {
    e.preventDefault()
    dt = e.dataTransfer
    var files = dt.files
    document.querySelector(".label").classList.remove('inactive')
    document.querySelector(".label").innerText = "Fichier séléctionné : " + files[0].name
    document.querySelector(".form-select").classList.remove('inactive')
    document.querySelector(".clear-btn").classList.remove('inactive')
    document.querySelector(".send-btn").classList.remove('inactive')
    progressBar.classList.remove('inactive')
    unhighlight()
}

function sendFile(e) {
    e.preventDefault()
    handleFiles(dt.files)
}

function handleFiles(files) {
    files = [...files]
    files.forEach((file) => {
      uploadFile(file,document.querySelector('.form-select').selectedOptions[0].value)  
    })
}

function updateProgress(percent) {
    progressBar.value = percent
}

function uploadFile(file,type) {
    var url = 'https://iglee.fr:3000/textures/'+type
    var xhr = new XMLHttpRequest()
    var formData = new FormData()
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*")

    xhr.open('POST', url, true)

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {
        updateProgress((e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', function (e) {
        if (xhr.readyState == 4 && xhr.status == 201) {
            updateProgress(0)
            document.querySelector("form").reset()
            document.querySelector(".label").classList.add('inactive')
            document.querySelector(".form-select").classList.add('inactive')
            document.querySelector(".clear-btn").classList.add('inactive')
            document.querySelector(".send-btn").classList.add('inactive')
            progressBar.classList.add('inactive')
        }
        else if (xhr.readyState == 4 && xhr.status != 200) {
        }
    })

    formData.append('file', file)
    xhr.send(formData)
}