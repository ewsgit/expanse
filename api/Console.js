export function Error(error) {
    return console.error("%c" + error, "font-size: 2.5em; color: #ff6666;");
}
export function Banner(message) {
    return console.log("%c" + message, "font-size: 3.5em; color: #ccbb33; font-weight: bold; background-color: #000000; padding: 0.5em;");
}
