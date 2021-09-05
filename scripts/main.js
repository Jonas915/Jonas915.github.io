"use strict";
var grundschule;
(function (grundschule) {
    let PageName;
    (function (PageName) {
        PageName[PageName["R\u00E4ume"] = 0] = "R\u00E4ume";
        PageName[PageName["Klassenraum"] = 1] = "Klassenraum";
        PageName[PageName["Turnhalle"] = 2] = "Turnhalle";
        PageName[PageName["Musikraum"] = 3] = "Musikraum";
        PageName[PageName["Mensa"] = 4] = "Mensa";
        PageName[PageName["Schulhof"] = 5] = "Schulhof";
        PageName[PageName["Toiletten"] = 6] = "Toiletten";
        PageName[PageName["Malraum"] = 7] = "Malraum";
    })(PageName || (PageName = {}));
    let data;
    let dataSource = "../data/rooms.json";
    let currentPage = PageName.Räume;
    let htmlH1;
    let htmlImages;
    let htmlTexts;
    document.addEventListener("DOMContentLoaded", handleLoad);
    function handleLoad(_event) {
        htmlH1 = document.querySelector("h1");
        htmlImages = document.querySelectorAll("img");
        htmlTexts = document.querySelectorAll("p");
        if (getData())
            displayData();
        else
            alert("No data, no Output!");
    }
    async function getData() {
        let response = await fetch(dataSource);
        if (response) {
            let stringData = await response.text();
            data = JSON.parse(stringData);
            return true;
        }
        else {
            console.log("No data found!");
            return false;
        }
    }
    function displayData() {
        let currentData = data[currentPage].rooms;
        htmlH1.innerText = currentData.headline;
        let i = 0;
        for (let imageSrc of currentData.imageSources) {
            htmlImages[i].src = imageSrc;
            i++;
        }
        i = 0;
        for (let textContent of currentData.texts) {
            htmlTexts[i].innerText = textContent;
            i++;
        }
    }
})(grundschule || (grundschule = {}));
//# sourceMappingURL=main.js.map