const quizData = [
    {
        question: 'How important is having a high-performance processor for you?',
        options: ['Not Important', 'Important', 'Very Important']
    },
    {
        question: 'How important are camera capabilities for you?',
        options: ['Not Important', 'Important', 'Very Important']
    },
    {
        question: 'Do you mainly use your phone indoors?',
        options: ['Yes', 'No']
    },
    {
        question: 'What is your preferred storage capacity for a phone?',
        options: ['64GB or less', '128GB or more']
    },
    {
        question: 'Is having a high display rate important for you?',
        options: ['Yes', 'No']
    },
    {
        question: 'What is your preferred RAM size for a phone?',
        options: ['8GB',  '16GB or more']
    },
    {
        question: 'How crucial is battery life for you?',
        options: ['Not Important', 'Important', 'Very Important']
    },
    {
        question: 'How important is the weight of the phone for you?',
        options: ['Not Important', 'Important', 'Very Important']
    }
];

const resultCategories = ['Gaming Phone', 'Lifestyle Phone', 'Rugged Phone', 'Camera Phone'];
const resultImages = {
    'Gaming Phone': 'assets/img/gaming.jpg',
    'Lifestyle Phone': 'assets/img/lifestyle.jpg',
    'Rugged Phone': 'assets/img/rugged.jpg',
    'Camera Phone': 'assets/img/camera.jpg',
};

let currentQuestion = 0;
let userAnswers = [];

function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    questionElement.textContent = quizData[currentQuestion].question;

    optionsElement.innerHTML = '';
    quizData[currentQuestion].options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index, option));
        optionsElement.appendChild(optionElement);
    });
}

function selectOption(index, option) {
    userAnswers[currentQuestion] = option;
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.style.backgroundColor = ''); // Reset background color
    options[index].style.backgroundColor = '#198754'; // Highlight selected option
}

function redirectToAnotherPage() { window.location.href = 'test.html'; }

function nextQuestion() {
    if (userAnswers[currentQuestion] === undefined) {
        alert('Please select an option before moving to the next question.');
        return;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function prevQuestion() {
    currentQuestion--;

    var previousAnswer = userAnswers[currentQuestion];
    console.log('Previous Answer:', previousAnswer);

    if (currentQuestion >= 0) {
        loadQuestion();
    } else {
        // Handle the case where the user is already at the first question/page
        // You can choose to do nothing, go to a specific page, or wrap around to the last page, for example.
        // Example: currentQuestion = quizData.length - 1;
    }
}

function showResult() {
    const resultElement = document.getElementById('result');
    const resultImageContainer = document.getElementById('resultImageContainer');
    const resultImageElement = document.getElementById('resultImage');
    let score = []

    // Push answers into an array
    userAnswers.forEach(answer => {
        score.push(answer)
    })

    const questionKeys = [
        'processorImportance',
        'cameraImportance',
        'useIndoors',
        'storagePreference',
        'displayRefreshRate',
        'ramPreference',
        'batteryLife',
        'weight',
    ];

    const userInput = score.reduce((acc, answer, index) => {
        acc[questionKeys[index]] = answer;
        return acc;
    }, {});

    const resultCategory = determinePhoneType(userInput)

    resultElement.textContent = `Phone Type : ${resultCategory}`;
    resultImageElement.src = resultImages[resultCategory];
    resultImageElement.alt = `${resultCategory} Image`;
    resultImageElement.style.display = 'block'; // Show the image
    showResetButton(); // Call function to show the reset button
}

function showResetButton() {
    document.getElementById('prevBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'inline-block';             
     document.getElementById('additionalBtn').style.display = 'inline-block';
}

function resetQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    loadQuestion();
    document.getElementById('result').textContent = '';
    document.getElementById('prevBtn').style.display = 'inline-block';
    document.getElementById('nextBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('resultImage').src = '';
    document.getElementById('resultImage').alt = 'Result Image';
    document.getElementById('resultImage').style.display = 'none'; // Hide the image again
    document.getElementById('additionalBtn').style.display = 'none';

}

function determinePhoneType(answers) {
    const types = [
        {
            name: 'Gaming Phone',
            conditions: {
                processorImportance: ['Very Important', 'Important'],
                cameraImportance: ['Not Important', 'Important'],
                useIndoors: 'Yes',
                storagePreference: '128GB or more',
                displayRefreshRate: 'Yes',
                ramPreference: '16GB or more',
                batteryLife: ['Very Important', 'Important'],
                weight: 'Not Important'
            }
        },
        {
            name: 'Lifestyle Phone',
            conditions: {
                processorImportance: ['Very Important', 'Important'],
                cameraImportance: ['Very Important', 'Important'],
                useIndoors: ['Yes', 'No'],
                storagePreference: '128GB or more',
                displayRefreshRate: ['Yes', 'No'],
                ramPreference: '16GB or more',
                batteryLife: ['Very Important', 'Important'],
                weight: ['Important', 'Very Important']
            }
        },
        {
            name: 'Rugged Phone',
            conditions: {
                processorImportance: ['Important', 'Not Important'],
                cameraImportance: ['Not Important', 'Important'],
                useIndoors: 'No',
                storagePreference: ['64GB or more', '128GB or more'],
                displayRefreshRate: 'No',
                ramPreference: ['16GB or more', '8GB or more'],
                batteryLife: ['Very Important', 'Important'],
                weight: 'Not Important'
            }
        },
        {
            name: 'Photography Phone',
            conditions: {
                processorImportance: ['Important', 'Not Important'],
                cameraImportance: ['Very Important', 'Important'],
                useIndoors: ['Yes', 'No'],
                storagePreference: '128GB or more',
                displayRefreshRate: 'Very Important',
                ramPreference: '16GB or more',
                batteryLife: ['Very Important', 'Important'],
                weight: ['Very Important', 'Important']
            }
        }
    ];

    // Calculate similarity scores
    const similarityScores = types.map(type => {
        const conditions = type.conditions;
        const score = Object.keys(conditions).reduce((acc, key) => {
            const userAnswer = answers[key];
            const condition = conditions[key];

            if (Array.isArray(condition)) {
                // If the condition is an array, check if the user's answer is in the array
                if (condition.includes(userAnswer)) {
                    return acc + 1;
                }
            } else {
                // If the condition is a single value, check for an exact match
                if (condition === userAnswer) {
                    return acc + 1;
                }
            }

            return acc;
        }, 0);

        return { type: type.name, score };
    });

    // Find the type with the highest similarity score
    console.log(similarityScores)
    const maxScoreType = similarityScores.reduce((max, current) => (current.score > max.score ? current : max), similarityScores[0]);

    if (maxScoreType.score === 0) {
        return 'Unknown'; // No type matched, return a default value
    }

    return maxScoreType.type;
}

// Initial load
loadQuestion();