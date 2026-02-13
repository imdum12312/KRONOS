import { setWisp, setTransport, makeURL, getProxied } from "../../math.mjs"

const proto = location.protocol === "https:" ? "wss://" : "ws://"
setWisp(proto + location.host + "/wisp/")
setTransport("epoxy")

const frame = document.getElementById("frame")
const loader = document.getElementById("loader")
const tabs = document.getElementById("tabs")
const home = document.getElementById("homePage")
const searchHome = document.getElementById("searchHome")
const searchBar = document.querySelector(".search-bar")
const searchTop = document.getElementById("searchToolbar")

const btnSettings = document.getElementById("btnSettings")
const settingsMenu = document.getElementById("settingsMenu")
const discordBtn = document.getElementById("discordBtn")
const snowToggle = document.getElementById("snowToggle")
const root = document.getElementById("root")

let stack = []
let index = -1

const isURL = v => v.startsWith("http") || v.includes(".")

async function load(url, hist = true) {
    loader.style.display = "block"
    frame.style.display = "block"
    tabs.style.display = "flex"
    home.style.display = "none"

    frame.src = await getProxied(makeURL(url))
    searchTop.value = url

    if (hist) {
        stack = stack.slice(0, ++index)
        stack.push(url)
    }

    setTimeout(() => loader.style.display = "none", 250)
}

searchHome.onkeydown = e => {
    if (e.key !== "Enter") return
    let v = searchHome.value.trim()
    if (!isURL(v)) v = "https://duckduckgo.com/?q=" + encodeURIComponent(v)
    else if (!v.startsWith("http")) v = "https://" + v
    searchBar.classList.add("hidden")
    load(v)
}

searchTop.onkeydown = e => {
    if (e.key !== "Enter") return
    let v = searchTop.value.trim()
    if (!isURL(v)) v = "https://duckduckgo.com/?q=" + encodeURIComponent(v)
    else if (!v.startsWith("http")) v = "https://" + v
    load(v)
}

back.onclick = () => index > 0 && load(stack[--index], false)
forward.onclick = () => index < stack.length - 1 && load(stack[++index], false)
refresh.onclick = () => index >= 0 && load(stack[index], false)
full.onclick = () => document.fullscreenElement ? document.exitFullscreen() : frame.requestFullscreen()

discordBtn.onclick = () => {
    searchHome.value = "https://discord.gg/7szgQn6EHP"
    searchHome.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter"}))
}

btnSettings.onclick = () => settingsMenu.classList.toggle("active")
snowToggle.onchange = e => root.style.opacity = e.target.checked ? "1" : "0"
