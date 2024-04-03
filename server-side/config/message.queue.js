import { connect } from 'amqplib';
import { QUEUENAME } from './config.js'
import { sendRevenueEmail } from './mailer.js';
let channel;

// Connect to RabbitMQ server and create channel
const initializeChannel = async () => {
    try {
        const connection = await connect('amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUENAME, { durable: false });
        console.log('Queue is Ready to send and consume messages.');
        startConsuming();
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

// Start consuming messages from the queue
const startConsuming = () => {
    try {
        channel.consume(QUEUENAME, async (msg) => {
            const dataGetFromQueue = JSON.parse(Buffer.from(msg.content).toString());
            if (dataGetFromQueue?.monthlyRevenue) {
                dataGetFromQueue?.monthlyRevenue.forEach(data => {
                    sendRevenueEmail({
                        email: data.email[0],
                        subject: 'Monthly Revenue Generate',
                        revenue: {
                            currentMonth: data.currentMonthRevenue,
                            currentYear: data.currentYearRevenue,
                            total: data.totalAmount,
                        }
                    });
                });
            } else if (dataGetFromQueue?.retailUser) {
                const batchSize = 1;
                for (let i = 0; i < dataGetFromQueue.retailUser.length; i += batchSize) {
                    const batch = dataGetFromQueue.retailUser.slice(i, i + batchSize);
                    const dataSent = { bookRelease: batch };
                    sendMessageToQueue(JSON.stringify(dataSent));
                    await new Promise(resolve => setTimeout(resolve, 6000));
                }
            } else if (dataGetFromQueue?.bookRelease) {
                dataGetFromQueue?.bookRelease.forEach(data => {
                    sendRevenueEmail(data);
                });
            } else {
                sendRevenueEmail(dataGetFromQueue);
            }
        }, { noAck: true });
    } catch (error) {
        console.error('Error occurred while consuming message:', error);
    }
}

// Send a message to the queue
const sendMessageToQueue = async (message) => {
    try {
        await channel.sendToQueue(QUEUENAME, Buffer.from(message));
        console.log('Message sent to queue');
    } catch (error) {
        console.error('Error occurred while sending message:', error);
    }
}

initializeChannel();

export { sendMessageToQueue };
