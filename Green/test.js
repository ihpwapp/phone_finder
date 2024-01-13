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

function showTop3(numCard = 3) {
  const brand = document.getElementById('brand').value
  const productType = document.getElementById('productType').value

  fetch("../phoneSpec.json")
    .then(response => response.json())
    .then(result => {
      let phoneBrand = result[brand];
      let phoneType = productType

      phoneTypeSorting(phoneBrand, phoneType)
      
      let card = document.getElementById("topProducts")

      // change price from usd to myr
      phoneBrand.forEach((phone) => {
        if (typeof phone['price_usd'] === "number") {
          phone['price_rm'] = `RM ${(phone['price_usd'] * 4.60).toFixed(2)}`
        }
      })

      card.innerHTML = ""; // clear previous content in card

      // create card (display top 3 result)
      let heading = document.createElement("h4")
      heading.classList.add("mb-4")
      heading.textContent = "Top 3 Results"

      card.appendChild(heading)

      phoneBrand.forEach((phone, index) => {
        if (index < numCard) { // Display only the top 'numCard' (3) results
          let cardItem = document.createElement("div");
          cardItem.classList.add("card", "mb-3", "mx-2");
          cardItem.style.maxWidth = "400px";

          let cardRow = document.createElement("div");
          cardRow.classList.add("row", "g-0");

          let cardImgCol = document.createElement("div");
          cardImgCol.classList.add("col-md-4");

          // Image
          let cardImg = document.createElement("img");
          getImg(phone['model']).then(imgUrl => { cardImg.src = imgUrl; });
          cardImg.classList.add("img-fluid", "rounded-start");
          cardImg.alt = phone['model'];

          cardImgCol.appendChild(cardImg);

          let cardContentCol = document.createElement("div");
          cardContentCol.classList.add("col-md-8");

          let cardBody = document.createElement("div");
          cardBody.classList.add("card-body");

          // Phone Model
          let cardTitle = document.createElement("h5");
          cardTitle.classList.add("card-title");
          cardTitle.innerText = phone['model'];

          // Phone Desc
          let cardTextRM = document.createElement("p");
          cardTextRM.classList.add("card-text");
          cardTextRM.innerText = "Price : " + phone['price_rm'];

          let cardTextSystemScore = document.createElement("p");
          cardTextSystemScore.classList.add("card-text");
          cardTextSystemScore.innerText = "System Score : " + phone['Score'];

          let cardTextnum_reviews = document.createElement("p");
          cardTextnum_reviews.classList.add("card-text");
          cardTextnum_reviews.innerText = "Number of Reviews : " + phone['num_reviews'];

          let cardTextRating = document.createElement("p");
          cardTextRating.classList.add("card-text");
          cardTextRating.innerText = "Number of Reviews : " + phone['rating'];

          cardBody.appendChild(cardTitle);
          cardBody.appendChild(cardTextRM);
          cardBody.appendChild(cardTextSystemScore);
          cardBody.appendChild(cardTextnum_reviews);
          cardBody.appendChild(cardTextRating);

          cardContentCol.appendChild(cardBody);

          cardRow.appendChild(cardImgCol);
          cardRow.appendChild(cardContentCol);

          cardItem.appendChild(cardRow);

          // Append the cardItem to the card element
          card.appendChild(cardItem);
        }
      });
    })
    .catch(error => console.log('error', error));
}

function phoneTypeSorting(phoneBrand, phoneType) {
  const data = phoneBrand
  const type = phoneType
  console.log(data, type)

  function calcScore_Battery(phone) {
    const ranges = [
      { min: 0, max: 3500, score: 1 },
      { min: 3501, max: 4500, score: 2 },
      { min: 4501, max: 5500, score: 3 },
      { min: 5501, max: 6500, score: 4 },
      { min: 6501, max: Infinity, score: 5 },
    ];

    const batteryString = phone['Capacity']
    if (batteryString === "") {
      return 1; // Return default score if there is no data
    }
    const batteryArray = batteryString.match(/\d+/g);
    const batteryNumber = batteryArray && batteryArray[0] ? batteryArray.map(Number)[0] : 0;

    // Find the range that the battery capacity falls into
    const range = ranges.find((range) => batteryNumber >= range.min && batteryNumber <= range.max);

    // Return the corresponding score
    return range.score
  }

  function calcScore_Weight(phone) {
    const ranges = [
      { min: 0, max: 150, score: 5 },
      { min: 151, max: 200, score: 4 },
      { min: 201, max: 250, score: 3 },
      { min: 251, max: 300, score: 2 },
      { min: 301, max: Infinity, score: 1 },
    ];

    const weightString = phone['Weight']
    if (weightString === "N/A") {
      return 1; // Return default score if there is no data
    }
    const weightArray = weightString.match(/\d+/g);
    const weightNumber = weightArray.map(Number)[0];

    // Find the range that the battery capacity falls into
    const range = ranges.find((range) => weightNumber >= range.min && weightNumber <= range.max);

    // Return the corresponding score
    return range.score; // Default score if no range is found
  }

  function calcScore_Weight_Rugged(phone) {
    const ranges = [
      { min: 0, max: 150, score: 1 },
      { min: 151, max: 200, score: 2 },
      { min: 201, max: 250, score: 3 },
      { min: 251, max: 300, score: 4 },
      { min: 301, max: Infinity, score: 5 },
    ];

    const weightString = phone['Weight']
    if (weightString === "N/A") {
      return 1; // Return default score if there is no data
    }
    const weightArray = weightString.match(/\d+/g);
    const weightNumber = weightArray.map(Number)[0];

    // Find the range that the battery capacity falls into
    const range = ranges.find((range) => weightNumber >= range.min && weightNumber <= range.max);

    // Return the corresponding score
    return range.score; // Default score if no range is found
  }

  function calcScore_Size(phone) {
    const ranges = [
      { min: 0, max: 5, label: 'Small' }, // should change with score
      { min: 5.1, max: 6, label: 'Medium' },
      { min: 6.1, max: 7, label: 'Large' },
      { min: 7.1, max: Infinity, label: 'Extra Large' },
    ];

    const sizeString = phone['Size']
    if (sizeString === "N/A") {
      return 1; // Return default score if there is no data
    }
    const sizeArray = sizeString.match(/(\d+(\.\d+)?)/);
    const sizeNumber = sizeArray ? parseFloat(sizeArray[0]) : null

    // Find the range that the battery capacity falls into
    const range = ranges.find((range) => sizeNumber >= range.min && sizeNumber <= range.max);

    // Return the corresponding score
    return range.score; // Default score if no range is found
  }

  function calcScore_RAM(phone) {
    const ranges = [
      { min: 0, max: 2, score: 1 },
      { min: 2.1, max: 4, score: 2 },
      { min: 4.1, max: 8, score: 3 },
      { min: 8.1, max: 16, score: 4 },
      { min: 16.1, max: Infinity, score: 5 },
    ];
  
    const ramString = phone['Built-in'];
    const ramArray = ramString.match(/(\d+(\.\d+)?)GB/);
    const ramNumber = ramArray && ramArray[1] ? parseFloat(ramArray[1]) : 0;
  
    // Find the range that the RAM size falls into
    const range = ranges.find((range) => ramNumber >= range.min && ramNumber <= range.max);
  
    // Return the corresponding score
    return range.score; // Default score if no range is found
  }
  
  function calcScore_RefreshRate(phone) {
    const ranges = [
      { min: 0, max: 30, score: 1 },
      { min: 30.1, max: 60, score: 2 },
      { min: 60.1, max: 90, score: 3 },
      { min: 90.1, max: 120, score: 4 },
      { min: 120.1, max: Infinity, score: 5 },
    ];
  
    const refreshString = phone['Extra Features'];
    if (refreshString === "N/A") {
      return 1; // Return default score if there is no data
    }
    const refreshArray = refreshString.match(/(\d+(\.\d+)?)Hz|\d+(\.\d+)?hertz/g);
    refreshNumber = refreshArray ? parseFloat(refreshArray[0].match(/(\d+(\.\d+)?)/)[0]) : 0;
  
    // Find the range that the refresh rate falls into
    const range = ranges.find((range) => refreshNumber >= range.min && refreshNumber <= range.max);
  
    // Return the corresponding score
    return range.score; // Default score if no range is found
  }

  function calcScore_CPU(phone) {
    function parseCPUString(cpuString) {
      // Regular expressions to extract information
      const clockSpeedsRegex = /(\d+(\.\d+)?) GHz/g;
      const coreCountRegex = /\b(single|dual|quad|hexa|hexa-core|octa|octa-core|deca|deca-core|multi)\b/i;

      const clockSpeedMatches = cpuString.match(clockSpeedsRegex);
      const coreCountMatches = cpuString.match(coreCountRegex);
    
      function extractCoreCount(match) {
        const numericValue = parseInt(match);
        if (!isNaN(numericValue)) {
          return numericValue;
        }

        const coreWords = {
          single: 1,
          dual: 2,
          quad: 4,
          hexa: 6,
          octa: 8,
          deca: 10,
          multi: 0 // Handle the "multi" case or any other words you want to map
        };

        const wordKey = match.toLowerCase();
        return coreWords[wordKey] || 0;
      }

      // Extract the actual core count
      const coreCount = coreCountMatches ? extractCoreCount(coreCountMatches[0]) : 0;

      // Create cpuDetails object
      const cpuDetails = {
        // architecture: architectureMatches ? architectureMatches.join(', ') : 'Unknown',
        clockSpeeds: clockSpeedMatches ? clockSpeedMatches.map(parseFloat) : [],
        coreCount: coreCount
      };
    
      return cpuDetails;
    }

    const cpuDetails = parseCPUString(phone['CPU'])

    const { clockSpeeds, coreCount } = cpuDetails;
  
    // const defaultArchitectureScore = 0.2;
    const defaultClockSpeedsScore = 0.2;
    const defaultCoreCountScore = 0.2;

    // let architectureScore = defaultArchitectureScore;
    let clockSpeedsScore = defaultClockSpeedsScore;
    let coreCountScore = defaultCoreCountScore;

    // Score calculation based on clock speeds
    const maxClockSpeed = clockSpeeds.length>0 ? Math.max(...clockSpeeds) : 1.2;

    const score = maxClockSpeed * coreCount

    const ranges = [
      { min: 0, max: 6, score: 1 },
      { min: 6.1, max: 12, score: 2 },
      { min: 12.1, max: 18, score: 3 },
      { min: 18.1, max: 24, score: 4 },
      { min: 24.1, max: Infinity, score: 5 },
    ];
  
    const range = ranges.find((range) => score >= range.min && score <= range.max);
  
    return range.score; // Default score if no range is found
  }

  function calcScore_Storage(phone) {
    const ranges = [
      { min: 0, max: 64, score: 1 },
      { min: 65, max: 128, score: 2 },
      { min: 129, max: 256, score: 3 },
      { min: 257, max: 512, score: 4 },
      { min: 513, max: Infinity, score: 5 },
    ];
  
    const storageString = phone['Built-in'];
    const storageArray = storageString.match(/(\d+)GB/g);
    // const storageArray = storageString.match(/(\d+(\.\d+)?)GB/);
    const storageNumber = storageArray && storageArray[0] ? parseFloat(storageArray[0]) : 0;

    // Find the range that the RAM size falls into
    const range = ranges.find((range) => storageNumber >= range.min && storageNumber <= range.max);
  
    // Return the corresponding score
    return range.score; // Default score if no range is found
  }

  function calcScore_Processor(phone) {      
    // REFER THIS FOR RATING FOR EACH PROCESSOR
    // https://nanoreview.net/en/soc-list/rating  
    let processorScore = 0 // base score

    const processorString = phone['Chipset'];
    // const processorArray = processorString.match(/\b(?:Cortex|Exynos|Snapdragon|Helio|Mediatek|Kirin|A6|A7|A8|A9|A10|A11|A12|A13|A14|A15|A16|Unisoc)\b/gi);

    if (processorString.toLowerCase().includes('mediatek') || processorString.toLowerCase().includes('mtk') || processorString.toLowerCase().includes('mt')) {
      const processorScores = {
        'Helio P35': 23,
        'Helio G80': 28,
        'Helio P22': 22,
        'Helio G35': 23,
        'Helio G99': 26,
        'Helio P95': 31,
        'Helio G96': 33,
        'Helio G90T': 34,
        'Helio G95': 36,
        'Helio G88': 36,
        'Helio G25': 22,
        'Helio A22': 21,
        'Helio G36': 23,
        'Helio G25': 22,
        'Helio G85': 28,
        'Helio P65': 26,
        'Helio G70': 27,
        'Helio G37': 27,
        'Helio A25': 21,
        'Dimensity 8050' : 58,
        'Dimensity 1000+' : 51,
        'Dimensity 1200' : 58,
        'Dimensity 1100' : 59,
        'Dimensity 900' : 43,
        'Dimensity 810' : 37,
        'Dimensity 700' : 36,
      };

      for (const processor in processorScores) {
        if (processorString.includes(processor)) {
          processorScore = processorScores[processor];
          break;
        }
      }
    }
    else if(processorString.toLowerCase().includes('qualcomm')) {
      const processorScores = {
        'Snapdragon 8 Gen 2': 93,
        'Snapdragon 8+ Gen 1': 82,
        'Snapdragon 8 Gen 1': 82,
        'Snapdragon 888': 67,
        'Snapdragon 778G': 67,
        'Snapdragon 730': 34,
        'Snapdragon 450': 20,
        'Snapdragon 730G': 35,
        'Snapdragon 680': 31,
        'Snapdragon 720G': 36,
        'Snapdragon 662': 27,
        'Snapdragon 665': 26,
        'Snapdragon 820': 26,
        'Snapdragon 630': 21,
        'Snapdragon 835': 32,
        'Snapdragon 865': 56,
        'Snapdragon 720G': 36,
        'Snapdragon 870': 59,
        'Snapdragon 685': 32,
        'Snapdragon 750': 39,
        'Snapdragon 732G': 37,
        'Snapdragon 855': 50,
        'Snapdragon 855+': 50,
        'Snapdragon 460': 24,
        'Snapdragon 690': 35,
        'Snapdragon 765G': 39,
        'Snapdragon 430': 15,
        'Snapdragon 632': 23,
        'Snapdragon 480': 22,
        'Snapdragon 820': 24,
        'Snapdragon 439': 22,
        'Snapdragon 678': 32,
        'Snapdragon 860': 50,
        'Snapdragon 636': 22,
      };

      for (const processor in processorScores) {
        if (processorString.includes(processor)) {
          processorScore = processorScores[processor];
          break;
        }
      }
    }
    else if(processorString.toLowerCase().includes('apple')) {
      const processorScores = {
        'A16 Bionic': 95,
        'A15 Bionic': 87,
        'A14 Bionic': 80,
        'A13 Bionic': 72,
        'A10 Fusion': 34,
        'A9': 27,
      };

      for (const processor in processorScores) {
        if (processorString.includes(processor)) {
          processorScore = processorScores[processor];
          break;
        }
      }
      console.log(processorString, processorScore)
    }
    else if(processorString.toLowerCase().includes('exynos')) {
      const processorScores = {
        'Exynos 2100': 65,
        'Exynos 990': 54,
        'Exynos 850': 26,
        'Exynos 1280': 40,
        'Exynos 850': 26,
        'Exynos 7904': 22,
        'Exynos 7884': 20,
        'Exynos 850': 26,
        'Exynos 9611': 27,
        'Exynos 7904': 22,
      };

      for (const processor in processorScores) {
        if (processorString.includes(processor)) {
          processorScore = processorScores[processor];
          break;
        }
      }
    }

    const score = processorScore / 20
    return score;
  }

  function calcScore_Protection(phone) {
    const protectionString = phone['Protection'];
    const lowerCaseProtection = protectionString.toLowerCase();

    const protectionScores = {
        'gorilla glass victus+': 5,
        'gorilla glass victus 2': 5,
        'gorilla glass 5': 4,
        'gorilla glass victus': 4,
        'gorilla glass 3+': 4,
        'ion-strengthened glass sapphire': 4,
        'ion-strengthened glass': 3,
        'scratch-resistant ceramic glass': 3,
        'scratch-resistant glass': 3,
        'corning gorilla glass 3': 3,
        'corning gorilla glass': 2,
    };

    // Check if the protectionString contains any keywords
    for (const keyword in protectionScores) {
      if (lowerCaseProtection.includes(keyword)) {
            return protectionScores[keyword];
        }
    }

    return 1; // Default score for unknown protection
  }

  function calcScore_FrontCamera(phone) {
    const frontCameraSpec = phone['Front'];

    const frontCameraRanges = [
      { min: 0, max: 3, score: 1 },
      { min: 3.1, max: 5, score: 2 },
      { min: 5.1, max: 8, score: 3 },
      { min: 8.1, max: 11, score: 4 },
      { min: 11.1, max: Infinity, score: 5 },
    ];

    const megapixelScores = {
      'dual 12 mp': 5,
      '10 mp': 5,
      '8 mp': 4,
      '5 mp': 3,
      '4 mp': 2,
      '1.2 mp' : 1,
    };
    
    // Function to calculate front camera score
    function scoreFrontCamera(frontCameraSpec) {
      const lowerCaseSpec = frontCameraSpec.toLowerCase();
      let totalScore = 0;

      // add score for megapixel
      for (const keyword in megapixelScores) {
          if (lowerCaseSpec.includes(keyword)) {
              totalScore += megapixelScores[keyword];
          }
      }

      // Add additional scoring logic for HDR, video capabilities, etc.
      if (lowerCaseSpec.includes('hdr')) { totalScore += 2; }
      if (lowerCaseSpec.includes('4k@24/25/30/60fps') || lowerCaseSpec.includes('1080p@30/60/120fps')) { totalScore += 3; }
      if (lowerCaseSpec.includes('4k@30/60fps') || lowerCaseSpec.includes('1080p@30/60fps')) { totalScore += 3; }
      if (lowerCaseSpec.includes('720p@30fps')) { totalScore += 2; }
      if (lowerCaseSpec.includes('face detection')) { totalScore += 3; }
      if (lowerCaseSpec.includes('gyro')) { totalScore += 3; }
      console.log(lowerCaseSpec, totalScore)

      // Map the total score to a range score
      const rangeScore = frontCameraRanges.find(range => totalScore >= range.min && totalScore <= range.max).score;
      return rangeScore;
    }

    const frontCameraScore = scoreFrontCamera(frontCameraSpec);
    return frontCameraScore
  }

  function calcScore_BackCamera(phone) {
    const backCamSpec = phone['Main'];

    const backCameraRanges = [
      { min: 0, max: 8, score: 1 },
      { min: 8.1, max: 16, score: 2 },
      { min: 16.1, max: 24, score: 3 },
      { min: 24.1, max: 32, score: 4 },
      { min: 31.1, max: Infinity, score: 5 },
    ];

    const megapixelScores = {
      '108 mp': 5,
      '64 mp': 4,
      '50 mp': 3,
      '33 mp': 2,
      '12 mp': 1,
    };

    const apertureScore = {
      'f/1.8': 5,
      'f/2.0': 4,
      'f/2.2': 3,
      'f/2.4': 2,
      'f/2.8': 1,
    }

    const hybridZoom = {
      '50x hybrid zoom' : 5,
      '3x hybrid zoom' : 2,
      '3x hybrid optical zoom' : 2,
    }

    const opticalZoom = {
      '10x optical zoom' : 5,
      '5x optical zoom' : 2.5,
      '3x optical zoom' : 1.5,
      '2.5x optical zoom' : 1.25,
      '2x optical zoom' : 1,
      '1.1x optical zoom' : 0.55,
    }

    const flash = {
      'qua-led' : 4,
      'dual-led' : 3,
      'dual-tone' : 3,
      'dual tone' : 3,
      'led flash' : 2,
    }

    // Function to calculate back camera score
    function scoreBackCamera(backCamSpec) {
      const lowerCaseSpec = backCamSpec.toLowerCase();
      let totalScore = 0;
    
      // add score for megapixel
      for (const keyword in megapixelScores) {
        if (lowerCaseSpec.includes(keyword)) {
          totalScore += megapixelScores[keyword];
        }
      }

      // add score for aperture
      for (const keyword in apertureScore) {
        if (lowerCaseSpec.includes(keyword)) {
          totalScore += apertureScore[keyword];
        }
      }

      // add score for hybrid zoom
      for (const keyword in hybridZoom) {
        if (lowerCaseSpec.includes(keyword)) {
          totalScore += hybridZoom[keyword];
        }
      }

      // add score for optical zoom
      for (const keyword in opticalZoom) {
        if (lowerCaseSpec.includes(keyword)) {
          totalScore += opticalZoom[keyword];
        }
      }

      // add score for flash
      for (const keyword in flash) {
        if (lowerCaseSpec.includes(keyword)) {
          totalScore += flash[keyword];
        }
      }

      // Add additional scoring logic for HDR, video capabilities, etc.
      if (lowerCaseSpec.includes('hdr')) { totalScore += 2; }
      if (lowerCaseSpec.includes('ultrawide')) { totalScore += 3; }
      if (lowerCaseSpec.includes('telephoto')) { totalScore += 3; }
      if (lowerCaseSpec.includes('macro')) { totalScore += 3; }
      if (lowerCaseSpec.includes('dual pixel pdaf')) { totalScore += 2; }
      if (lowerCaseSpec.includes('ois')) { totalScore += 2; }
      if (lowerCaseSpec.includes('super steady video')) { totalScore += 2; }
      if (lowerCaseSpec.includes('depth')) { totalScore += 2; }
      console.log(lowerCaseSpec, totalScore)

      // Map the total score to a range score
      const rangeScore = backCameraRanges.find(range => totalScore >= range.min && totalScore <= range.max).score;
      return rangeScore;
    }

    const backCameraScore = scoreBackCamera(backCamSpec);
    return backCameraScore
  }

  function calcScore_Reviews(phone) {
    // formula taken from this
    // https://math.stackexchange.com/questions/942738/algorithm-to-calculate-rating-based-on-multiple-reviews-using-both-review-score

    const averageRating = phone['rating'];
    const numReviews = phone['num_reviews'];

    let totalScore = 0;
    let totalWeight = 0;

    const weight = Math.sqrt(numReviews);
    totalScore += weight * averageRating;
    totalWeight += weight;

    if (totalWeight === 0) {
        return 0; // Avoid division by zero
    }

    const weightedAverage = totalScore / totalWeight;
    return weightedAverage;
  }

  // Calculate all scores
  if (type === 'all') {
    // do nothing
  }
  // ram, refresh rate, cpu, storage, processor, reviews, num of reviews
  else if (type === 'Gaming') {
    const weightRAM = 0.15;
    const weightRefresh = 0.15;
    const weightCPU = 0.2;
    const weightStorage = 0.25;
    const weightProcessor = 0.25;
    const weightReviews = 0.15;
  
    data.forEach((phone) => {
      const ram = calcScore_RAM(phone);
      const refresh = calcScore_RefreshRate(phone);
      const cpu = calcScore_CPU(phone);
      const storage = calcScore_Storage(phone);
      const processor = calcScore_Processor(phone);
      const reviews = calcScore_Reviews(phone)
      console.log(ram, refresh, cpu, storage, processor, reviews)
  
      // Calculate weighted scores
      const weightedRam = ram * weightRAM;
      const weightedRefresh = refresh * weightRefresh;
      const weightedCPU = cpu * weightCPU;
      const weightedStorage = storage * weightStorage;
      const weightedProcessor = processor * weightProcessor;
      const weightedReviews = reviews * weightReviews;

      // Calculate final weighted average score
      const finalScore= ((weightedRam + weightedRefresh + weightedCPU + weightedStorage + weightedProcessor + weightedReviews) /
                        (weightRAM + weightRefresh + weightCPU + weightStorage + weightProcessor + weightReviews))
                        .toFixed(2)

      phone['Score'] = finalScore;
    });
  }
  // battery, weight
  else if (type === 'LifeStyle') {
    const weightBattery = 0.5
    const weightWeight = 0.25
    const weightReviews = 0.25

    data.forEach((phone) => {
      const battery = calcScore_Battery(phone)
      const weight = calcScore_Weight(phone)
      const reviews = calcScore_Reviews(phone)

      // Calculate weighted scores
      const weightedBattery = battery * weightBattery;
      const weightedWeight = weight * weightWeight;
      const weightedReviews = reviews * weightReviews;

      // Calculate final weighted average score
      const finalScore= ((weightedBattery + weightedWeight + weightedReviews) /
                        (weightBattery + weightWeight + weightReviews))
                        .toFixed(2)

      phone['Score'] = finalScore;
    })
  }
  // rugged - battery, weight(higher = better for some reason), protection
  else if (type === 'Rugged') {
    const weightBattery = 0.5
    const weightWeight = 0.25
    const weightProtection = 0.5
    const weightReviews = 0.1

    data.forEach((phone) => {
      const battery = calcScore_Battery(phone)
      const weight = calcScore_Weight_Rugged(phone)
      const protection = calcScore_Protection(phone)
      const reviews = calcScore_Reviews(phone)

      // Calculate weighted scores
      const weightedBattery = battery * weightBattery;
      const weightedWeight = weight * weightWeight;
      const weightedProtection = protection * weightProtection;
      const weightedReviews = reviews * weightReviews;

      // Calculate final weighted average score
      const finalScore= ((weightedBattery + weightedWeight + weightedProtection + weightedReviews) /
                        (weightBattery + weightWeight + weightProtection + weightReviews))
                        .toFixed(2)

      phone['Score'] = finalScore;
    })
  }
  // front camera, back camera, battery
  else if (type === 'Camera') {
    data.forEach((phone) => {
      const weightBattery = 0.25
      const weightFront = 0.5
      const weightBack = 0.5
      const weightReviews = 0.1

      const battery = calcScore_Battery(phone)
      const front = calcScore_FrontCamera(phone)
      const back = calcScore_BackCamera(phone)
      const reviews = calcScore_Reviews(phone)

      // Calculate weighted scores
      const weightedBattery = battery * weightBattery;
      const weightedFront = front * weightFront;
      const weightedBack = back * weightBack;
      const weightedReviews = reviews * weightReviews;

      // Calculate final weighted average score
      const finalScore= ((weightedBattery + weightedFront + weightedBack + weightedReviews) /
                        (weightBattery + weightFront + weightBack + weightReviews))
                        .toFixed(2)

      phone['Score'] = finalScore;
    })
  }
  
  // Function to compare two phones based on their ratings
  function sortByScore(phone1, phone2) {
    return phone2.Score - phone1.Score;
  }
  data.sort(sortByScore);
}

function applyFilter(itemsPerPage = 5) {
  showTop3()
  const brand = document.getElementById('brand').value
  const productType = document.getElementById('productType').value

  fetch("../phoneSpec.json")
    .then(response => response.json())
    .then(result => {
      let phoneBrand = result[brand];
      let phoneType = productType

      phoneTypeSorting(phoneBrand, phoneType)
      
      // Create "Showing all results" heading
      let container = document.getElementById("filterContainer");
      let heading = container.querySelector("h4");

      if (!heading) {
        heading = document.createElement("h4");
        heading.classList.add("mb-4");
        heading.textContent = "Showing all results";
        container.insertBefore(heading, container.firstChild);
      } else {
        // If the heading already exists, update its text content
        heading.textContent = "Showing all results";
      }

      // change price from usd to myr
      phoneBrand.forEach((phone) => {
        if (typeof phone['price_usd'] === "number") {
          phone['price_rm'] = `RM ${(phone['price_usd'] * 4.60).toFixed(2)}`
        }
      })  

      // Create table
      let table = document.getElementById("filterProducts");

      table.innerHTML = ""; // clear previous content in table

      // Create a table header row
      const columnsToDisplay = ["Dimensions", "Weight", "Built-in", "Main", "Features", "Front", "Chipset", "rating", "num_reviews"]

      let tableHeaders = Object.keys(phoneBrand[0]); // get table headers
      let headerRow = table.insertRow();

      // Calculate pagination
      let totalPages = Math.ceil(phoneBrand.length / itemsPerPage);
      let currentPage = 1;

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

      // Function to update the table based on the current page
      function updateTable() {
        let startIndex = (currentPage - 1) * itemsPerPage;
        let endIndex = startIndex + itemsPerPage;

        // Clear previous content from the table
        table.innerHTML = "";

        // Create table header row
        headerRow = table.insertRow();

        // image header
        let thImage = document.createElement("th")
        thImage.textContent = "Image"
        headerRow.appendChild(thImage)

        // model header
        let thModel = document.createElement("th")
        thModel.textContent = "Model"
        headerRow.appendChild(thModel)

        // score header
        if (phoneType !== "all"){
          let thScore = document.createElement("th")
          thScore.textContent = "Score"
          headerRow.appendChild(thScore)
        }

        // price in RM header
        let thPrice = document.createElement("th")
        thPrice.textContent = "Price(RM)"
        headerRow.appendChild(thPrice)

        tableHeaders.forEach(header => {
          if (columnsToDisplay.includes(header)) {
            let th = document.createElement("th");
            // Change header name
            if (header === "rating"){
              th.textContent = "Rating"
            }
            else if (header === "num_reviews"){
              th.textContent = "No. of Reviews"
            }
            else if (header === "Main"){
              th.textContent = "Back Camera"
            }
            else if (header === "Front"){
              th.textContent = "Front Camera"
            }
            else {
              th.textContent = header;
            }
            headerRow.appendChild(th);
          }
        });

        // let thButton = document.createElement("th")
        // thButton.textContent = "Details"
        // headerRow.appendChild(thButton)

        // Create table rows with data for the current page
        phoneBrand.slice(startIndex, endIndex).forEach(phone => {
          let row = table.insertRow();
        
          // Image column
          let imgCell = row.insertCell();
          let phoneImg = document.createElement("img")
          phoneImg.style.height = '150px'
          phoneImg.style.width = '150px'
          getImg(phone['model'])
          .then(imgUrl => {
            phoneImg.src = imgUrl;
            imgCell.appendChild(phoneImg);
          });
          imgCell.appendChild(phoneImg)

          // Model column
          let modelCell = row.insertCell();
          modelCell.textContent = phone['model'];

          // Score column
          if (phoneType !== "all"){
            let scoreCell = row.insertCell();
            let scoreProgress = document.createElement("div")

            scoreCell.textContent = phone['Score'];
          }

          // Price column
          let scoreCell = row.insertCell();
          scoreCell.textContent = phone['price_rm'];

          // The rest of the data
          tableHeaders.forEach(column => {
            if (columnsToDisplay.includes(column)) {
              let cell = row.insertCell();
              cell.textContent = phone[column];
            }
          });
        
          // Create Button for each row
          // let btnCell = row.insertCell();
          // let btnDetails = document.createElement("button");
          // btnDetails.textContent = "Details";
          // btnDetails.type = "button";
          // btnDetails.className = "btn btn-primary";
          // btnCell.appendChild(btnDetails);
        });
      }

      // Function to create pagination button
      function createPaginationButton(value) {
        let button = document.createElement("li");
        button.classList.add("page-item");

        let link = document.createElement('a');
        link.classList.add("page-link");
        link.href = "#filterContainer";
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

function getImg(phoneName) {
  const searchUrl = `https://images.search.yahoo.com/search/images?p=${phoneName}+phone;`;

  return fetch(searchUrl)
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const imageElements = doc.querySelectorAll('img.process');

      if (imageElements.length > 0) {
        const firstImageUrl = imageElements[2].getAttribute('data-src');
        return firstImageUrl;
      } else {
        console.error('No images found on the search page.');
        return null;  // or any other default value or error handling
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;  // or any other default value or error handling
    });
}