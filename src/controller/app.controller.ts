import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AppService } from './../services';
import { UploadResponseDTO } from './../dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        filename: (_request, file, callback) =>
          callback(null, `${new Date().getTime()}-${file.originalname}`),
      }),
    }),
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/form-data')
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<UploadResponseDTO> {
    return this.appService.processFile(file.path);
  }

  @Get('age/distribute')
  ageWiseDistribution() {
    return this.appService.ageWiseDistribution();
  }

  @Get('sample')
  sample() {
    return this.appService.sample();
  }

  @Get('sample1')
  sample1() {
    return this.appService.sample1();
  }

}
