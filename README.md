# AWS Instance CPU Usage Tracker

This project is a web application that extracts and visualizes performance information of AWS instance CPU usage over time using Chart.js. 
## Installation


#### UI (Frontend)

```sh
cd UI
npm install
```

#### Server (Backend)

```sh
cd server
npm install
```

## Environment Variables

Create a `.env` file inside the `server` folder and add your AWS credentials:

```
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Running the Application

### Start the Backend Server

```sh
cd server
node server.js
```

### Start the Frontend

```sh
cd UI
npm run dev
```


