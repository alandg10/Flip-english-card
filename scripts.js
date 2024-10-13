let phrases = [
    ["She told me off", "Ella me regañó"],
    ["Can I go over my test?", "Puedo repasar mi examen?"],
    // Añadir todas tus frases aquí...
];

let selectedPhrases = [];
let currentCardIndex = 0;
let flipped = false;
let languageMode = 'en-es';  // Por defecto Inglés a Español
let feedbacks = [];
let difficultyQueue = [];  // Para repetir las difíciles

// Para iniciar el juego con la cantidad de frases seleccionada
function startGame(count) {
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('language-screen').style.display = 'block';

    if (count === 'all') {
        selectedPhrases = phrases;
    } else {
        selectedPhrases = phrases.slice(0, count);
    }

    selectedPhrases = shuffle(selectedPhrases);  // Aleatorio
}

// Para configurar el modo de idioma
function setLanguageMode(mode) {
    languageMode = mode;
    document.getElementById('language-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    showCard();
}

// Mostrar la tarjeta actual
function showCard() {
    const phraseElement = document.getElementById('phrase');
    const phrase = selectedPhrases[currentCardIndex];

    flipped = false;
    document.getElementById('feedback-buttons').style.display = 'none';
    
    if (languageMode === 'en-es') {
        phraseElement.textContent = phrase[0];
    } else if (languageMode === 'es-en') {
        phraseElement.textContent = phrase[1];
    } else {
        // Mix de idiomas
        phraseElement.textContent = Math.random() > 0.5 ? phrase[0] : phrase[1];
    }

    updateProgress();
}

// Para voltear la carta
function flipCard() {
    const phraseElement = document.getElementById('phrase');
    const phrase = selectedPhrases[currentCardIndex];
    
    flipped = !flipped;

    if (flipped) {
        if (phraseElement.textContent === phrase[0]) {
            phraseElement.textContent = phrase[1];
        } else {
            phraseElement.textContent = phrase[0];
        }
        document.getElementById('feedback-buttons').style.display = 'block';
    }
}

// Barra de progreso
function updateProgress() {
    const progress = ((currentCardIndex + 1) / selectedPhrases.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
}

// Para dar feedback
function giveFeedback(level) {
    feedbacks[currentCardIndex] = level;
    if (level === 'hard') {
        difficultyQueue.push(currentCardIndex);  // Añadir a la cola de difícil
    }
    nextCard();
}

// Botón siguiente
function nextCard() {
    if (currentCardIndex < selectedPhrases.length - 1) {
        currentCardIndex++;
        showCard();
    } else if (difficultyQueue.length > 0) {
        currentCardIndex = difficultyQueue.shift();  // Repetir los difíciles
        showCard();
    } else {
        alert("¡Has completado todas las frases!");
    }
}

// Botón anterior
function prevCard() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        showCard();
    }
}

// Para barajar las frases
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Para reproducir la voz en inglés (asegúrate de elegir una voz masculina nativa)
function playAudio(text) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    msg.voice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Male')); // Ajuste de voz masculina
    window.speechSynthesis.speak(msg);
}
