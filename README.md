# CardCheckR

CardCheckR is a web application that processes images of credit cards and ID cards and extracts information using the Google Cloud Vision API. The application consists of two parts: the frontend and the backend, and it explains how to set up and use each part.

## Project Structure

- **frontend**: A React-based user interface.
- **backend**: An API server built with Node.js and Express. It uses the Google Cloud Vision API to extract information from cards.

---

## Table of Contents

- [Requirements](#requirements)
- [Setup](#setup)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Processing Methods](#processing-methods)
- [License](#license)

---

## Requirements

To run this project, you will need the following:

- [Node.js](https://nodejs.org/) (Recommended version: 14.x or later)
- Google Cloud Vision API service account key (`service-account-key.json`)
- OpenAI API key (optional, if you want to use AI-based processing)

---

## Setup

### Frontend Setup

1. **Navigate to the frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the frontend server**

   ```bash
   npm start
   ```

   The frontend is typically available at `http://localhost:3000`.

### Backend Setup

1. **Navigate to the backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Place the Google Cloud Vision API service account key**

   - Place the Google Cloud Vision API service account key in the `backend` folder and name it `service-account-key.json`.

4. **Start the backend server**

   ```bash
   npm start
   ```

   The backend is typically available at `http://localhost:8080`.

---

## Environment Variables

Create a `.env` file in the project's root directory and configure the following environment variables:

```plaintext
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
PORT=8080
OPENAI_API_KEY=your-openai-api-key (optional for AI-based processing)
```

`GOOGLE_APPLICATION_CREDENTIALS` specifies the path to the Google Cloud Vision API service account key.

`OPENAI_API_KEY` is required if you want to use OpenAI's API for card information extraction.

---

## Usage

1. **Processing cards**:

   - In the frontend, press the "Capture Card" button to launch the camera and capture an image of a credit card or ID card.
   - After capturing, the image is sent to automatically extract the card's information.

2. **API Endpoints**:

   - `POST /process-credit-card`: Processes a credit card image.
   - `POST /process-id-card`: Processes an ID card image.

---

## Processing Methods

There are two methods available for processing the OCR-extracted text: **regex-based** and **AI-based**. You can switch between them by setting the `useRegex` flag to `true` or `false`.

1. **Regex-based Processing (`useRegex: true`)**:

   - This method uses regular expressions to extract credit card information such as cardholder name, card number, expiration date, and the security code (CVV) from the OCR-extracted text.
   - It is fast but may not handle all variations of text formatting as accurately as AI-based methods.

2. **AI-based Processing (`useRegex: false`)**:
   - This method uses OpenAI's GPT-4 model to analyze the OCR-extracted text and accurately extract the required card details.
   - It is more flexible and can handle a wider variety of text formats, but requires an OpenAI API key and has a slightly higher processing time due to the API request.

### How to Switch Between Methods

In the `backend`, the `processCreditCard` function takes a second argument, `useRegex`, which determines which method to use:

- If `useRegex` is set to `true`, the regex-based extraction method is used.
- If `useRegex` is set to `false`, the OpenAI GPT-4-based extraction method is used.

Example usage in the backend code:

```javascript
// Using regex-based processing
const cardInfo = await processCreditCard(imageBuffer, true);

// Using AI-based processing
const cardInfo = await processCreditCard(imageBuffer, false);
```

By default, the AI-based method will be used unless `useRegex` is explicitly set to `true`.

---

## License

This project is licensed under the [MIT License](LICENSE).
