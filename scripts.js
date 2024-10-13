let phrases = [
    ["She told me off", "Ella me regañó"],
    ["Can I go over my test?", "Puedo repasar mi examen?"],
    ["You are a cheater", "Eres un tramposo"],
    // Añadir todas tus frases aquí...
];

let selectedPhrases = [];
let currentCardIndex = 0;
let flipped = false;
let languageMode = 'en-es';  // Por defecto Inglés a Español
let feedbacks = [];
let difficultyQueue = [];  // Para repetir las difíciles
let voices = [];
let selectedVoice;

// Cargar las voces disponibles (inicialmente) y elegir la voz masculina americana
function loadVoices() {
    voices = window.speechSynthesis.getVoices();
    selectedVoice = voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Male'));

    // Si no encuentra una voz masculina, selecciona la primera voz de en-US
    if (!selectedVoice) {
        selectedVoice = voices.find(voice => voice.lang === 'en-US');
    }
}

// Ejecutar loadVoices cuando las voces estén cargadas (importante para navegadores como Chrome)
if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
}

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

// Mostrar la tarjeta actual y el botón de reproducción si es necesario
function showCard() {
    const phraseElement = document.getElementById('phrase');
    const phrase = selectedPhrases[currentCardIndex];

    flipped = false;
    document.getElementById('feedback-buttons').style.display = 'none';
    const flipButton = document.getElementById('flip-button');

    if (languageMode === 'en-es') {
        phraseElement.textContent = phrase[0];  // Mostrar inglés
        flipButton.style.display = 'inline';  // Mostrar botón flip
        showVoiceButton();  // Mostrar botón de voz si es en inglés
    } else if (languageMode === 'es-en') {
        phraseElement.textContent = phrase[1];  // Mostrar español
        flipButton.style.display = 'inline';
        hideVoiceButton();  // Ocultar botón de voz si es en español
    } else {
        // Modo mixto
        if (Math.random() > 0.5) {
            phraseElement.textContent = phrase[0];  // Inglés
            showVoiceButton();
        } else {
            phraseElement.textContent = phrase[1];  // Español
            hideVoiceButton();
        }
        flipButton.style.display = 'inline';
    }

    updateProgress();
}

// Para voltear la carta y mostrar el otro lado
function flipCard() {
    const phraseElement = document.getElementById('phrase');
    const phrase = selectedPhrases[currentCardIndex];

    flipped = !flipped;

    if (flipped) {
        if (phraseElement.textContent === phrase[0]) {
            phraseElement.textContent = phrase[1];
            hideVoiceButton();  // Ocultar voz en español
        } else {
            phraseElement.textContent = phrase[0];
            showVoiceButton();  // Mostrar voz en inglés
        }
        document.getElementById('feedback-buttons').style.display = 'block';
    }
}

// Barra de progreso
function updateProgress() {
    const progress = ((currentCardIndex + 1) / selectedPhrases.length) * 100;
    document.getElementById('progress-bar
