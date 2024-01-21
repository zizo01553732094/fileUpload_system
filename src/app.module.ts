import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { File, FileSchema } from './file/file.model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/fileUpload'),
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema}]),
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class AppModule {}
