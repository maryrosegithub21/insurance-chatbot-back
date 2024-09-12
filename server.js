
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Import internal organization module
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Initialize GoogleGenerativeAI with API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// Define the generative model and system instructions
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `Tina is the AI that acts as an insurance consultant to take some input from users and then provide the recommendation at the end. Tina should introduce itself by asking "I’m Tina. I help you to choose an insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?". It will proceed to ask for next questions if the user agrees to be asked. Tina should provide an option of (Hatchback, SUV, Convertible, Coupe, Van, Crossover, Sports Car, Sedan, Wagon, Mini Van, Other Type of Car) when asking "What Type of Car are you applying to have an insurance policy". Tina should ask "What is your car Year Model" and should answer based on the 2 business rules that (Mechanical Breakdown Insurance is not available to trucks and racing cars) And (Comprehensive Car Insurance is only available to any motor vehicles less than 10 years old.) At the end, Tina should recommend one or more insurance products to the user and provide reasons to support the recommendation. The insurance products are: Mechanical Breakdown Insurance (MBI) which details is only in this link https://docs.dplinsurance.co.nz/policy_books/turners/mbi.pdf, Comprehensive Car Insurance which details is only in this link https://docs.dplinsurance.co.nz/policy_books/turners/car/comprehensive.pdf, Third Party Car Insurance which only in this link https://docs.dplinsurance.co.nz/policy_books/turners/car/tppd.pdf. Tina should not ask irrelevant or personal details of the client but only car details for insurance policy.`,
});

// Generation configuration
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

// Define a flag to track the state of the conversation
let conversationState = {
  isFirstQuestion: true,
  carType: null,
  carYear: null,
};

// Handle POST requests to '/api/ai-response'
app.post('/api/ai-response', async (req, res) => {
  const userMessage = req.body.message;
  try {
    let aiReply = '';
    let options = [];
    let optionsType = '';

    // Check the state of the conversation
    if (conversationState.isFirstQuestion) {
      aiReply = "I’m Tina. I help you to choose an insurance policy. May I ask you a few personal questions to make sure I recommend the best policy for you?";
      optionsType = 'buttons';
      options = [
        { text: 'Yes', value: 'yes' },
        { text: 'No', value: 'no' },
      ];
      conversationState.isFirstQuestion = false;
    } else if (userMessage.toLowerCase() === 'no') {
      aiReply = "Thank you for your time. If you have any questions in the future, feel free to ask!";
      optionsType = ''; // No further options
    } else if (userMessage.toLowerCase() === 'yes') {
      aiReply = "What Type of Car are you applying to have an insurance policy?";
      optionsType = 'buttons';
      options = [
        { text: 'Hatchback', value: 'Hatchback' },
        { text: 'SUV', value: 'SUV' },
        { text: 'Convertible', value: 'Convertible' },
        { text: 'Coupe', value: 'Coupe' },
        { text: 'Van', value: 'Van' },
        { text: 'Crossover', value: 'Crossover' },
        { text: 'Sports Car', value: 'Sports Car' },
        { text: 'Sedan', value: 'Sedan' },
        { text: 'Wagon', value: 'Wagon' },
        { text: 'Mini Van', value: 'Mini Van' },
        { text: 'Other Type of Car', value: 'Other Type of Car' },
      ];
    } else if (conversationState.carType === null) {
      conversationState.carType = userMessage;
      aiReply = "What is your car Year Model?";
    } else if (conversationState.carYear === null) {
      conversationState.carYear = parseInt(userMessage);
      const currentYear = new Date().getFullYear();
      const carAge = currentYear - conversationState.carYear;

      if (conversationState.carType.toLowerCase() === 'truck' || conversationState.carType.toLowerCase() === 'racing car') {
        aiReply = "Mechanical Breakdown Insurance is not available for trucks and racing cars.";
      } else if (carAge > 10) {
        aiReply = "Comprehensive Car Insurance is only available to any motor vehicles less than 10 years old.";
      } else {
        aiReply = "Based on your car details, I recommend the following insurance products:\n";
        aiReply += "- Mechanical Breakdown Insurance (MBI): [Details](https://docs.dplinsurance.co.nz/policy_books/turners/mbi.pdf)\n";
        aiReply += "- Comprehensive Car Insurance: [Details](https://docs.dplinsurance.co.nz/policy_books/turners/car/comprehensive.pdf)\n";
        aiReply += "- Third Party Car Insurance: [Details](https://docs.dplinsurance.co.nz/policy_books/turners/car/tppd.pdf)";
      }
    }

    res.json({ reply: aiReply, options, optionsType });
  } catch (error) {
    console.error('Error communicating with Google Gemini API:', error);
    res.status(500).send('Error communicating with Google Gemini API');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});