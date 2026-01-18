# Webhook Receiver (Service B)

This is the webhook receiver service that listens for webhook events from Service A.

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Build and run production:
```bash
npm run build
npm start
```

## Endpoints

- `POST /webhook` - Receives webhook events from Service A
  - Verifies webhook signature
  - Processes the event
  - Returns acknowledgment

- `GET /webhooks` - View all received webhooks

## Features

- Webhook signature verification using HMAC-SHA256
- Event processing for `task.completed` events
- In-memory storage of received webhooks
- Detailed console logging

## Port

Runs on `http://localhost:3002`
