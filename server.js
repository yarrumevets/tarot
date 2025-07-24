import "./loadenv.js";
import express from "express";
import openaiApiKey from "./openaiApiCreds.js";
import systemRole from "./gptconfig.js";
import cardInfo from "./cardinfo.js";
import { createReading, getReadings } from "./db.js";

const app = express();
const port = process.env.PORT || 4666;

// Middleware
app.use(express.static("public"));
app.use(express.json());

// Route / : Serve public folder
app.get("/", (req, res) => {
  res.sendFile("public/index.html", { root: __dirname });
});

function getRandomCards(numValues) {
  // Convert the cardInfo into an array of objects with key and name
  const cards = Object.entries(cardInfo).map(([key, value]) => {
    return { key: key, value: value.name };
  });
  // Fisher-Yates shuffle algorithm for an unbiased shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap elements
  }
  return cards.slice(0, numValues); // Return the first numValues elements
}

// API:
// Route /api/send : Forward the user's message on to Openai GPT.
app.post("/api/ask", (req, res) => {
  const message = req.body.message;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${openaiApiKey}`);
  const myCards = getRandomCards(3);
  const fullMessage = `${message}. My tarot cards are: ${myCards[0].value},  ${myCards[1].value}, and ${myCards[2].value}.`;
  const raw = JSON.stringify({
    model: "gpt-4o", // "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemRole,
      },
      {
        role: "user",
        content: fullMessage,
      },
    ],
    temperature: 0.7,
    frequency_penalty: 0.5,
    presence_penalty: 0.2,
    max_tokens: 600,
    top_p: 1,
  });
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("https://api.openai.com/v1/chat/completions", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      const jsonResult = JSON.parse(result);
      if (jsonResult && jsonResult.choices && jsonResult.choices[0]) {
        const responseMessage = jsonResult.choices[0].message.content;

        const ip =
          req.headers["x-real-ip"] ||
          req.headers["x-forwarded-for"] ||
          req.socket.remoteAddress;

        createReading({
          createdAt: new Date(),
          ip,
          message,
          response: responseMessage,
          usage: jsonResult.usage,
          cards: myCards,
        });

        return res.send({
          response: responseMessage,
          usage: jsonResult.usage,
          cards: myCards,
        });
      } else {
        return res.send({
          response: "",
        });
      }
    })
    .catch((error) => console.log("error", error));
});

// Health check (provides VM ID)
app.get("/health", (req, res) => {
  res.json({ vmId: process.env.VM_ID });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
