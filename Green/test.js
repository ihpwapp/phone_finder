/*
fetch("../phoneSpec.json")
  .then(response => response.json())
  .then(result => {
    //console.log(result)//dapatkan output json
    //console.log(result.Samsung)//dapatkan output untuk samsung file
    //console.log(result.Samsung[0])//dapatkan output untuk samsung file
    result.Samsung.forEach(item=> {
      //console.log(item.model)
      //console.log(item) // dapatkan semua jenis model yang ad
      if(item.model == "Galaxy Z Fold 5"){ //kalau nk check terus sbijik
        console.log(item)
      }
      if (item.model.includes("S22")) { // kalau nk cari yg ad perkataan sama
        console.log(item);
      }
    })
  })
  .catch(error => console.log('error', error));
*/


const brands = [
  "Samsung", "Apple", "Huawei", "Oppo",
  "Sony", "Xiaomi", "OnePlus", "Vivo", "Honor",
  "Realme", "Nokia","Infinix"
];

// Function to populate the brand select options
function populateBrandOptions() {
    const brandSelect = document.getElementById('brand');

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand;
        option.text = brand;
        brandSelect.appendChild(option);
    });
}

// Call the function to populate options when the page loads
window.onload = populateBrandOptions;

function updatePriceCategory() {
  const priceRange = document.getElementById('priceRange').value;
  const priceCategoryField = document.getElementById('priceCategory');

  if (priceRange < 250) {
      priceCategoryField.value = 'Cheap';
  } else if (priceRange < 500) {
      priceCategoryField.value = 'Moderate';
  } else if (priceRange < 750) {
      priceCategoryField.value = 'Expensive';
  } else {
      priceCategoryField.value = 'Overpriced';
  }
}

function applyFilter(elementId){
  const selectedBrand = document.getElementById(elementId).value;
  getPhone(selectedBrand)
}

function getPhone(brand, itemsPerPage = 5) {
  fetch("../phoneSpec.json")
    .then(response => response.json())
    .then(result => {
      let phoneBrand = result[brand];

      // Create table
      let table = document.getElementById("filterProducts");

      table.innerHTML = ""; // clear previous content in table

      // Create a table header row
      let tableHeaders = Object.keys(phoneBrand[0]);
      let headerRow = table.insertRow();
      tableHeaders.forEach(header => {
        let th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Calculate pagination
      let totalPages = Math.ceil(phoneBrand.length / itemsPerPage);
      let currentPage = 1;

      // Function to update the table based on the current page
      function updateTable() {
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        // Clear previous content from the table
        table.innerHTML = "";

        // Create table header row
        headerRow = table.insertRow();
        tableHeaders.forEach(header => {
          let th = document.createElement("th");
          th.textContent = header;
          headerRow.appendChild(th);
        });

        // Create table rows with data for the current page
        phoneBrand.slice(startIndex, endIndex).forEach(phone => {
          let row = table.insertRow();
          tableHeaders.forEach(header => {
            let cell = row.insertCell();
            cell.textContent = phone[header];
          });
        });
      }

      // Pagination controls (next, previous, page buttons)
      let page = document.querySelector('.pagination');

      // Reset page number setiap kali filter baru
      while (page.firstChild) {
        page.removeChild(page.firstChild);
      }

      // Previous Button
      let prevButton = createPaginationButton('Previous');
      page.appendChild(prevButton);

      // Page Numbers
      for (let i = 1; i <= totalPages; i++) {
        let pageList = createPaginationButton(i);
        pageList.classList.toggle("active", i === currentPage);
        page.appendChild(pageList);
      }

      // Next Button
      let nextButton = createPaginationButton('Next');
      page.appendChild(nextButton);

      // Event listener for pagination buttons
      page.addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
          const buttonValue = event.target.textContent;
          if (buttonValue === 'Previous') {
            if (currentPage > 1) {
              currentPage--;
              updateTable();
            }
          } else if (buttonValue === 'Next') {
            if (currentPage < totalPages) {
              currentPage++;
              updateTable();
            }
          } else {
            currentPage = parseInt(buttonValue);
            updateTable();
          }

          // Update pagination buttons
          updatePaginationButtons();
        }
      });

      // Function to create pagination button
      function createPaginationButton(value) {
        let button = document.createElement("li");
        button.classList.add("page-item");

        let link = document.createElement('a');
        link.classList.add("page-link");
        link.href = "#";
        link.textContent = value;

        button.appendChild(link);
        return button;
      }

      // Function to update the active state of pagination buttons
      function updatePaginationButtons() {
        document.querySelectorAll('.pagination li').forEach(function (item) {
          item.classList.toggle('active', item.textContent === String(currentPage));
        });
      }

      // Initial table update
      updateTable();
    })
    .catch(error => console.log('error', error));
}

// Web Scraping Image
const query = 'iphone 12'; // Example Search Query

// Yahoo Image Search URL
const searchUrl = `https://images.search.yahoo.com/search/images?p=${query}+phone;`
// Fetching HTML from Yahoo Image Searchs
fetch(searchUrl)
  .then(response => response.text())
  .then(html => {
    // Parse the HTML to extract image URLs (this part depends on the structure of Yahoo's search results page)
    // Example: Assuming image URLs are within <img> tags with class "process"
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const imageElements = doc.querySelectorAll('img.process');

    // Extract and log the first image URL
    if (imageElements.length > 0) {
        console.log(imageElements[0]) //html
        const firstImageUrl = imageElements[2].getAttribute('data-src'); // get image link
        console.log('First image URL:', firstImageUrl);
    } else {
        console.error('No images found on the search page.');
    }
  })
  .catch(error => console.error('Error fetching data:', error));