import { Logger, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDao } from 'src/dao';
import { AgeWiseDistributionDTO, DataColumn } from 'src/dto';
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
    this.logger.log('Moving csv data to database');
    const response = await this.processFile(filePath);
    this.logger.log('Moved all records');

    this.logger.log(
      'Displaying age wise distribution, might take a while as database is committing transactions in background',
    );
    this.ageWiseDistribution();
    return response;
  }

  async sample1() {
    const filePath = this.configService.get('CSV_FILE1');
    return await this.processFile(filePath);
  }

  async ageWiseDistribution() {
    const data = await this.userDao.ageWiseDistribution();
    console.table(data);
    return data;;
  }
}
