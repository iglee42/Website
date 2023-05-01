window.onload = function() {
    var form = document.querySelector("form");
    form.onsubmit = submitted.bind(form);
}

function submitted(event) {
    event.preventDefault();
}
function sendContactForm(form){
    var hasEmptyField = false;
    var discordFieldValid = true;
    var mailFieldValid = true;
    var pseudoField = form.getElementsByClassName("pseudo").item(0);
    var mailField = form.getElementsByClassName("mail").item(0);
    var discordField = form.getElementsByClassName("discord").item(0);
    var subjectField = form.getElementsByClassName("subject").item(0);
    var messageField = form.getElementsByClassName("message").item(0);
    if (pseudoField.value.length == 0){
        pseudoField.className += " empty";
        hasEmptyField = true;
        setTimeout(() => {
            pseudoField.className = pseudoField.className.substr(0,pseudoField.className.length - 6)
        }, 2500);
    }
    if (mailField.value.length != 0){
        if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(mailField.value)){
            hasEmptyField = true;
            mailFieldValid = false,
            mailField.className += " empty";
            setTimeout(() => {
               mailField.className = mailField.className.substr(0,mailField.className.length - 6)
            }, 2500);
        }
    } else {
        hasEmptyField = true;
            mailFieldValid = false,
            mailField.className += " empty";
            setTimeout(() => {
               mailField.className = mailField.className.substr(0,mailField.className.length - 6)
            }, 2500);
    }
    if (discordField.value.length != 0){
        if (!/^.{3,32}#[0-9]{4}$/.test(discordField.value)){
            discordFieldValid = false;
            hasEmptyField = true;
            discordField.className += " empty";
            setTimeout(() => {
                discordField.className = discordField.className.substr(0,discordField.className.length - 6)
            }, 2500);
        }
    }
    if (subjectField.value.length == 0){
        subjectField.className += " empty";
        hasEmptyField = true;
        setTimeout(() => {
            subjectField.className = subjectField.className.substr(0,subjectField.className.length - 6)
        }, 2500);
    }
    if (messageField.value.length == 0){
        messageField.className += " empty";
        hasEmptyField = true;
        setTimeout(() => {
            messageField.className = messageField.className.substr(0,messageField.className.length - 6)
        }, 2500);
    }
    if (hasEmptyField) {
        var errorLabel = form.getElementsByClassName("errorMsg").item(0);
        if (mailFieldValid) {
            if (discordFieldValid) {
                errorLabel.textContent = "Please complete all fields";
            } else {
                errorLabel.textContent = "Please use a valid discord id";
            }
        } else {
            errorLabel.textContent = "Please use a valid email";
        }
        errorLabel.className += " active";
        const btn = form.querySelector("button");
        const text = btn.querySelector("span");
        const sendIcon = btn.querySelector(".fa-paper-plane");
        const checkIcon = btn.querySelector(".fa-xmark");
        text.style.visibility = "hidden";
        text.style.width = "0px";
        text.style.height = "0px";
        text.style.fontSize = "0px";
        setTimeout(() => {
            btn.style.transform = "scaleX(0.5)";
            btn.style.borderRadius = "30px";
            sendIcon.style.transform = "translate(-5px) scaleX(2)";
        }, 200);
        setTimeout(() => {
            sendIcon.style.transform = "translate(150%,-150%)";
            btn.style.background = "#cc0000"
            btn.style.borderColor = "#990000"
        }, 1400);
        setTimeout(() => {
            sendIcon.style.display = "none";
            checkIcon.style.display = "block";
        }, 1700);
        setTimeout(() => {
            checkIcon.style.transform = "scaleX(2) translateX(0px) translateY(-25px)";
        }, 1750);
        setTimeout(() => {
            errorLabel.className = errorLabel.className.substr(0,errorLabel.className.length - 7)
        }, 2500);
        setTimeout(() => {
            checkIcon.style.transform = "";
            setTimeout(() => {
                sendIcon.style.display = "";
                checkIcon.style.display = "";
            }, 200);
            setTimeout(() => {
                sendIcon.style.transform = "";
                btn.style.background = ""
                btn.style.borderColor = ""
            }, 1400);
            setTimeout(() => {
                btn.style.transform = "";
                btn.style.borderRadius = "";
                sendIcon.style.transform = "";
            }, 1700);
            setTimeout(() => {
                text.style.visibility = "";
                text.style.width = "";
                text.style.height = "";
                text.style.fontSize = "";
            }, 1750);
        }, 3000);
    } else {
        const btn = form.querySelector("button");
        const text = btn.querySelector("span");
        const sendIcon = btn.querySelector(".fa-paper-plane");
        const checkIcon = btn.querySelector(".fa-check");
        text.style.visibility = "hidden";
        text.style.width = "0px";
        text.style.height = "0px";
        text.style.fontSize = "0px";
        
        setTimeout(() => {
            btn.style.transform = "scaleX(0.5)";
            btn.style.borderRadius = "30px";
            sendIcon.style.transform = "translate(-5px,-5px) scaleX(2)";
            const request = new XMLHttpRequest();
            request.open("POST","https://ptb.discord.com/api/webhooks/1072148511249944606/YZ1s85izw4wd3p0IFAEtNxJr43VV5q2tJ4p945VtMUDOrwK9cXN_9_FYZiBvn2ZPCtVz");
            request.setRequestHeader('Content-type', 'application/json');
            request.send(getHook(subjectField.value,pseudoField.value,mailField.value,messageField.value,discordField.value))
        }, 200);
        setTimeout(() => {
            sendIcon.style.transform = "translate(200%,-200%)";
            btn.style.background = "#26872a"
            btn.style.borderColor = "#206623"
        }, 1800);
        setTimeout(() => {
            sendIcon.style.display = "none";
            checkIcon.style.display = "block";
        }, 2100);
        setTimeout(() => {
            checkIcon.style.transform = "scaleX(2) translateX(0px) translateY(-25px)";
        }, 2150);
        setTimeout(() => {
            form.reset();
            window.location.reload();
        }, 3000);
    }
}
function checkCharsLimit(txtArea) {
    var maxChars = 6*33;
    while(txtArea.value.length > maxChars) 
    { 
      txtArea.value = txtArea.value.substr(0,txtArea.value.length-1); 
    } 
}

function getHook(subject,pseudo,email,message,profile_name){
    return JSON.stringify({
        "content": null,
        "embeds": [
          {
            "title": subject,
            "description": "Pseudo :"+pseudo+"\nEmail : "+email+"\n\nMessage : "+message,
            "color": 36124
          }
        ],
        "username": profile_name.length == 0 ? pseudo : profile_name,
        "attachments": []
      })
}