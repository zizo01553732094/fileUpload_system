import { FileService } from './file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    getIndex(): string;
    uploadFile(file: any): Promise<string>;
}
