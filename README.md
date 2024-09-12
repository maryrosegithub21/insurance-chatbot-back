
# Insurance Chatbot

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


Description:
The server.js file contains an Express server setup to interact with Google's Generative AI for providing insurance policy recommendations based on user input related to car details. The server handles POST requests to /api/ai-response to facilitate the conversation flow with the AI model.

Dependencies:
Express: Web framework for Node.js.
Body-parser: Middleware to parse incoming request bodies.
Cors: Middleware for enabling Cross-Origin Resource Sharing.
dotenv: Loads environment variables from a .env file.
Internal Organization Module:
The code imports the GoogleGenerativeAI module from @google/generative-ai for utilizing the generative model.
Environment Variables:
The server loads environment variables using dotenv to access sensitive information like API keys.
Generative Model Setup:
Initializes the GoogleGenerativeAI with the API key retrieved from the environment variables.
Conversation Flow:
Tracks the state of the conversation using a flag and user input to guide the AI responses.
Provides specific responses based on user messages and car details input.
Recommends insurance products based on the car type, year model, and predefined business rules.
API Endpoints:
POST /api/ai-response: Handles user messages, generates AI replies, and provides response options for user interaction.
Generation Configuration:
Defines parameters for generating AI responses like temperature, topP, topK, and maxOutputTokens.
Server Start:
The server starts listening on the specified port (default: 5000) and logs the server URL upon successful start.
Error Handling:
Logs and returns an error message if there is an issue communicating with the Google Gemini API.
Usage:
Install dependencies: npm install.
Create a .env file with the required environment variables.
Start the server: node server.js.
Access the server at http://localhost:5000.
Note:
Ensure to replace placeholders like API keys, model details, and links with actual values before running the server in a production environment.