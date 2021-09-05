namespace grundschule {

    interface SiteData {
        headline: string;
        isTitle: boolean;
        imageSources: string[];
        texts: string[];
        soundSources: string[];
        videoSource: string;
    }
    interface Data {
        [category: string]: SiteData[];
    }

    enum PAGE_NAME {
        FÄCHER,
        KLASSENRAUM,
        TURNHALLE,
        MUSIKRAUM,
        MENSA,
        SCHULHOF,
        TOILETTEN,
        MALRAUM
    }

    let data: Data;
    let dataSource: string = "../data/subjects.json";
    let dataSourceString: string = "subjects";

    let currentPage: PAGE_NAME = PAGE_NAME.FÄCHER;

    let soundFiles: HTMLAudioElement[] = [];

    document.addEventListener("DOMContentLoaded", handleLoad);

    async function handleLoad(_event: Event): Promise<void> {
        if (await getData())
            displayData();
        else
            alert("No data, no Output!");
    }

    async function getData(): Promise<boolean> {
        let response: Response = await fetch(dataSource);

        if (response) {
            let stringData: string = await response.text();
            data = JSON.parse(stringData);
            console.log(data);
            return true;
        } else {
            console.log("No data found!");
            return false;
        }
    }

    function displayData(): void {
        let body: HTMLBodyElement = document.querySelector("body")!;
        initialiseSite(body);

        let categoryData: SiteData[] = data[dataSourceString];
        createNav(categoryData);
        let currentData: SiteData = categoryData[currentPage];
        document.querySelector("h1")!.innerText = currentData.headline;
        console.log(currentData);

        // for (let imageSrc of currentData.imageSources) {
        //     createElement(body, "image", imageSrc);
        // }
        let contentDiv: HTMLDivElement = document.createElement("div");
        contentDiv.classList.add("content");
        if (currentData.videoSource) {
            createNewElement(contentDiv, "video", currentData.videoSource);
        }
        let div: HTMLDivElement = document.createElement("div");
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

    function initialiseSite(_body: HTMLBodyElement): void {
        _body.innerHTML = "";

        let header: HTMLElement = document.createElement("header");
        header.appendChild(document.createElement("nav"));
        _body.appendChild(header);

        let headline: HTMLHeadingElement = document.createElement("h1");
        headline.classList.add("headline");
        _body.appendChild(headline);
    }

    function createNewElement(_onElement: HTMLElement, _type: string, _source: string, _counter?: number): void {
        switch (_type) {
            case "image":
                let newImageElement: HTMLImageElement = document.createElement("img");
                newImageElement.src = _source;
                _onElement.appendChild(newImageElement);
                break;

            case "text":
                let newParagrapgElement: HTMLParagraphElement = document.createElement("p");
                newParagrapgElement.innerText = _source;
                _onElement.appendChild(newParagrapgElement);
                break;

            case "sound":
                let soundFile: HTMLAudioElement = new Audio(_source);
                soundFiles.push(soundFile);
                let soundButton: HTMLButtonElement = document.createElement("button");
                soundButton.innerText = "Play " + _source;
                soundButton.addEventListener("click", function (): void {
                    stopSounds();
                    soundFile.play();
                });
                _onElement.appendChild(soundButton);
                break;

            case "nav":
                let button: HTMLButtonElement = document.createElement("button");
                button.innerText = _source;
                button.addEventListener("click", function (): void { changeContent(_source); });
                if (_counter == currentPage) {
                    button.classList.add("current");
                }
                _onElement.appendChild(button);
                break;
            case "video":
                let video: HTMLVideoElement = document.createElement("video");
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

    function createNav(_data: SiteData[]): void {
        let nav: HTMLElement = document.querySelector("nav")!;
        nav.innerText = "";
        let backLink: HTMLAnchorElement = document.createElement("a");
        backLink.href = "../";

        let backButton: HTMLButtonElement = document.createElement("button");
        backButton.innerText = "Zurück zur Übersicht";
        // backButton.addEventListener("click", function (): void {
        //     window.location.href = "../";
        // });
        backLink.appendChild(backButton);
        nav.appendChild(backLink);

        let div: HTMLDivElement = document.createElement("div");
        div.classList.add("buttons");

        let i: number = 0;
        for (let navData of _data) {
            createNewElement(div, "nav", navData.headline, i);
            i++;
        }
        nav.appendChild(div);
    }

    function changeContent(_changeTo: string): void {
        for (let i: number = 0; i < data[dataSourceString].length; i++) {
            if (data[dataSourceString][i].headline == _changeTo) {
                currentPage = i;
                stopSounds();

                // displayData();
                document.querySelector(".current")?.classList.remove("current");
                document.querySelector(".buttons")?.querySelectorAll("button")[currentPage].classList.add("current");

                let currentData: SiteData = data[dataSourceString][currentPage];
                document.querySelector<HTMLHeadingElement>(".headline")!.innerText = currentData.headline;

                let contentDiv: HTMLDivElement | null = document.querySelector<HTMLDivElement>(".content");
                if (!contentDiv) {
                    console.log("No Content Div!");
                }
                else {
                    contentDiv.innerHTML = "";

                    if (currentData.videoSource) {
                        createNewElement(contentDiv, "video", currentData.videoSource);
                    }
                    let textDiv: HTMLDivElement = document.createElement("div");
                    textDiv.classList.add("texts");
                    for (let textContent of currentData.texts) {
                        createNewElement(textDiv, "text", textContent);
                    }
                    contentDiv.appendChild(textDiv);

                }
            }
        }
    }

    function stopSounds(): void {
        for (let i: number = 0; i < soundFiles.length; i++) {
            soundFiles[i].pause();
            soundFiles[i].currentTime = 0;
        }
    }


}