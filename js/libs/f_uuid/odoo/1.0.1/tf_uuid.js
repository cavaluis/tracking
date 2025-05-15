const tallyElements = [
    document.querySelector("iframe[data-tally-src], iframe[src*='tally.co'], iframe[src*='tally.com']"),
    document.querySelector("[data-tally-open]"),
    document.querySelector("a[href*='tally-open=']")
];
const tallyElement = tallyElements.find(el => el !== null);

if (tallyElement) {
    const uniqueId = uuidv4();
    const url = new URL(window.location.href);
    url.searchParams.set("src", uniqueId);
    window.history.replaceState({}, '', url);
    console.log("Se actualiz車 la URL con el par芍metro src:", uniqueId);
}

function uuidv4() {
   return uuid.v4();
}
