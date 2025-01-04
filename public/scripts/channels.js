const as = document.getElementById("as");
const channel = document.getElementById("channel");
const channelId = document.getElementById("channelId");
const channelName = document.getElementById("channelName");
const emojisLabel = document.getElementById("emojisLabel");
const emojis = document.getElementById("emojis");
let savedChannels = {};
$.ajax("/username", {
    success: (loggedin) => {
        as.innerHTML = `logged in as ${loggedin}`;
    } 
});

let removeds = false;
const reload = () => $.ajax("/channels", {
    success: (channels) => {
        removeds = false;
        savedChannels = channels;
        let options = ['<option id="s">select a saved channel...</option>'];
        Object.keys(channels).forEach((id) => {
            options.push(`<option value="${id}">#${channels[id].name} (${id})</option>`)
        });
        channel.innerHTML = options.join();
        channelId.value = "";
        channelName.value = "";
        emojis.value = "";
    } 
});
reload();
document.getElementById("reload").addEventListener("click", reload);
channel.addEventListener("change", () => {
    if (!removeds) {
        document.getElementById("s").remove();
        removeds = true;
    };
    if (savedChannels[channel.value]) {
        channelId.value = channel.value;
        channelName.value = savedChannels[channel.value].name;
        emojis.value = savedChannels[channel.value].emojis.join(',');
    };
});

channelId.addEventListener('change', () => {
    $.ajax("/channel?id=" + channelId.value, {
        success: (name) => {
            channelName.value = name;
        } 
    })
});
emojis.addEventListener('change', () => {
    const length = emojis.value.split(",").length;
    emojisLabel.innerHTML = `emojis <label${length > 20 ? ' style="color: #ff0000;"' : ""}>(${length} detected)</span>:`
});
document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const submitType = e.submitter.value;
    if (submitType == "save") {
        $.ajax("/channel", {
            method: "POST",
            data: JSON.stringify({id: channelId.value, name: channelName.value, emojis: emojis.value.split(",")}),
            headers: {"Content-type": "application/json"},
            success: (data) => {
                alert(data);
                channelId.value = "";
                channelName.value = "";
                emojis.value = "";
                reload();
            }
        });
    } else if (submitType == "delete") {
        $.ajax("/channel", {
            method: "DELETE",
            data: JSON.stringify({id: channelId.value}),
            headers: {"Content-type": "application/json"},
            success: (data) => {
                alert(data);
                channelId.value = "";
                channelName.value = "";
                emojis.value = "";
                reload();
            }
        });
    };
});