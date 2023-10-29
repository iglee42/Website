const form = document.querySelector("form"); //define before it's need to be called (called line two)
const sendBtn = form.querySelector(".blue-button");
const sendText = sendBtn.querySelector("span");
const sendIcon = sendBtn.querySelector(".fa-paper-plane");
const xhr = new XMLHttpRequest();


let isLogged = false
let discordId = BigInt("0")

window.onload = function () {
    //When load, check if the server is online and get mods
    xhr.open("GET", "http://50.20.249.21:3000/mods");
    xhr.send();
    xhr.responseType = "json";
    xhr.timeout = 1000;

    //If there is a timeout that means the server is offline
    xhr.ontimeout = () => {
        if (xhr.status == 0) {
            document.querySelector("form").style.display = "none"
            const disabledText = document.createElement("p");
            disabledText.textContent = "The server is off retry later !"
            disabledText.className += "text-center fs-3 mt-3"
            document.querySelector("#main-div").appendChild(disabledText)
        }
    }
    xhr.onload = () => {
        //When we receive the mods , we add it to the mod-sel list
        if (xhr.readyState == 4 && xhr.status == 200) {
            let data = xhr.response;
            const keys = Object.keys(data)
            const modSel = document.getElementById("mod-sel")
            keys.forEach(m => {
                let option = document.createElement("option")
                option.value = data[m].id
                option.text = data[m].name
                //If the mod is disable , we disable it in the list and we add a title
                if (data[m].disabled) {
                    option.setAttribute("disabled", "")
                    option.setAttribute("title", "This mod don't accept ideas")
                }
                modSel.add(option)
            })
        } else {
            console.log(`Error: ${xhr.status}`);
        }
    };

    //We retreive parameters on the url
    const parameters = new URLSearchParams(location.search)
    //We check if there is the code parameter
    if (parameters.has("code")) {
        //If the code parameter is present that means the user is logged with his discord account
        isLogged = true
        let discordButton = document.querySelector("#discord-link")
        discordButton.style.display = "none"
    }
    //If the user is connected , we retreive his username
    if (isLogged) {
        let data = "code=" + parameters.get("code") + "&client_id=1127179485515624478&client_secret=WqRFMJ4u93K1rYCdbYpPSJ66iISE7OvT&grant_type=authorization_code&redirect_uri=http%3A%2F%2Figlee.fr";

        let discordXHR = new XMLHttpRequest();


        //We send a request to auth with the account and retreive the username
        discordXHR.open("POST", "https://discord.com/api/oauth2/token");
        discordXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        discordXHR.send(data);
        discordXHR.onload = () => {
            let discordJson = JSON.parse(discordXHR.responseText);
            getDiscordUsername(discordJson.access_token, discordJson.token_type);
            console.log(`Error: ${xhr.status}`);
        }
    }
}


function getDiscordUsername(token, tokenType) {
    xhr.withCredentials = true;

    //We send a request to retreive username and id
    xhr.open("GET", "https://discord.com/api/users/@me");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", tokenType + " " + token);
    xhr.send();

    xhr.onload = () => {
        let discordJson = JSON.parse(xhr.responseText)
        //if there is no username ,we reshow the login button
        if (discordJson.global_name === undefined) {
            let discordButton = document.querySelector("#discord-link")
            discordButton.style.display = "block"
        } else {
            //If there is a username, we show the username on the page
            let usernameText = document.createElement("p");
            usernameText.innerHTML = "<i class=\"fa-brands fa-discord\" style=\"color: #5562ea;\"></i> Logged as " + discordJson.global_name
            usernameText.className += "text-center fs-3 mt-3"
            document.querySelector("#discord-connect-div").appendChild(usernameText)
        }

        //If there is an id, we store it in a variable
        if (discordJson.id !== undefined) {
            discordId = BigInt(discordJson.id)
        }
    }
}

//The function is called when the send button is pressed
function sendForm() {
    let mod = document.getElementById("mod-sel");
    let titleField = document.getElementById("title");
    let descField = document.getElementById("description");
    let error = "";
    let isValid = true;


    //We check if a mod was selected
    if (mod.selectedIndex <= 0) {
        isValid = false;
        error = "Please Choose a valid Mod"
    }

    //We check if a title was enter
    if (titleField.value.length <= 0) {
        isValid = false;
        error = "Please Enter a Title"
    }

    //We check if a title was enter
    if (descField.value.length <= 0) {
        isValid = false;
        error = "Please Enter a Description"
    }

    //If the form is valid , we send a request to add idea in the database
    if (isValid) {

        xhr.open("POST", "http://iglee.fr:3000/idea");
        xhr.overrideMimeType("text/plain")
        xhr.setRequestHeader('X-Requested-With', 'xmlhttprequest');
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

        body = JSON.stringify({
            modId: parseInt(document.getElementById("mod-sel").selectedOptions[0].value),
            title: pseudoField.value,
            description: descField.value,
            discordId: discordId.toString()
        })
        xhr.send(body);
        xhr.onload = () => {
            if (xhr.status == 200) {
                //If we receive a response of the request , we start the success animation otherwise we send the fail animation
                sendAnimation(form,true)
            } else {
                sendAnimation(form,false)
            }
        };
        xhr.onerror = () => {
            sendAnimation(form,false)
        }

    } else {
        sendAnimation(form,false)
    }

}

function sendAnimation(form,isSucces) {
    let checkIcon = isSucces ? sendBtn.querySelector(".fa-check") : sendBtn.querySelector(".fa-xmark");

    //Disable the text for animation
    sendText.style.visibility = "hidden";
    sendText.style.width = "0px";
    sendText.style.height = "0px";
    sendText.style.fontSize = "0px";
    setTimeout(() => {
        //Reduce size of the button & move the send icon 5 pixels up
        sendBtn.style.width = "75px";
        sendBtn.style.borderRadius = "30px";
        sendIcon.style.transform = "translate(-5px)";
    }, 200);
    setTimeout(() => {
        //Change Button color & move the send icon
        sendIcon.style.transform = "translate(150%,-150%)";
        sendBtn.style.background = isSucces ? "#26872a" : "#cc0000"
        sendBtn.style.borderColor = isSucces ? "#206623" : "#990000"
    }, 1400);
    setTimeout(() => {
        //Hide the send icon & show the check icon
        sendIcon.style.display = "none";
        checkIcon.style.display = "block";
    }, 1700);
    setTimeout(() => {
        //Move the check icon from the bottom
        checkIcon.style.transform = "translateY(-37px)";
    }, 1750);
    //When the animation is finish, we make all of previous steps but in the other direction
    setTimeout(() => {
        checkIcon.style.transform = "";
        setTimeout(() => {
            sendIcon.style.display = "";
            checkIcon.style.display = "";
        }, 200);
        setTimeout(() => {
            sendIcon.style.transform = "";
            sendBtn.style.background = ""
            sendBtn.style.borderColor = ""
        }, 1400);
        setTimeout(() => {
            sendBtn.style.width = "150px";
            sendBtn.style.borderRadius = "";
            sendIcon.style.transform = "";
        }, 1700);
        setTimeout(() => {
            sendText.style.visibility = "";
            sendText.style.width = "";
            sendText.style.height = "";
            sendText.style.fontSize = "";
        }, 1750);
        //If the animation is success we reset the form
        if (isSucces) {
            setTimeout(() => {
                form.reset()
                window.location.search = ""
                window.location.reload();
            }, 1900);
        }
    }, 3000);
}

