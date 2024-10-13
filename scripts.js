function playAudio(text) {
    const msg = new SpeechSynthesisUtterance();
    msg.text = text;
    msg.lang = 'en-US';  // Idioma en inglés
    window.speechSynthesis.speak(msg);
}
