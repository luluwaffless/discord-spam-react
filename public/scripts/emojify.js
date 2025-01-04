const letters = {"a": ["🇦", "🅰️", "4️⃣"], "b": ["🇧", "🅱️", "3️⃣"], "c": ["🇨", "🌊"], "d": ["🇩"], "e": ["🇪", "📧", "3️⃣"], "f": ["🇫"], "g": ["🇬"], "h": ["🇭", "4️⃣"], "i": ["🇮", "ℹ️", "1️⃣"], "j": ["🇯"], "k": ["🇰"], "l": ["🇱"], "m": ["🇲", "Ⓜ️"], "n": ["🇳"], "o": ["🇴", "🅾️", "⭕", "0️⃣"], "p": ["🇵", "🅿️"], "q": ["🇶"], "r": ["🇷"], "s": ["🇸", "5️⃣", "💲"], "t": ["🇹"], "u": ["🇺"], "v": ["🇻", "✅", "☑️", "✔️"], "w": ["🇼"], "x": ["🇽", "❌", "✖️", "❎"], "y": ["🇾"], "z": ["🇿", "2️⃣"]};
const combinations = {"ab": ["🆎"], "cl": ["🆑"], "sos": ["🆘"], "vs": ["🆚"], "wc": ["🚾"], "ng": ["🆖"], "ok": ["🆗"], "up": ["🆙"], "cool": ["🆒"], "new": ["🆕"], "free": ["🆓"], "abc": ["🔤"], "abcd": ["🔡", "🔠"], "tm": ["™️"]};
const presets = {
    "forse": "1316919808377356298,1316919823661531246,1316919841247989800,1316919857144397924,1316919874500689990,1316919889956569120,1316919903348854854,1316919917718540338,1316919936161026110,1316919950170001428,1316919962811502622,1316919975188893760,1316919986505257051,1316919995833385010,1316920007430635551,1316920017790566432,1317171725854838805,1317171737615663155,1317171750525603950,1317171762345152582",
    "clock": "🕛,🕧,🕐,🕜,🕑,🕝,🕒,🕞,🕓,🕟,🕔,🕠,🕕,🕡,🕖,🕢,🕗,🕣,🕘,🕤",
    "bird": "🐔,🦆,🐓,🦃,🦅,🕊️,🦢,🦜,🐦‍⬛,🪿,🐦‍🔥,🦩,🦚,🦉,🦤,🐦,🐧,🐥,🐤,🐣"
}
function emojify(text) {
    if (typeof text == "string" && !/^[a-z]*$/.test(text.toLowerCase())) {
        alert("impossible to emojify (invalid characters, use only letters)");
        return null;
    };
    if (presets[text]) return presets[text];
    text = text.toLowerCase().slice(0, 20);
    const usedEmojis = new Set();
    const result = [];
    function getEmoji(key, source) {
        if (source[key]) {
            for (const emoji of source[key]) {
                if (!usedEmojis.has(emoji)) {
                    usedEmojis.add(emoji);
                    return emoji;
                };
            };
        };
        return null;
    };
    let i = 0;
    while (i < text.length) {
        let matched = false;
        for (const combination in combinations) {
            if (text.startsWith(combination, i)) {
                const emoji = getEmoji(combination, combinations);
                if (emoji) {
                    result.push(emoji);
                    i += combination.length;
                    matched = true;
                    break;
                } else {
                    alert("impossible to emojify (repeated characters with no alternatives)");
                    return null;
                };
            };
        };
        if (!matched) {
            const char = text[i];
            const emoji = getEmoji(char, letters);
            if (emoji) {
                result.push(emoji);
            } else {
                alert("impossible to emojify (repeated characters with no alternatives)");
                return null;
            };
            i++;
        };
    };
    return result.join(',');
};
document.getElementById("emojify").addEventListener("click", () => {
    const emojified = emojify(emojis.value);
    if (emojified) emojis.value = emojified;
});