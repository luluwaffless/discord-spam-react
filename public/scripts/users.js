const as = document.getElementById("as");
const user = document.getElementById("user");
const userId = document.getElementById("userId");
const username = document.getElementById("username");
const emojisLabel = document.getElementById("emojisLabel");
const emojis = document.getElementById("emojis");
let savedUsers = {};
$.ajax("/username", {
    success: (loggedin) => {
        as.innerHTML = `logged in as ${loggedin}`;
    } 
});

let removeds = false;
const reload = () => $.ajax("/users", {
    success: (users) => {
        removeds = false;
        savedUsers = users;
        let options = ['<option id="s">select a saved user...</option>'];
        Object.keys(users).forEach((id) => {
            options.push(`<option value="${id}">@${users[id].name} (${id})</option>`)
        });
        user.innerHTML = options.join();
        userId.value = "";
        username.value = "";
        emojis.value = "";
    } 
});
reload();
document.getElementById("reload").addEventListener("click", reload);
user.addEventListener("change", () => {
    if (!removeds) {
        document.getElementById("s").remove();
        removeds = true;
    };
    if (savedUsers[user.value]) {
        userId.value = user.value;
        username.value = savedUsers[user.value].name;
        emojis.value = savedUsers[user.value].emojis.join(',');
    };
});

userId.addEventListener('change', () => {
    $.ajax("/user?id=" + userId.value, {
        success: (name) => {
            username.value = name;
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
        $.ajax("/user", {
            method: "POST",
            data: JSON.stringify({id: userId.value, name: username.value, emojis: emojis.value.split(",")}),
            headers: {"Content-type": "application/json"},
            success: (data) => {
                alert(data);
                userId.value = "";
                username.value = "";
                emojis.value = "";
                reload();
            }
        });
    } else if (submitType == "delete") {
        $.ajax("/user", {
            method: "DELETE",
            data: JSON.stringify({id: userId.value}),
            headers: {"Content-type": "application/json"},
            success: (data) => {
                alert(data);
                userId.value = "";
                username.value = "";
                emojis.value = "";
                reload();
            }
        });
    };
});