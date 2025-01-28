import { cardsList } from "./cardslist.js";

const sendButton = document.getElementById("sendbutton");
const cardsContainer = document.getElementById("cards");
const inputField = document.getElementById("chatinput");
const inputFieldLabel = document.getElementById("chatinputlabel");
const questionText = document.getElementById("questiontext");

// Display cards
const displayCards = (cards) => {
  const card1 = document.getElementById("card1");
  const card2 = document.getElementById("card2");
  const card3 = document.getElementById("card3");
  const cardLabel1 = document.getElementById("cardlabel1");
  const cardLabel2 = document.getElementById("cardlabel2");
  const cardLabel3 = document.getElementById("cardlabel3");

  card1.setAttribute("src", `./images/${cardsList[cards[0].key].image}`);
  card2.setAttribute("src", `./images/${cardsList[cards[1].key].image}`);
  card3.setAttribute("src", `./images/${cardsList[cards[2].key].image}`);
  cardLabel1.innerHTML = cards[0].value;
  cardLabel2.innerHTML = cards[1].value;
  cardLabel3.innerHTML = cards[2].value;
  cardsContainer.appendChild(card1);
  cardsContainer.appendChild(card2);
  cardsContainer.appendChild(card3);
};

// Display readings.
const displayReadings = (readings, cards) => {
  console.log("readings: ", readings);
  const reading1Text = document.getElementById("reading1text");
  const reading2Text = document.getElementById("reading2text");
  const reading3Text = document.getElementById("reading3text");
  const readingSummaryText = document.getElementById("readingsummarytext");
  reading1Text.innerHTML = readings.card1.name + " - " + readings.card1.reading;
  reading2Text.innerHTML = readings.card2.name + " - " + readings.card2.reading;
  reading3Text.innerHTML = readings.card3.name + " - " + readings.card3.reading;
  readingSummaryText.innerHTML = "Summary - " + readings.summary;
  const card1Thumb = document.getElementById("card1thumb");
  const card2Thumb = document.getElementById("card2thumb");
  const card3Thumb = document.getElementById("card3thumb");
  card1Thumb.setAttribute("src", `./images/${cardsList[cards[0].key].image}`);
  card2Thumb.setAttribute("src", `./images/${cardsList[cards[1].key].image}`);
  card3Thumb.setAttribute("src", `./images/${cardsList[cards[2].key].image}`);
  const readingsWrapper = document.getElementById("readings");
  readingsWrapper.classList.remove("hidden");
};

// Send message to api
async function doSend() {
  const message = inputField.value;
  if (!message) return;
  // inputField.value = "";
  // inputField.focus();

  // Display message somewhere
  inputField.classList.add("hidden");
  inputFieldLabel.classList.add("invisible");
  questionText.innerHTML = message;
  questionText.classList.remove("hidden");
  questionText.classList.add("fadingtext");

  const messageData = {
    message,
  };
  const response = await fetch("./api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  }).catch((err) => console.error("Error: ", err));
  const jsonResponse = await response.json();
  console.log("json response: ", jsonResponse);
  displayReadings(JSON.parse(jsonResponse.response), jsonResponse.cards);
  displayCards(jsonResponse.cards);
}

// Trigger the send.
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    doSend();
  }
});
sendButton.onclick = () => {
  doSend();
};
