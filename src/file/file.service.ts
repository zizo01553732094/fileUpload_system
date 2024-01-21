import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose"; 
import { Model } from "mongoose";
import { File } from "./file.model";


@Injectable()
export class FileService {
    constructor(@InjectModel(File.name) private fileModel: Model<File>) {}

    async processFile(file): Promise<string> {
        // Save metadata in the database
        const fileData = {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        };

        await this.fileModel.create(fileData);

        // Calculate value and publish message to RabbitMQ
        const calculatedValue = this.calculateValue(file);
        await this.publishToRabbitMQ(calculatedValue);

        return 'File uploaded successfully';
    }
    private calculateValue(file): number {
        // Your calculation logic here
        return file.size * 2;
    }
    private async publishToRabbitMQ(value: number) {
        const amqp = require('amqplib');
        const url = 'amqp://localhost'; // Replace with your RabbitMQ server URL
        const queue = 'file_queue'; // Replace with your queue name

        try {
            const connection = await amqp.connect(url);
            const channel = await connection.createChannel();

            // Ensure that the queue exists
            await channel.assertQueue(queue, { durable: false });

            // Send the calculated value as a message to the queue
            channel.sendToQueue(queue, Buffer.from(value.toString()));
            console.log('[RabbitMQ] Message sent to ${queue}: ${value}');

            // Close the channel and connection
            await channel.close();
            await connection.close();
        } catch (error) {
            console.error('[RabbitMQ] Error:', error);
        }
    }
}