var isLogged = false
var discordId = BigInt("0")

window.onload = function () {

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://50.20.249.21:3000/mods");
    xhr.send();
    xhr.responseType = "json";
    xhr.timeout = 1000;

    xhr.ontimeout = () => {
        if (xhr.status == 0) {
            document.querySelector("form").style.display = "none"
            let disabledText = document.createElement("p");
            disabledText.textContent = "The server is off retry later !"
            disabledText.className += "text-center fs-3 mt-3"
            document.querySelector("#main-div").appendChild(disabledText)
        }
    }
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const data = xhr.response;
            let keys = Object.keys(data)
            let modSel = document.getElementById("mod-sel")
            keys.forEach(m => {
                let option = document.createElement("option")
                option.value = data[m].id
                option.text = data[m].name
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

    const parameters = new URLSearchParams(location.search)
    if (parameters.has("code")) {
        isLogged = true
        let discordButton = document.querySelector("#discord-link")
        discordButton.style.display = "none"
    }
    if (isLogged) {
        var data = "code=" + parameters.get("code") + "&client_id=1127179485515624478&client_secret=WqRFMJ4u93K1rYCdbYpPSJ66iISE7OvT&grant_type=authorization_code&redirect_uri=http%3A%2F%2Figlee.fr";

        var discordXHR = new XMLHttpRequest();


        discordXHR.open("POST", "https://discord.com/api/oauth2/token");
        discordXHR.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        discordXHR.send(data);
        discordXHR.onload = () => {
            var discordJson = JSON.parse(discordXHR.responseText);
            getDiscordUsername(discordJson.access_token, discordJson.token_type);
            console.log(`Error: ${xhr.status}`);
        }
    }
}


function getDiscordUsername(token, tokenType) {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;


    xhr.open("GET", "https://discord.com/api/users/@me");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", tokenType + " " + token);
    xhr.send();

    xhr.onload = () => {
        var discordJson = JSON.parse(xhr.responseText)
        if (discordJson.global_name === undefined) {
            let discordButton = document.querySelector("#discord-link")
            discordButton.style.display = "block"
        } else {
            let usernameText = document.createElement("p");
            usernameText.innerHTML = "<i class=\"fa-brands fa-discord\" style=\"color: #5562ea;\"></i> Logged as " + discordJson.global_name
            usernameText.className += "text-center fs-3 mt-3"
            document.querySelector("#discord-connect-div").appendChild(usernameText)
        }
        if (discordJson.id !== undefined) {
            discordId = BigInt(discordJson.id)
        }
    }
}

function sendForm() {
    console.log("Submited")
    var form = document.querySelector("form");
    console.log("Valider");
    let mod = document.getElementById("mod-sel");
    let pseudoField = document.getElementById("title");
    let descField = document.getElementById("description");
    let error = "";
    let isValid = true;

    if (mod.selectedIndex <= 0) {
        isValid = false;
        error = "Please Choose a valid Mod"
    }
    if (pseudoField.value.length <= 0) {
        isValid = false;
        error = "Please Enter a Title"
    }
    if (descField.value.length <= 0) {
        isValid = false;
        error = "Please Enter a Description"
    }

    console.log("Valid : " + isValid)

    if (isValid) {

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://50.20.249.21:3000/idea");
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

        body = JSON.stringify({
            modId: parseInt(document.getElementById("mod-sel").selectedOptions[0].value),
            title: pseudoField.value,
            description: descField.value,
            discordId: discordId.toString()
        })
        xhr.send(body);
        xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log("Send");
            } else {
                console.log(`Error: ${xhr.status}`);
            }
        };

    } else {
        alert(error)
    }

}
