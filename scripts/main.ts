namespace grundschule {

    interface SiteData {
        headline: string;
        isTitle: boolean;
        imageSources: string[];
        texts: string[];
        soundSources: string[];
    }
    interface Data {
        [category: string]: SiteData;
    }

    enum PageName {
        Räume,
        Klassenraum,
        Turnhalle,
        Musikraum,
        Mensa,
        Schulhof,
        Toiletten,
        Malraum
    }

    let data: Data[];
    let dataSource: string = "../data/rooms.json";

    let currentPage: PageName = PageName.Räume;

    let htmlH1: HTMLHeadingElement;
    let htmlImages: NodeListOf<HTMLImageElement>;
    let htmlTexts: NodeListOf<HTMLParagraphElement>;

    document.addEventListener("DOMContentLoaded", handleLoad);

    function handleLoad(_event: Event): void {
        htmlH1 = <HTMLHeadingElement>document.querySelector("h1");
        htmlImages = document.querySelectorAll("img");
        htmlTexts = document.querySelectorAll("p");

        if (getData())
            displayData();
        else 
            alert("No data, no Output!");
    }

    async function getData(): Promise<boolean> {
        let response: Response = await fetch(dataSource);

        if (response) {
            let stringData: string = await response.text();
            data = JSON.parse(stringData);
            return true;
        } else {
            console.log("No data found!");
            return false;
        }
    }

    function displayData(): void {
        let currentData: SiteData = data[currentPage].rooms;
        htmlH1.innerText = currentData.headline;

        let i: number = 0;
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


}