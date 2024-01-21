import { Controller, Get, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileService } from './file.service';

@Controller()

export class FileController {
 
    constructor(private readonly fileService: FileService){}

    @Get() 
    getIndex() {
        return ' Wellcome to the file upload page !'; 
    }

    @Post('upload')

    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file){
        return this.fileService.processFile(file);
    }
}

