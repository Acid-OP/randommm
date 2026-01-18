import { useState } from 'react';
import './App.css';

interface TaskResponse {
  taskId: string;
  status: string;
  result?: string;
}

function App() {
  const [taskName, setTaskName] = useState<string>('');
  const [taskId, setTaskId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [result, setResult] = useState<string>('');

  // Submit task
  const submitTask = async (): Promise<void> => {
    console.log('📝 Submitting task:', taskName);

    const response = await fetch('http://localhost:3001/submit-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskName: taskName,
        webhookUrl: 'http://localhost:3002/webhook' // ← Service B endpoint
      })
    });

    const data: TaskResponse = await response.json();

    console.log('✅ Task submitted:', data);

    setTaskId(data.taskId);
    setStatus(data.status);

    // Start polling status
    pollTaskStatus(data.taskId);
  };

  // Poll for task status
  const pollTaskStatus = async (id: string): Promise<void> => {
    const interval = setInterval(async () => {
      const response = await fetch(`http://localhost:3001/task/${id}`);
      const data: TaskResponse = await response.json();

      console.log('🔄 Task status:', data.status);

      setStatus(data.status);

      if (data.status === 'completed') {
        setResult(data.result || '');
        clearInterval(interval);
        console.log('✅ Task completed!');
      }
    }, 1000);
  };

  return (
    <div className="app">
      <h1>🔔 Simple Webhook Demo</h1>

      <div className="card">
        <h2>Submit a Task</h2>

        <input
          type="text"
          placeholder="Enter task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />

        <button onClick={submitTask} disabled={!taskName}>
          Submit Task
        </button>

        {taskId && (
          <div className="status">
            <p><strong>Task ID:</strong> {taskId}</p>
            <p><strong>Status:</strong> {status}</p>
            {result && <p><strong>Result:</strong> {result}</p>}
          </div>
        )}
      </div>

      <div className="explanation">
        <h3>📚 What's Happening:</h3>
        <ol>
          <li>You submit a task</li>
          <li><strong>Service A</strong> creates the task</li>
          <li><strong>Service A</strong> starts processing (5 seconds)</li>
          <li>You get response immediately (don't wait for processing)</li>
          <li>After 5 seconds, processing completes</li>
          <li><strong>Service A sends webhook to Service B</strong></li>
          <li><strong>Service B receives webhook</strong></li>
          <li><strong>Service B processes the notification</strong></li>
          <li>Frontend polls to see status updated</li>
        </ol>

        <div className="note">
          <p><strong>💡 Key Point:</strong></p>
          <p>The webhook allows Service A to notify Service B when task is done,
          without Service B constantly checking (polling).</p>
        </div>
      </div>
    </div>
  );
}

export default App;
