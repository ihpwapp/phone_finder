
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
let tableBrand = document.querySelector('.brandTable');
let tableData = `<tr class="bg-light">`;
let counter = 0;

async function fetchAndAppendImages() {
    for (const brand of brands) {
        try {
            const result = await getImg(brand);
            tableData += `<td><a href="https://${brand}.com" target="__blank"><img src="${result}" alt="Image 1"></a></td>`;
        } catch (error) {
            console.error(`Error fetching image for ${brand}:`, error);
        }

        counter++;
        if (counter >= 3) {
            tableData += `</tr>`;
            tableBrand.insertAdjacentHTML('beforeend', tableData);
            counter = 0;
            tableData = `<tr class="bg-light">`;
        }
    }
    let cc = document.querySelector(".loading")
    cc.classList.add('d-none');
    tableBrand.classList.remove('d-none');
    // Check if there are remaining items to append
    if (counter > 0) {
        tableData += `</tr>`;
        console.log(tableData);
        tableBrand.insertAdjacentHTML('beforeend', tableData);
    }
}

fetchAndAppendImages();

