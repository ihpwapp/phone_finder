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
        question: 'Is having a high display rate important for you ',
        options: [ '8GB',  '16GB or more']
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
        optionElement.addEventListener('click', () => selectOption(index));
        optionsElement.appendChild(optionElement);
    });
}

function selectOption(index) {
    userAnswers[currentQuestion] = index;
    const options = document.querySelectorAll('.option');
    options.forEach(option => option.style.backgroundColor = ''); // Reset background color
    options[index].style.backgroundColor = '#198754'; // Highlight selected option
    
}

function redirectToAnotherPage() {
    // Replace 'another-page.html' with the actual URL of the page you want to redirect to
    window.location.href = 'test.html';
}

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

function showResult() {
    const resultElement = document.getElementById('result');
    const resultImageContainer = document.getElementById('resultImageContainer');
    const resultImageElement = document.getElementById('resultImage');
    const totalQuestions = quizData.length;
    let score = [0, 0, 0, 0];

    for (let i = 0; i < totalQuestions; i++) {
        score[userAnswers[i]]++;
    }

    const maxIndex = score.indexOf(Math.max(...score));
    const resultCategory = resultCategories[maxIndex];

    resultElement.textContent = `You got: ${resultCategory}!`;
    resultImageElement.src = resultImages[resultCategory];
    resultImageElement.alt = `${resultCategory} Image`;
    resultImageElement.style.display = 'block'; // Show the image
    showResetButton(); // Call function to show the reset button
}

function showResetButton() {
    document.getElementById('actionBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = 'inline-block';             
     document.getElementById('additionalBtn').style.display = 'inline-block';
}

function resetQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    loadQuestion();
    document.getElementById('result').textContent = '';
    document.getElementById('actionBtn').style.display = 'inline-block';
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('resultImage').src = '';
    document.getElementById('resultImage').alt = 'Result Image';
    document.getElementById('resultImage').style.display = 'none'; // Hide the image again
    document.getElementById('additionalBtn').style.display = 'none';

}

// Initial load
loadQuestion();