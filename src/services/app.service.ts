import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDao } from 'src/dao';
import {
  AgeWiseDistributionDTO,
  DataColumn,
} from 'src/dto';
import { FileProcessingService } from './file-processing.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly userDao: UserDao,
    private readonly fileProcessing: FileProcessingService,
  ) {}

  async processFile(filePath: string) {
    return await this.fileProcessing.processFile(filePath);
  }

  async sample() {
    const filePath = this.configService.get('CSV_FILE');
    return await this.fileProcessing.processFile(filePath);
  }

  async sample1() {
    const filePath = this.configService.get('CSV_FILE1');
    return await this.fileProcessing.processFile(filePath);
  }

  async ageWiseDistribution() {
    const response = new AgeWiseDistributionDTO();
    response.columns = [];
    const col1 = new DataColumn();
    col1.name = 'Age-Group';
    col1.type = 'string';
    response.columns.push(col1);
    const col2 = new DataColumn();
    col2.name = '% Distribution';
    col2.type = 'string';
    response.columns.push(col1);
    response.data = await this.userDao.ageWiseDistribution();
    return response;
  }
}
