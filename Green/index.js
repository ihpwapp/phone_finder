function getImg(phoneBrand) {
    return (async () => {
        const searchUrl = `https://images.search.yahoo.com/search/images?p=${phoneBrand}+logo;`

        try {
            // Fetching HTML from Yahoo Image Search
            const response = await fetch(searchUrl);
            const html = await response.text();

            // Parse the HTML to extract image URLs
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const imageElements = doc.querySelectorAll('img.process');

            // Extract and log the first image URL
            if (imageElements.length > 0) {
                const firstImageUrl = imageElements[0].getAttribute('data-src');
                return firstImageUrl;
            } else {
                console.error('No images found on the search page.');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    })();
}

const brands = [
    "Samsung", "Apple", "Huawei", "Oppo",
    "Sony", "Xiaomi", "OnePlus", "Vivo", "Honor",
    "Realme", "Nokia", "Infinix"
];

// ade bug kat sini but idgaf
async function appendSlide(brand) {
    const slideDiv = document.createElement("div")
    slideDiv.classList.add("swiper-slide")

    const slideImg = document.createElement("img")
    slideImg.classList.add("img-fluid")

    try {
        const imgUrl = await getImg(brand);
        slideImg.src = imgUrl;
        slideDiv.appendChild(slideImg);
    } catch (error) {
        console.error(`Error fetching image for ${brand}: ${error.message}`);
    }

    slide.appendChild(slideDiv)
}

const slide = document.getElementById('slideBrand');

brands.forEach(phone => {
   appendSlide(phone)
})