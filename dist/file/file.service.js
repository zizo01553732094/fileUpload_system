"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const file_model_1 = require("./file.model");
let FileService = class FileService {
    constructor(fileModel) {
        this.fileModel = fileModel;
    }
    async processFile(file) {
        const fileData = {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
        };
        await this.fileModel.create(fileData);
        const calculatedValue = this.calculateValue(file);
        await this.publishToRabbitMQ(calculatedValue);
        return 'File uploaded successfully';
    }
    calculateValue(file) {
        return file.size * 2;
    }
    async publishToRabbitMQ(value) {
        const amqp = require('amqplib');
        const url = 'amqp://localhost';
        const queue = 'file_queue';
        try {
            const connection = await amqp.connect(url);
            const channel = await connection.createChannel();
            await channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(value.toString()));
            console.log('[RabbitMQ] Message sent to ${queue}: ${value}');
            await channel.close();
            await connection.close();
        }
        catch (error) {
            console.error('[RabbitMQ] Error:', error);
        }
    }
};
exports.FileService = FileService;
exports.FileService = FileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(file_model_1.File.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FileService);
//# sourceMappingURL=file.service.js.map