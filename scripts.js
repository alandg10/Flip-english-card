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

// Mostrar la tarjeta actual y el botón de reproducción si es necesario
function showCard() {
    const phraseElement = document.getElementById('phrase');
    const phrase = selectedPhrases[currentCardIndex];

    flipped = false;
    document.getElementById('feedback-buttons').style.display = 'none';
    const flipButton = document.getElementById('flip-button');

    if (languageMode === 'en-es') {
        phraseElement.textContent = phrase[0];
        flipButton.style.display = 'inline';  // Mostrar botón flip
        showVoiceButton();  // Mostrar botón de voz si es en inglés
    } else if (languageMode === 'es-en') {
        phraseElement.textContent = phrase[1];
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

// Mostrar el botón de reproducción de voz
function showVoiceButton() {
    const voiceButton = document.getElementById('voice-button');
    voiceButton.style.display = 'inline';
}

// Ocultar el botón de reproducción de voz
function hideVoiceButton() {
    const voiceButton = document.getElementById('voice-button');
    voiceButton.style.display = 'none';
}

// Reproducir la voz en inglés
function playAudio(text) {
    if (!selectedVoice) {
        console.error('No hay voces disponibles.');
        return;
    }

    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'en-US';
    msg.voice = selectedVoice;
    window.speechSynthesis.speak(msg);
}
