import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const tasks:any = {};

app.post('/submit-task', async(req,res)=> {
  const {taskName, webhookUrl} = req.body;

  const taskId = `task_${Date.now()}`;
  tasks[taskId] = {
    id: taskId,
    name: taskName,
    status: 'processing',
    webhookUrl: webhookUrl,
    createdAt : new Date()
  };

  res.json({
    taskId: taskId,
    status: 'processing',
    message: 'Task is being processed. Will send webhook when done.'
  });

  processTaskAsync(taskId);
});

// Get task status
app.get('/task/:id', (req: Request, res: Response) => {
  const taskId = req.params.id as string;
  const task = tasks[taskId];

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({
    taskId: task.id,
    status: task.status,
    result: task.result
  });
});

async function processTaskAsync(taskId:string) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  tasks[taskId].status = 'completed';
  tasks[taskId].result = `Result for ${tasks[taskId].name}`;
  tasks[taskId].completedAt = new Date();
  
  console.log('✅ Task completed:', taskId);
  await Sendwebhook(taskId);
}

async function Sendwebhook(taskId : string){
  const task = tasks[taskId];
  const webhookUrl = task.webhookUrl;

  if(!webhookUrl){
    return
  }

  const payload = {
    event: 'task.completed',
    taskId: task.id,
    taskName: task.name,
    result: task.result,
    timestamp: new Date().toISOString()
  };
  
  // Create signature
  const secret = 'my_webhook_secret_123';
  const signature = createSignature(payload, secret);
  
  // Send HTTP POST
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': 'task.completed'
      },
      body: JSON.stringify(payload)
    });
    
    if (response.ok) {
      console.log('✅ Webhook sent successfully');
    } else {
      console.log('❌ Webhook failed:', response.status);
    }
  } catch (error: any) {
    console.error('❌ Webhook error:', error.message);
  }
}
function createSignature(payload: any, secret: string): string {
  const payloadString = JSON.stringify(payload);
  return crypto
    .createHmac('sha256', secret)
    .update(payloadString)
    .digest('hex');
}
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
