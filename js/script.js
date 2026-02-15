const createElement = (arr) => {
  const htmlElement = arr.map((s) => `<span class="btn">${s}</span>`);
  return htmlElement.join(" ");
};

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-GB";

  function setVoice() {
    const voices = speechSynthesis.getVoices();

    // Prefer Google UK Female (Chrome)
    const britishFemale =
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.lang === "en-GB" && v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.lang === "en-GB");

    if (britishFemale) {
      utterance.voice = britishFemale;
    }

    // Teen-like tuning
    utterance.pitch = 1.4;  // higher = younger sound (range 0–2)
    utterance.rate = 1.05;  // slightly faster
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  }

  if (speechSynthesis.getVoices().length === 0) {
    speechSynthesis.onvoiceschanged = setVoice;
  } else {
    setVoice();
  }
}


const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("words-container").classList.add("hidden");
  } else {
    document.getElementById("words-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => {
      displayLessons(json.data);
    });
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};

const loadLessonWords = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      removeActive();
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active");
      displayLessonWords(json.data);
    });
};

const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayWordDetails(data.data);
};

const displayWordDetails = (words) => {
  console.log(words);
  const detailWords = document.getElementById("details-container");
  detailWords.innerHTML = `
                <div class="">
                    <h2 class="text-2xl font-bold">${words.word} (<i class="fa-solid fa-microphone"></i>: <span class="bangla-font">${words.pronunciation})</span></h2>
                </div>
                <div class="">
                    <h2 class="font-bold">Meaning</h2>
                    <p class="bangla-font">${words.meaning}</p>
                </div>
                <div class="">
                    <h2 class="font-bold">Example</h2>
                    <p>${words.sentence}</p>
                </div>
                <div class="">
                    <h2 class="font-bold bangla-font">সমার্থক শব্দ গুলো</h2>
                </div>
                <div class="">${createElement(words.synonyms)}</div>
  `;
  document.getElementById("word_modal").showModal();
};

const displayLessonWords = (words) => {
  const wordsContainer = document.getElementById("words-container");
  wordsContainer.innerHTML = "";

  if (words == 0) {
    wordsContainer.innerHTML = `
    <div class="col-span-full text-center">
            <img class="mx-auto" src="./assets/alert-error.png" alt="alert">
            <p class="bangla-font text-md text-gray-400 font-medium my-4">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="bangla-font text-4xl font-bold">নেক্সট Lesson এ যান</h2>
        </div>
    `;
    manageSpinner(false);
    return;
  }

  words.map((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center flex flex-col justify-evenly space-y-4 p-5 h-64">
            <h2 class="font-bold text-2xl">${word.word ? word.word : `<span class="bg-red-500">শব্দ পাওয়া যায়নি</span>`}</h2>
            <p class="font-semibold">Meaning / Pronunciation</p>
            <div class="font-medium text-2xl bangla-font">${word.meaning ? word.meaning : `<span class="bg-red-500">অর্থ পাওয়া যায়নি</span>`} / ${word.pronunciation ? word.pronunciation : `<span class="bg-red-500">উচ্চারণ পাওয়া যায়নি</span>`}</div>
            <div class="flex justify-between items-center">
                <button onclick="loadWordDetails(${word.id})" class="btn bg-blue-100 hover:bg-blue-300"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${word.word}')" class="btn bg-blue-100 hover:bg-blue-300"><i class="fa-solid fa-volume-high"></i></button>
                
            </div>
        </div>
    `;

    wordsContainer.append(card);
  });
  manageSpinner(false);
};

const displayLessons = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id="lesson-btn-${lesson.level_no}" onclick="loadLessonWords(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson ${lesson.level_no}</button>
    `;

    levelContainer.append(btnDiv);
  }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      if(searchValue.length != 0){
      displayLessonWords(filterWords);
      }
    });
});
