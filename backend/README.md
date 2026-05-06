# HealthSymphony Backend

This is the backend API for the HealthSymphony Chatbot, built with Node.js, Express, and SQLite. It provides full user authentication (JWT), secure data storage, and the mock AI generation engine.

## Prerequisites
To run this backend, you must have **Node.js** installed on your system.
Download Node.js here: [https://nodejs.org](https://nodejs.org)

## Setup Instructions

1. **Open your terminal** and navigate to this `backend` directory:
   ```bash
   cd "backend"
   ```

2. **Install the dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

The server will initialize the SQLite database (`database.sqlite`) locally inside this folder and run on **http://localhost:5000**.

## Connecting the Frontend
The frontend `app.js` is currently configured to run standalone in the browser using `localStorage`. When you are ready to switch over to this real backend, you can update the API calls inside `app.js` to fetch `http://localhost:5000/api/...` instead of using `localStorage`.
