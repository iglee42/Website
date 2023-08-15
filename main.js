window.onload = function() { 
    const leftLinks = document.getElementById("nav-list-left").getElementsByTagName("a")
    const rightLinks = document.getElementById("nav-list-right").getElementsByTagName("a")
    const full_path = location.href.split("#")[0];

    // Loop through each link.
    for(i = 0; i<leftLinks.length; i++) {
        if(leftLinks[i].href.split("#")[0] == full_path) {
            leftLinks[i].className += " active";
        }
    }
    for(i = 0; i<rightLinks.length; i++) {
        if(rightLinks[i].href.split("#")[0] == full_path && !rightLinks[i].className.contains("resources")) {
            rightLinks[i].className += " active";
        }
    }
}

function mouseEnter(element) {
    element.className += " active"
}
function mouseExit(element) {
    const classes = element.className;
    element.className = classes.substr(0,classes.length - 7)
}

function resourceClick(){
    let showing = document.getElementById("resourceDrop").classList.toggle("show");
    if (showing){
        document.getElementsByClassName("nav-arrow")[0].classList.add("fa-rotate-90")
    } else{
        document.getElementsByClassName("nav-arrow")[0].classList.remove("fa-rotate-90")
    }
}