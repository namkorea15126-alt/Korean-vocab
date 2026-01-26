var words = [
  { ko: "안녕하세요", vi: "Xin chào" },
  { ko: "감사합니다", vi: "Cảm ơn" },
  { ko: "사랑", vi: "Tình yêu" },
  { ko: "학교", vi: "Trường học" }
];

var index = 0;
var showing = "ko";

var korean = document.getElementById("korean");
var meaning = document.getElementById("meaning");
var card = document.getElementById("card");

function showWord() {
  korean.textContent = words[index].ko;
  meaning.textContent = words[index].vi;
  korean.style.display = "block";
  meaning.style.display = "none";
  showing = "ko";
}

card.addEventListener("click", function () {
  if (showing === "ko") {
    korean.style.display = "none";
    meaning.style.display = "block";
    showing = "vi";
  } else {
    showWord();
  }
});

document.getElementById("nextBtn").onclick = function () {
  index = (index + 1) % words.length;
  localStorage.setItem("wordIndex", index);
  showWord();
};

document.getElementById("speakBtn").onclick = function () {
  var u = new SpeechSynthesisUtterance(words[index].ko);
  u.lang = "ko-KR";
  speechSynthesis.speak(u);
};

var saved = localStorage.getItem("wordIndex");
if (saved) index = parseInt(saved, 10);

showWord();
