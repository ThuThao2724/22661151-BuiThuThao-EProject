const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/order");
const amqp = require("amqplib");
const config = require("./config");

class App {
  constructor() {
    this.app = express();
    this.connectDB();
    this.setupOrderConsumer();
    this.setupRoutes();
  }

  setupRoutes() {
    this.app.get("/health", (req, res) => res.status(200).send("OK"));
  }

  async connectDB() {
    try {
      await mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("MongoDB connected");
    } catch (err) {
      console.error("MongoDB connection failed:", err.message);
      process.exit(1); // crash container nếu DB không connect
    }
  }

  async setupOrderConsumer() {
    console.log("Connecting to RabbitMQ...");
    setTimeout(async () => {
      try {
        const connection = await amqp.connect(config.rabbitMQURI);
        console.log("Connected to RabbitMQ");
        const channel = await connection.createChannel();
        await channel.assertQueue(config.rabbitMQQueue);

        channel.consume(config.rabbitMQQueue, async (data) => {
          const { products, username, orderId } = JSON.parse(data.content);
          const newOrder = new Order({
            products,
            user: username,
            totalPrice: products.reduce((acc, p) => acc + p.price, 0),
          });
          await newOrder.save();
          channel.ack(data);

          const { user, products: savedProducts, totalPrice } = newOrder.toJSON();
          channel.sendToQueue(
            "products",
            Buffer.from(JSON.stringify({ orderId, user, products: savedProducts, totalPrice }))
          );
        });
      } catch (err) {
        console.error("RabbitMQ connection failed:", err.message);
      }
    }, 10000);
  }

  start() {
    this.server = this.app.listen(config.port, () =>
      console.log(`Server started on port ${config.port}`)
    );
  }

  async stop() {
    await mongoose.disconnect();
    this.server.close();
    console.log("Server stopped");
  }
}

module.exports = App;
