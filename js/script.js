const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => {
      displayLessons(json.data);
    });
};

const loadLessonWords = (id) => {
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayLessonWords(json.data));
};

const displayLessonWords = (words) => {
  const wordsContainer = document.getElementById("words-container");
  wordsContainer.innerHTML = "";

  words.map((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center flex flex-col justify-evenly space-y-4 p-5">
            <h2 class="font-bold text-2xl">${word.word}</h2>
            <p class="font-semibold">Meaning / Pronounciation</p>
            <div class="font-medium text-2xl bangla-font">${word.meaning} / ${word.pronunciation}</div>
            <div class="flex justify-between items-center">
                <button class="btn bg-blue-100 hover:bg-blue-300"><i class="fa-solid fa-circle-info"></i></button>
                <button class="btn bg-blue-100 hover:bg-blue-300"><i class="fa-solid fa-volume-high"></i></button>
                
            </div>
        </div>
    `;

    wordsContainer.append(card);
  });
};

const displayLessons = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button onclick="loadLessonWords(${lesson.level_no})" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson ${lesson.level_no}</button>
    `;

    levelContainer.append(btnDiv);
  }
};

loadLessons();
