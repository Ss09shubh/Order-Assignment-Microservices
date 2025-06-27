const amqp = require('amqplib');
require('dotenv').config();

let connection = null;
let channel = null;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    
    // Handle connection close
    connection.on('close', () => {
      console.log('RabbitMQ connection closed');
      global.rabbitmqConnected = false;
      setTimeout(reconnect, 5000);
    });
    
    // Handle connection error
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      global.rabbitmqConnected = false;
    });
    
    channel = await connection.createChannel();
    
    await channel.assertQueue('order_queue', { durable: true });
    console.log('RabbitMQ connected');
    global.rabbitmqConnected = true;
    return channel;
  } catch (error) {
    console.error('RabbitMQ connection error:', error);
    global.rabbitmqConnected = false;
    throw error;
  }
};

const reconnect = async () => {
  try {
    console.log('Attempting to reconnect to RabbitMQ...');
    await connectRabbitMQ();
  } catch (error) {
    console.error('RabbitMQ reconnection failed:', error);
    setTimeout(reconnect, 5000);
  }
};

const getChannel = () => channel;

const isConnected = () => {
  return connection !== null && channel !== null && global.rabbitmqConnected === true;
};

module.exports = { connectRabbitMQ, getChannel, isConnected };