import { schedule } from 'node-cron';
import { fetchRevenue } from "../src/v1/service/purchase.service.js";
import { DATEOFMONTH, TIMEOFSCHEDULE, } from "./config.js";
import { sendMessageToQueue } from './message.queue.js'
const scheduleTime = `0 ${TIMEOFSCHEDULE} ${DATEOFMONTH} * *`;
const scheduleSentMailMonthly = schedule(scheduleTime, async () => {
    try {
        const allRecords = await fetchRevenue();
        const batchSize = 100;
        if (allRecords?.lenght > 0) {
            for (let i = 0; i < allRecords?.length; i += batchSize) {
                const batch = allRecords.slice(i, i + batchSize);
                const dataSent = { monthlyRevenue: batch }
                sendMessageToQueue(JSON.stringify(dataSent));
                await new Promise(resolve => setTimeout(resolve, 60000));
            }
        } else {
            console.log('Records not found to perform the task inside the cron job.')
        }

    } catch (error) {
        console.error('Something went wrong while scheduling the task:', error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
});

scheduleSentMailMonthly.start();
