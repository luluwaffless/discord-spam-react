const as = document.getElementById("as");
const guild = document.getElementById("guild");
const guildId = document.getElementById("guildId");
const guildName = document.getElementById("guildName");
const emojisLabel = document.getElementById("emojisLabel");
const emojis = document.getElementById("emojis");
let savedguilds = {};
$.ajax("/username", {
    success: (loggedin) => {
        as.innerHTML = `logged in as ${loggedin}`;
    } 
});

let removeds = false;
const reload = () => $.ajax("/guilds", {
    success: (guilds) => {
        removeds = false;
        savedguilds = guilds;
        let options = ['<option id="s">select a saved guild...</option>'];
        Object.keys(guilds).forEach((id) => {
            options.push(`<option value="${id}">${guilds[id].name} (${id})</option>`)
        });
        guild.innerHTML = options.join();
        guildId.value = "";
        guildName.value = "";
        emojis.value = "";
    } 
});
reload();
document.getElementById("reload").addEventListener("click", reload);
guild.addEventListener("change", () => {
    if (!removeds) {
        document.getElementById("s").remove();
        removeds = true;
    };
    if (savedguilds[guild.value]) {
        guildId.value = guild.value;
        guildName.value = savedguilds[guild.value].name;
        emojis.value = savedguilds[guild.value].emojis.join(',');
    };
});

guildId.addEventListener('change', () => {
    $.ajax("/guild?id=" + guildId.value, {
        success: (name) => {
            guildName.value = name;
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
        $.ajax("/guild", {
            method: "POST",
            data: JSON.stringify({id: guildId.value, name: guildName.value, emojis: emojis.value.split(",")}),
            headers: {"Content-type": "application/json"},
            success: (data) => {
                alert(data);
                guildId.value = "";
                guildName.value = "";
                emojis.value = "";
                reload();
            }
        });
    } else if (submitType == "delete") {
        $.ajax("/guild", {
            method: "DELETE",
            data: JSON.stringify({id: guildId.value}),
            headers: {"Content-type": "application/json"},
            success: (data) => {
                alert(data);
                guildId.value = "";
                guildName.value = "";
                emojis.value = "";
                reload();
            }
        });
    };
});