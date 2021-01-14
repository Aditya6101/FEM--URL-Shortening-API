const nav = document.querySelector("nav");
const links = document.querySelectorAll(".nav-links li");
const burger = document.getElementById("burger");
const icon = document.querySelector("i");
burger.addEventListener("click", () => {
  links.forEach(() => {
    nav.classList.toggle("active");
    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-times");
  });
});

const input = document.getElementById("url-input");
const submitBtn = document.getElementById("submit-btn");

input.value = "";

if (localStorage.getItem("results")) {
  displayResult();
}

submitBtn.addEventListener("click", () => {
  const url = input.value;
  input.value = "";
  if (url === "") {
    document.getElementById("alert").style.display = "block";
    input.classList.add("alert");
    return false;
  } else {
    validateUrl(url);
    if (validateUrl) {
      input.classList.remove("alert");
      fetchData(url);
    }
  }
});

async function fetchData(url) {
  try {
    const fetchUrl = `https://api.shrtco.de/v2/shorten?url=${url}`;
    const response = await fetch(fetchUrl);
    const data = await response.json();

    const {
      full_short_link: shortedLink,
      original_link: originalLink,
    } = data.result;

    saveToStorage(shortedLink, originalLink);
    displayResult();
  } catch (err) {
    alert("🙁🙁🙁 Something Went Wrong 🙁🙁🙁");
    console.error(err);
  }
}

function saveToStorage(shorted, original) {
  const resultObj = {
    shortedLink: shorted,
    originalLink: original,
  };

  if (localStorage.getItem("results") === null) {
    const results = [];
    results.push(resultObj);
    localStorage.setItem("results", JSON.stringify(results));
  } else {
    const results = JSON.parse(localStorage.getItem("results"));
    results.push(resultObj);
    localStorage.setItem("results", JSON.stringify(results));
  }
}

function displayResult() {
  const resultContainer = document.querySelector(".result-container");
  const results = JSON.parse(localStorage.getItem("results"));
  resultContainer.innerHTML = "";

  for (let i = 0; i < results.length; i++) {
    const originalUrl = results[i].originalLink;
    const shortedUrl = results[i].shortedLink;

    resultContainer.innerHTML += `<div class="result-card">
    <p class="paragraph url">${originalUrl}</p>
    <p class="paragraph shorted-url">${shortedUrl}</p>
    <button class="copy-btn">Copy</button>
    </div>`;
  }

  for (let i = 0; i < results.length; i++) {
    const copyBtns = document.querySelectorAll(".copy-btn");

    copyBtns[i].addEventListener("click", () => {
      const link = results[i].shortedLink;
      const textarea = document.createElement("textarea");
      if (!link) {
        return;
      }

      textarea.value = link;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      copyBtns[i].style.backgroundColor = "hsl(257, 27%, 26%)";
      copyBtns[i].innerText = "Copied!";
    });
  }
}

function validateUrl(url) {
  const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const regex = new RegExp(expression);

  if (!url.match(regex)) {
    alert("😒😒😒  Please use a Valid URL 😒😒😒");
    return false;
  }
}
