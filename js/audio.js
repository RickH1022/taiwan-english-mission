(function () {
  let queue = [], speaking = false, generation = 0, voices = [], activeResolve = null;
  const PREFERRED_US_VOICE = "Google US English";
  const englishVoices = () => voices.filter(voice => /^en/i.test(voice.lang));
  const usEnglishVoices = () => voices.filter(voice => /^en-us$/i.test(voice.lang));
  function refreshVoices() { voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : []; }
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.onvoiceschanged = refreshVoices;
  }
  function getPreferredEnglishVoice() {
    if (!voices.length) refreshVoices();
    const usEnglish = usEnglishVoices(), english = englishVoices();
    return usEnglish.find(voice => voice.name === PREFERRED_US_VOICE)
      || usEnglish[0]
      || english[0]
      || null;
  }
  function speak(text, rate = .9, role = "officer") {
    return new Promise(resolve => {
      if (!("speechSynthesis" in window)) { resolve({ status: "unavailable" }); return; }
      if (!String(text).trim()) { resolve({ status: "skipped" }); return; }
      queue.push({ text, rate, role, resolve }); playNext();
    });
  }
  function playNext() {
    if (speaking || !queue.length) return;
    const item = queue.shift(), localGeneration = generation;
    const utterance = new SpeechSynthesisUtterance(item.text);
    const voice = getPreferredEnglishVoice();
    utterance.lang = voice ? voice.lang : "en-US";
    if (voice) utterance.voice = voice;
    utterance.rate = item.rate;
    utterance.pitch = 1;
    speaking = true; activeResolve = item.resolve;
    utterance.onend = () => {
      if (localGeneration !== generation) return;
      speaking = false; activeResolve = null; item.resolve({ status: "ended" }); playNext();
    };
    utterance.onerror = () => {
      if (localGeneration !== generation) return;
      speaking = false; activeResolve = null; item.resolve({ status: "error" }); playNext();
    };
    window.speechSynthesis.speak(utterance);
  }
  async function speakSequence(items) {
    stop();
    const results = [];
    for (const item of items) results.push(await speak(item.text || item, item.rate || .9, item.role || "officer"));
    return results;
  }
  function stop() {
    generation += 1;
    if (activeResolve) activeResolve({ status: "cancelled" });
    activeResolve = null; queue.forEach(item => item.resolve({ status: "cancelled" })); queue = []; speaking = false;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }
  function playSceneTransition(source) { if (source) new Audio(source).play().catch(() => {}); }
  window.missionAudio = { speak, speakSequence, stop, playSceneTransition };
})();
