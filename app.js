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

    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.id] !== "known");
    }

    function showWord() {
        var remainingWords = getUnlearnedWords();
        if (remainingWords.length === 0) {
            korean.textContent = "🎉 You have finished learning all the words!";
            vietnamese.textContent = "";
            statusText.textContent = "";
            progressText.textContent = "Remembered: " + words.length + " / " + words.length + " (100%)";
            return;
        }

        // Chọn ngẫu nhiên từ chưa học
        var word = remainingWords[Math.floor(Math.random() * remainingWords.length)];
        korean.textContent = word.ko;
        vietnamese.textContent = word.vi;

        if (memoryData[word.id] === "known") statusText.textContent = "✅ Remembered";
        else if (memoryData[word.id] === "unknown") statusText.textContent = "❌ Not Remembered";
        else statusText.textContent = "🤔 Unmarked";

        updateProgress();
    }

    function saveWordStatus(status) {
        var currentKo = korean.textContent;
        var word = words.find(w => w.ko === currentKo);
        if (!word) return;
        memoryData[word.id] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
        showWord(); // Hiển thị từ mới ngay lập tức
    }

    function updateProgress() {
        var knownCount = Object.values(memoryData).filter(v => v === "known").length;
        var total = words.length;
        progressText.textContent = "Remembered: " + knownCount + " / " + total +
            " (" + Math.round((knownCount / total) * 100) + "%)";
    }

    function resetData() {
        if (confirm("Are you sure start learning again?")) {
            memoryData = {};
            localStorage.setItem("memoryData", JSON.stringify(memoryData));
            showWord();
        }
    }

    knownBtn.addEventListener("click", function() { saveWordStatus("known"); });
    unknownBtn.addEventListener("click", function() { saveWordStatus("unknown"); });
    resetBtn.addEventListener("click", resetData);

    showWord();
});
