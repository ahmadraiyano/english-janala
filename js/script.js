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

  if(words == 0){
    wordsContainer.innerHTML =
    `
    <div class="col-span-full text-center">
            <img class="mx-auto" src="./assets/alert-error.png" alt="alert">
            <p class="bangla-font text-md text-gray-400 font-medium my-4">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="bangla-font text-4xl font-bold">নেক্সট Lesson এ যান</h2>
        </div>
    `
  }

  words.map((word) => {
    const card = document.createElement("div");
    card.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center flex flex-col justify-evenly space-y-4 p-5">
            <h2 class="font-bold text-2xl">${word.word? word.word : `<span class="bg-red-500">শব্দ পাওয়া যায়নি</span>`}</h2>
            <p class="font-semibold">Meaning / Pronunciation</p>
            <div class="font-medium text-2xl bangla-font">${word.meaning? word.meaning : `<span class="bg-red-500">অর্থ পাওয়া যায়নি</span>`} / ${word.pronunciation? word.pronunciation: `<span class="bg-red-500">উচ্চারণ পাওয়া যায়নি</span>` }</div>
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
