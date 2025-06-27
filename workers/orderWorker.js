const { connectRabbitMQ } = require('../config/rabbitmq');
const { OrderRepository } = require('../db/repositories');
const axios = require('axios');
require('dotenv').config();

async function startWorker() {
  try {
    console.log('Starting order worker...');
    
    // Connect to RabbitMQ
    const channel = await connectRabbitMQ();
    
    // Set prefetch to 1 to ensure one message at a time
    channel.prefetch(1);
    
    // Consume messages from the queue
    channel.consume('order_queue', async (msg) => {
      if (msg !== null) {
        try {
          console.log('Processing order...');
          const orderData = JSON.parse(msg.content.toString());
          
          // Process the order (in a real system, this would call vendor APIs)
          await processOrder(orderData);
          
          // Update order status
          await OrderRepository.updateStatus(orderData.orderId, 'completed');
          
          // Acknowledge the message
          channel.ack(msg);
          console.log(`Order ${orderData.orderId} processed successfully`);
          
        } catch (error) {
          console.error('Order processing error:', error);
          
          // Reject the message and requeue
          channel.nack(msg, false, true);
        }
      }
    });
    
    console.log('Order worker started and waiting for messages');
    
  } catch (error) {
    console.error('Worker startup error:', error);
    process.exit(1);
  }
}

async function processOrder(orderData) {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real system, this would call the vendor API
  const vendorApiUrl = getVendorApiUrl(orderData.vendor_id);
  
  if (!vendorApiUrl) {
    throw new Error(`Unknown vendor: ${orderData.vendor_id}`);
  }
  
  // Simulate API call
  console.log(`Sending order to vendor API: ${vendorApiUrl}`);
  
  // In a real system, this would be an actual API call
  // await axios.post(`${vendorApiUrl}/orders`, {
  //   product_id: orderData.product_id,
  //   quantity: orderData.quantity
  // });
  
  return true;
}

function getVendorApiUrl(vendorId) {
  const vendorApis = {
    vendor_a: 'http://localhost:3001',
    vendor_b: 'http://localhost:3002',
    vendor_c: 'http://localhost:3003'
  };
  
  return vendorApis[vendorId];
}

if (require.main === module) {
  startWorker();
}

module.exports = { startWorker };