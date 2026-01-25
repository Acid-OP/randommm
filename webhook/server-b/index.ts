import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();

interface Webhook {
  event: string;
  payload: any;
  receivedAt: Date;
}

const receivedWebhooks: Webhook[] = [];

app.post('/webhook',
  express.json(),
  (req: Request, res: Response) => {
    console.log('\nWEBHOOK RECEIVED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━');

    const signature = req.headers['x-webhook-signature'] as string;
    const event = req.headers['x-webhook-event'] as string;
    const payload = req.body;

    console.log('Event:', event);
    console.log('Payload:', payload);

    const secret = 'my_webhook_secret_123';
    const expectedSignature = verifySignature(payload, secret);

    if (signature !== expectedSignature) {
      console.log('Invalid signature!');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('Signature verified');

    if (event === 'task.completed') {
      console.log('Task completed:', payload.taskName);
      console.log('Result:', payload.result);

      receivedWebhooks.push({
        event: event,
        payload: payload,
        receivedAt: new Date()
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━\n');

    res.json({ received: true });
  }
);

function verifySignature(payload: any, secret: string): string {
  const payloadString = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
}

app.get('/webhooks', (req: Request, res: Response) => {
  res.json({
    count: receivedWebhooks.length,
    webhooks: receivedWebhooks
  });
});

app.listen(3002, () => {
  console.log('Service B (Webhook Receiver) running on http://localhost:3002');
  console.log('Webhook endpoint: http://localhost:3002/webhook');
});
