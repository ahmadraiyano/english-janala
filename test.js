const createElement = (arr) => {
  const htmlElement = arr.map((s) => `<span class="btn">${s}</span>`);
  console.log(htmlElement.join(" "));
};
const synonym = ["hello", "hi", "hey"];
createElement(synonym);
