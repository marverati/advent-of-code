

function listToArray() {
    const txt = document.body.textContent;
    const lines = txt.split("\n").filter(l => l.trim().length > 0);
    let result = "[" + lines.join(",") + "]";
    let chars = 0;
    for (let i = 0; i < result.length; i++) {
        chars++;
        if (chars > 120 && result[i] === ",") {
            // Insert line break after
            result = result.substr(0, i + 1) + "\n" + result.substr(i + 1);
            chars = -1;
        }
    }

    document.body.textContent = result;
    document.body.style.whiteSpace = "pre-line";

    return result;
}
listToArray();