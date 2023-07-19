window.onload = function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://50.20.249.21:3000/mods");
    xhr.send();
    xhr.responseType = "json";
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


}
function sendForm() {
    console.log("Submiteeds")
    var form = document.querySelector("form");
    console.log("Valider");
    let mod = document.getElementById("mod-sel");
    console.log(mod)
    let pseudoField = document.getElementById("title");
    let descField = document.getElementById("description");
    let discordField = document.getElementById("discord");
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
    if (discordField.value.length > 0) {
        if (!/\d{ 18 }/.test(discordField.value)) {
            if (discordField.length < 18 || discordField.length > 18) {
                isValid = false;
                error = "Please Enter a Valid Discord Identifier"
            }
        }
    }

    if (isValid) {

        let discord = 0;
        if (discordField.value !== "") {
            discord = BigInt(discordField.value)
        }
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://50.20.249.21:3000/idea");
        xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")
        
        body = JSON.stringify({
            modId: parseInt(document.getElementById("mod-sel").selectedOptions[0].value),
            title: pseudoField.value,
            description: descField.value,
            discordId: discord.toString()
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