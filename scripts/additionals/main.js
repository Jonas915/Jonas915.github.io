"use strict";
var grundschule;
(function (grundschule) {
    let PAGE_NAME;
    (function (PAGE_NAME) {
        PAGE_NAME[PAGE_NAME["SONSTIGES"] = 0] = "SONSTIGES";
        PAGE_NAME[PAGE_NAME["KLASSENRAUM"] = 1] = "KLASSENRAUM";
        PAGE_NAME[PAGE_NAME["TURNHALLE"] = 2] = "TURNHALLE";
        PAGE_NAME[PAGE_NAME["MUSIKRAUM"] = 3] = "MUSIKRAUM";
        PAGE_NAME[PAGE_NAME["MENSA"] = 4] = "MENSA";
        PAGE_NAME[PAGE_NAME["SCHULHOF"] = 5] = "SCHULHOF";
        PAGE_NAME[PAGE_NAME["TOILETTEN"] = 6] = "TOILETTEN";
        PAGE_NAME[PAGE_NAME["MALRAUM"] = 7] = "MALRAUM";
    })(PAGE_NAME || (PAGE_NAME = {}));
    let data;
    let dataSource = "../data/additionals.json";
    let dataSourceString = "additionals";
    let currentPage = PAGE_NAME.SONSTIGES;
    let soundFiles = [];
    document.addEventListener("DOMContentLoaded", handleLoad);
    async function handleLoad(_event) {
        if (await getData())
            displayData();
        else
            alert("No data, no Output!");
    }
    async function getData() {
        let response = await fetch(dataSource);
        if (response) {
            let stringData = await response.text();
            data = JSON.parse(stringData);
            console.log(data);
            return true;
        }
        else {
            console.log("No data found!");
            return false;
        }
    }
    function displayData() {
        let body = document.querySelector("body");
        initialiseSite(body);
        let categoryData = data[dataSourceString];
        createNav(categoryData);
        let currentData = categoryData[currentPage];
        document.querySelector("h1").innerText = currentData.headline;
        console.log(currentData);
        // for (let imageSrc of currentData.imageSources) {
        //     createElement(body, "image", imageSrc);
        // }
        let contentDiv = document.createElement("div");
        contentDiv.classList.add("content");
        if (currentData.videoSource) {
            createNewElement(contentDiv, "video", currentData.videoSource);
        }
        let div = document.createElement("div");
        div.classList.add("texts");
        for (let textContent of currentData.texts) {
            createNewElement(div, "text", textContent);
        }
        contentDiv.appendChild(div);
        body.appendChild(contentDiv);
        // for (let soundSrc of currentData.soundSources) {
        //     console.log(soundSrc);
        //     createElement(body, "sound", soundSrc);
        // }
    }
    function initialiseSite(_body) {
        _body.innerHTML = "";
        let header = document.createElement("header");
        header.appendChild(document.createElement("nav"));
        _body.appendChild(header);
        let headline = document.createElement("h1");
        headline.classList.add("headline");
        _body.appendChild(headline);
    }
    function createNewElement(_onElement, _type, _source, _counter) {
        switch (_type) {
            case "image":
                let newImageElement = document.createElement("img");
                newImageElement.src = _source;
                _onElement.appendChild(newImageElement);
                break;
            case "text":
                let newParagrapgElement = document.createElement("p");
                newParagrapgElement.innerText = _source;
                _onElement.appendChild(newParagrapgElement);
                break;
            case "sound":
                let soundFile = new Audio(_source);
                soundFiles.push(soundFile);
                let soundButton = document.createElement("button");
                soundButton.innerText = "Play " + _source;
                soundButton.addEventListener("click", function () {
                    stopSounds();
                    soundFile.play();
                });
                _onElement.appendChild(soundButton);
                break;
            case "nav":
                let button = document.createElement("button");
                button.innerText = _source;
                button.addEventListener("click", function () { changeContent(_source); });
                if (_counter == currentPage) {
                    button.classList.add("current");
                }
                _onElement.appendChild(button);
                break;
            case "video":
                let video = document.createElement("video");
                video.src = _source;
                video.controls = true;
                video.width = 800;
                video.setAttribute("type", "video/mp4");
                _onElement.appendChild(video);
                break;
            default:
                console.log("Error! No data to create found with type: " + _type + " and source: " + _source + " on Element: " + _onElement);
                break;
        }
    }
    function createNav(_data) {
        let nav = document.querySelector("nav");
        nav.innerText = "";
        let backLink = document.createElement("a");
        backLink.href = "../";
        let backButton = document.createElement("button");
        backButton.innerText = "Zurück zur Übersicht";
        // backButton.addEventListener("click", function (): void {
        //     window.location.href = "../";
        // });
        backLink.appendChild(backButton);
        nav.appendChild(backLink);
        let div = document.createElement("div");
        div.classList.add("buttons");
        let i = 0;
        for (let navData of _data) {
            createNewElement(div, "nav", navData.headline, i);
            i++;
        }
        nav.appendChild(div);
    }
    function changeContent(_changeTo) {
        for (let i = 0; i < data[dataSourceString].length; i++) {
            if (data[dataSourceString][i].headline == _changeTo) {
                currentPage = i;
                stopSounds();
                // displayData();
                document.querySelector(".current")?.classList.remove("current");
                document.querySelector(".buttons")?.querySelectorAll("button")[currentPage].classList.add("current");
                let currentData = data[dataSourceString][currentPage];
                document.querySelector(".headline").innerText = currentData.headline;
                let contentDiv = document.querySelector(".content");
                if (!contentDiv) {
                    console.log("No Content Div!");
                }
                else {
                    contentDiv.innerHTML = "";
                    if (currentData.videoSource) {
                        createNewElement(contentDiv, "video", currentData.videoSource);
                    }
                    let textDiv = document.createElement("div");
                    textDiv.classList.add("texts");
                    for (let textContent of currentData.texts) {
                        createNewElement(textDiv, "text", textContent);
                    }
                    contentDiv.appendChild(textDiv);
                }
            }
        }
    }
    function stopSounds() {
        for (let i = 0; i < soundFiles.length; i++) {
            soundFiles[i].pause();
            soundFiles[i].currentTime = 0;
        }
    }
})(grundschule || (grundschule = {}));
//# sourceMappingURL=main.js.map