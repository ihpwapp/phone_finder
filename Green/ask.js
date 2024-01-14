const quizData = [
    {
        question: 'How important is having a high-performance processor for you?',
        options: ['Not Important', 'Semi-Important', 'Important', 'Very Important']
    },
    {
        question: 'How important are camera capabilities for you?',
        options: ['Not Important', 'Semi-Important', 'Important', 'Very Important']
    },
    {
        question: 'Where do you mainly use your phone?',
        options: ['Indoors', 'Outdoors', 'Both']
    },
    {
        question: 'What is your preferred storage capacity for a phone?',
        options: ["I don't mind", '64GB or less', '128GB', '256GB and above']
    },
    {
        question: 'Is having a high display rate important for you?',
        options: ['No', 'Yes']
    },
    {
        question: 'What is your preferred RAM size for a phone?',
        options: ["I don't mind", '8GB or less',  '16GB or more']
    },
    {
        question: 'How much you use your phone daily?',
        options: ['I rarely use my phone', 'I use it occasionally', 'I use it a lot']
    },
    {
        question: 'Do you mind getting heavy phones (heavier = more durable)?',
        options: ['Light phones', 'Heavy phones']
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
        'dailyUses',
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
                processorImportance: { values: ['Very Important', 'Important'], weight: 1.5 },
                cameraImportance: { values: ['Not Important', 'Semi-Important'], weight: 1.0 },
                useIndoors: { values: ['Indoors'], weight: 1.3 },
                storagePreference: { values: ['128GB', '256GB and above'], weight: 1.3 },
                displayRefreshRate: { values: ['Yes'], weight: 1.2 },
                ramPreference: { values: ['16GB or more'], weight: 1.4 },
                dailyUses: { values: ['I use it a lot'], weight: 1.3 },
                weight: { values: ['Light phones'], weight: 1.0 },
            }
        },
        {
            name: 'Lifestyle Phone',
            conditions: {
                processorImportance: { values: ['Not Important', 'Semi-Important'], weight: 1.2 },
                cameraImportance: { values: ['Not Important', 'Semi-Important'], weight: 1.2 },
                useIndoors: { values: ['Indoors', 'Outdoors', 'Both'], weight: 1.3 },
                storagePreference: { values: ["I don't mind"], weight: 1.3 },
                displayRefreshRate: { values: ['No'], weight: 1.0 },
                ramPreference: { values: ["I don't mind"], weight: 1.3 },
                dailyUses: { values: ['I use it occasionally'], weight: 1.7 },
                weight: { values: ['Light phones'], weight: 1.0 },
            }
        },
        {
            name: 'Rugged Phone',
            conditions: {
                processorImportance: { values: ['Semi-Important', 'Not Important'], weight: 1.2 },
                cameraImportance: { values: ['Not Important', 'Semi-Important'], weight: 1.2 },
                useIndoors: { values: ['Outdoors'], weight: 2.0 },
                storagePreference: { values: ["I don't mind", '64GB or less'], weight: 1.1 },
                displayRefreshRate: { values: ['No'], weight: 1.0 },
                ramPreference: { values: ["I don't mind"], weight: 1.0 },
                dailyUses: { values: ['I rarely use my phone', 'I use it occasionally'], weight: 1.0 },
                weight: { values: ['Heavy phones'], weight: 1.5 },
            }
        },
        {
            name: 'Camera Phone',
            conditions: {
                processorImportance: { values: ['Semi-Important', 'Not Important'], weight: 1.1 },
                cameraImportance: { values: ['Very Important'], weight: 2.0 },
                useIndoors: { values: ['Outdoors'], weight: 1.2 },
                storagePreference: { values: ['256GB and above'], weight: 1.5 },
                displayRefreshRate: { values: ['No'], weight: 1.0 },
                ramPreference: { values: ['8GB or less', '16GB or more'], weight: 1.1 },
                dailyUses: { values: ['I use it occasionally'], weight: 1.1 },
                weight: { values: ['Light phones'], weight: 1.1 },
            }
        }
    ];

    // Calculate similarity scores
    const similarityScores = types.map(type => {
        const conditions = type.conditions;
        const score = Object.keys(conditions).reduce((acc, key) => {
            const userAnswer = answers[key];
            const condition = conditions[key];

            if (Array.isArray(condition.values)) {
                if (condition.values.includes(userAnswer)) {
                    return acc + condition.weight;
                }
            } else {
                if (condition.values === userAnswer) {
                    return acc + condition.weight;
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