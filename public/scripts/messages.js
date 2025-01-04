const as = document.getElementById("as");
const messageUrl = document.getElementById("messageUrl");
const emojisLabel = document.getElementById("emojisLabel");
const messageContainer = document.getElementById("messageContainer");
const avatar = document.getElementById("avatar");
const author = document.getElementById("author");
const content = document.getElementById("content");
const emojis = document.getElementById("emojis");
const submit = document.getElementById("submit");
$.ajax("/username", {
    success: (loggedin) => {
        as.innerHTML = `logged in as ${loggedin}`;
    } 
});
messageUrl.addEventListener('change', () => {
    const [ channel, message ] = messageUrl.value.split("/").slice(-2);
    $.ajax(`/message?channelId=${channel}&messageId=${message}`, {
        method: "GET",
        success: (data) => {
            messageContainer.style = "";
            avatar.src = data.avatar;
            author.innerHTML = data.author + ":";
            content.innerHTML = data.content;
        }
    });
});
emojis.addEventListener('change', () => {
    const length = emojis.value.split(",").length;
    emojisLabel.innerHTML = `emojis <label${length > 20 ? ' style="color: #ff0000;"' : ""}>(${length} detected)</span>:`
});
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const [ channelId, messageId ] = messageUrl.value.split("/").slice(-2);
    submit.disabled = true;
    submit.innerHTML = "reacting...";
    $.ajax("/message", {
        method: "POST",
        data: JSON.stringify({channelId: channelId, messageId: messageId, emojis: emojis.value.split(",")}),
        headers: {"Content-type": "application/json"},
        success: (data) => {
            alert(data);
            messageUrl.value = "";
            emojis.value = "";
            submit.disabled = false;
            submit.innerHTML = "spam";
        }
    });
});