const words = [
  { ko: "안녕하세요", vi: "Xin chào" },
  { ko: "사랑", vi: "Tình yêu" },
  { ko: "학교", vi: "Trường học" },
  { ko: "친구", vi: "Bạn bè" }
];

let index = 0;

function showWord() {
  document.getElementById("korean").innerText = words[index].ko;
  document.getElementById("meaning").innerText = words[index].vi;
}

function nextWord() {
  index = (index + 1) % words.length;
  showWord();
}

function speak() {
  const utterance = new SpeechSynthesisUtterance(words[index].ko);
  utterance.lang = "ko-KR";
  speechSynthesis.speak(utterance);
}

showWord();
