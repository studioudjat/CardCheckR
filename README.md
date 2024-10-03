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
- [License](#license)

---

## Requirements

To run this project, you will need the following:

- [Node.js](https://nodejs.org/) (Recommended version: 14.x or later)
- Google Cloud Vision API service account key (`service-account-key.json`)

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
```

`GOOGLE_APPLICATION_CREDENTIALS` specifies the path to the Google Cloud Vision API service account key.

---

## Usage

1. **Processing cards**:

   - In the frontend, press the "Capture Card" button to launch the camera and capture an image of a credit card or ID card.
   - After capturing, the image is sent to automatically extract the card's information.

2. **API Endpoints**:

   - `POST /process-credit-card`: Processes a credit card image.
   - `POST /process-id-card`: Processes an ID card image.

---

## License

This project is licensed under the [MIT License](LICENSE).
