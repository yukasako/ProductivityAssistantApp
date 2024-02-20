const getQuote = async () => {
    try {
        const res = await fetch("https://api.quotable.io/random?maxLength=75?");
        const data = await res.json();
        if (!data || !data.content) {
            throw new Error("Could not retrieve data.");
        }
        const quote = data.content;

        let quoteH2 = document.createElement("h2");
        quoteH2.innerText = quote;
        greeting.appendChild(quoteH2);

    } catch (error) {
        console.error("Error fetching quote:", error);
    }
}

getQuote();

