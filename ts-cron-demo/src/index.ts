import cron from "node-cron";

cron.schedule("*/20 * * * * *", () => {
    const currentTime = new Date().toLocaleTimeString();
    console.log(`Hello from cron job! Time: ${currentTime}`);
});