document.addEventListener("DOMContentLoaded", function() {
    var words = WORDS;
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");

    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    var audio = document.getElementById("audio");

    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.ko] !== "known");
    }

    function playAudio(word) {
        if (!word.audio) return; // nếu không có file audio thì bỏ qua
        audio.src = word.audio;  // 👈 đổi field ở đây nếu cần
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }

    function showWord() {
        var remainingWords = getUnlearnedWords();

        if (remainingWords.length === 0) {
            korean.textContent = "🎉 You have finished learning all the words!";
            vietnamese.textContent = "";
            statusText.textContent = "";
            progressText.textContent =
                "Remembered: " + words.length + " / " + words.length + " (100%)";
            return;
        }

        var word = remainingWords[Math.floor(Math.random() * remainingWords.length)];

        korean.textContent = word.ko;
        vietnamese.textContent = word.vi;

        if (memoryData[word.ko] === "known") statusText.textContent = "✅ Remembered";
        else if (memoryData[word.ko] === "unknown") statusText.textContent = "❌ Not Remembered";
        else statusText.textContent = "🤔 Unmarked";

        updateProgress();
        playAudio(word); // 🔊 TỰ PHÁT ÂM THANH Ở ĐÂY
    }

    function saveWordStatus(status) {
        var currentKo = korean.textContent;
        if (!currentKo) return;

        memoryData[currentKo] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
        showWord(); // sang từ mới → tự phát âm thanh
    }

    function updateProgress() {
        var knownCount = Object.values(memoryData).filter(v => v === "known").length;
        var total = words.length;

        progressText.textContent =
            "Remembered: " + knownCount + " / " + total +
            " (" + Math.round((knownCount / total) * 100) + "%)";
    }

    function resetData() {
        if (confirm("Are you sure start learning again?")) {
            memoryData = {};
            localStorage.setItem("memoryData", JSON.stringify(memoryData));
            showWord();
        }
    }

    knownBtn.addEventListener("click", function() {
        saveWordStatus("known");
    });

    unknownBtn.addEventListener("click", function() {
        saveWordStatus("unknown");
    });

    resetBtn.addEventListener("click", resetData);

    showWord();
});
