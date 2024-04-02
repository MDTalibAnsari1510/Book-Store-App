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
        channel.consume(QUEUENAME, (msg) => {
            const dataGetFromQueue = JSON.parse(Buffer.from(msg.content).toString())
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

                })
            } else {
                sendRevenueEmail(dataGetFromQueue);
            }

            console.log("Received message from queue");
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
