import express, { Request, Response } from 'express';
import crypto from 'crypto';

const app = express();

interface Webhook {
  event: string;
  payload: any;
  receivedAt: Date;
}

// Store received webhooks
const receivedWebhooks: Webhook[] = [];

// 5️⃣ Receive webhook from Service A
app.post('/webhook',
  express.json(),
  (req: Request, res: Response) => {
    console.log('\n🔔 WEBHOOK RECEIVED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━');

    const signature = req.headers['x-webhook-signature'] as string;
    const event = req.headers['x-webhook-event'] as string;
    const payload = req.body;

    console.log('Event:', event);
    console.log('Payload:', payload);

    // 6️⃣ Verify signature
    const secret = 'my_webhook_secret_123';
    const expectedSignature = verifySignature(payload, secret);

    if (signature !== expectedSignature) {
      console.log('❌ Invalid signature!');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    console.log('✅ Signature verified');

    // 7️⃣ Process webhook
    if (event === 'task.completed') {
      console.log('🎉 Task completed:', payload.taskName);
      console.log('📊 Result:', payload.result);

      // Store webhook
      receivedWebhooks.push({
        event: event,
        payload: payload,
        receivedAt: new Date()
      });

      // Do something with the result
      // - Send email
      // - Update database
      // - Trigger another task
      // etc.
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━\n');

    // 8️⃣ Respond to acknowledge receipt
    res.json({ received: true });
  }
);

// Verify signature
function verifySignature(payload: any, secret: string): string {
  const payloadString = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
}

// View received webhooks
app.get('/webhooks', (req: Request, res: Response) => {
  res.json({
    count: receivedWebhooks.length,
    webhooks: receivedWebhooks
  });
});

app.listen(3002, () => {
  console.log('🚀 Service B (Webhook Receiver) running on http://localhost:3002');
  console.log('📝 Webhook endpoint: http://localhost:3002/webhook');
});
