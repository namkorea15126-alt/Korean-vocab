document.addEventListener("DOMContentLoaded", function () {
    var words = WORDS;
    var memoryData = JSON.parse(localStorage.getItem("memoryData")) || {};

    var korean = document.getElementById("korean");
    var vietnamese = document.getElementById("vietnamese");
    var statusText = document.getElementById("statusText");
    var progressText = document.getElementById("progress");

    var knownBtn = document.getElementById("knownBtn");
    var unknownBtn = document.getElementById("unknownBtn");
    var resetBtn = document.getElementById("resetBtn");

    var currentWord = null;
    var lastWord = null;

    /* 🔊 TEXT TO SPEECH */
    function speakKorean(text) {
        if (!("speechSynthesis" in window)) return;

        speechSynthesis.cancel(); // ngắt giọng cũ
        var utter = new SpeechSynthesisUtterance(text);
        utter.lang = "ko-KR";
        utter.rate = 0.9;   // tốc độ
        utter.pitch = 1.0;  // cao độ
        speechSynthesis.speak(utter);
    }

    function getUnlearnedWords() {
        return words.filter(w => memoryData[w.ko] !== "known");
    }

    function showWord() {
        var remainingWords = getUnlearnedWords();

        if (remainingWords.length === 0) {
            korean.textContent = "🎉 Finished!";
            vietnamese.textContent = "";
            vietnamese.classList.add("hidden");
            statusText.textContent = "";
            progressText.textContent =
                "Remembered: " + words.length + " / " + words.length + " (100%)";
            return;
        }

        do {
            currentWord =
                remainingWords[Math.floor(Math.random() * remainingWords.length)];
        } while (lastWord && currentWord.ko === lastWord.ko && remainingWords.length > 1);

        lastWord = currentWord;

        korean.textContent = currentWord.ko;
        vietnamese.textContent = currentWord.vi;
        vietnamese.classList.add("hidden");

        statusText.textContent = "🤔 Unmarked";
        updateProgress();

        /* 🔊 ĐỌC NGAY KHI HIỆN TỪ */
        speakKorean(currentWord.ko);
    }

    function saveWordStatus(status) {
        if (!currentWord) return;
        memoryData[currentWord.ko] = status;
        localStorage.setItem("memoryData", JSON.stringify(memoryData));
        showWord();
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

    /* CLICK VÀO TỪ → ĐỌC LẠI + HIỆN NGHĨA */
    korean.addEventListener("click", function () {
        vietnamese.classList.toggle("hidden");
        speakKorean(korean.textContent);
    });

    knownBtn.addEventListener("click", function () {
        saveWordStatus("known");
    });

    unknownBtn.addEventListener("click", function () {
        saveWordStatus("unknown");
    });

    resetBtn.addEventListener("click", resetData);

    /* PHÍM TẮT */
    document.addEventListener("keydown", function (e) {
        if (!currentWord) return;

        if (e.key === " ") {
            e.preventDefault();
            vietnamese.classList.toggle("hidden");
            speakKorean(currentWord.ko);
        }
        if (e.key === "ArrowRight") saveWordStatus("known");
        if (e.key === "ArrowLeft") saveWordStatus("unknown");
    });

    showWord();
});
