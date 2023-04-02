import { Logger, Injectable } from '@nestjs/common';
import { open } from 'node:fs/promises';
import { UserDao } from 'src/dao';
import { UploadResponseDTO } from '../dto';
import { UtilityService } from './utility.service';

@Injectable()
export class FileProcessingService {
  private readonly logger = new Logger(FileProcessingService.name);

  constructor(
    private readonly utility: UtilityService,
    private readonly userDao: UserDao,
  ) {}

  async processFile(filePath: string): Promise<UploadResponseDTO> {
    //Calculating time consumption for processing file
    const startTime = process.hrtime();
    //Processing file
    const processingDetails = await this.processData(filePath);
    //Evaluating total time elapased for processing file
    const elapsedSeconds = this.utility.parseHrtimeToSeconds(
      process.hrtime(startTime),
    );
    //Generating geek view
    const response = new UploadResponseDTO();
    response.fileSize = processingDetails.fileSize;
    response.seconds = elapsedSeconds;
    response.totalRecords = processingDetails.totalRecords;
    response.memory = this.utility.logMemory();
    return response;
  }

  
  async processData(fileLocation: string): Promise<{
    fileSize?: string;
    totalRecords?: number;
    error?: string;
  }> {
    // Reading file
    try {
      const file = await open(fileLocation);
      //Getting file stat
      const fileStat = await file.stat();
      const fileSizeInBytes = fileStat.size;
      // Convert the file size to megabytes
      const fileSize = this.utility.byteToMb(fileSizeInBytes);
      // Read file line by line and storing data into database
      let totalRecords = 0;
      let columnNames = [];
      for await (const line of file.readLines()) {
        if (totalRecords === 0) {
          try {
            columnNames = line.split(',').map((x) => x.trim());
          } catch (ex) {
            throw new Error('Error while processing columns at record number '+ totalRecords);
          }
        } else {
          try {
            this.transformNInsert(columnNames, line, totalRecords);
          } catch (ex) {
            throw new Error('Error while processing records at record number '+ totalRecords);
          }
        }
        totalRecords++;
      }
      //Returing file size
      return { fileSize, totalRecords };
    } catch (ex) {
      this.logger.error(ex);
    }
    return {
      error: 'Something went wrong while processing',
    };
  }

  async transformNInsert(
    columnNames: Array<string>,
    line: string,
    recordNumber: number,
  ) {
    const data = line.split(',');
    let name = '';
    let age;
    let address: any = {};
    let additional_info: any = {};
    // transforming csv and dumping that into database
    data.forEach((value, index) => {
      // validating each column name with index, verifying if the value is current for column
      if(columnNames[index] == undefined){
        this.logger.error("Record not found at "+recordNumber);
      }
      else if (columnNames[index].toLowerCase() === 'name.firstname') {
        name = value.trim() + ' ' + name.trim();
      } else if (columnNames[index].toLowerCase() === 'name.lastname') {
        name = name.trim() + ' ' + value.trim();
      } else if (columnNames[index].toLowerCase() == 'age') {
        age = parseInt(value);
      } else if (columnNames[index].toLowerCase().startsWith('address.')) {
        if (value.trim() !== '') {
          const cols = columnNames[index].split('.');
          address[cols[1]] = value.trim();
        }
      } else if (columnNames[index] != undefined && value.trim() !== '') {
        additional_info[columnNames[index]] = value.trim();
      }
    });
    if (Object.keys(additional_info).length === 0) {
      additional_info = undefined;
    }
    if (Object.keys(address).length === 0) {
      address = undefined;
    }
    if (age == undefined || isNaN(age)) {
      console.error(
        `Invalid age at record number ${recordNumber}, please fix the csv and try again`,
      );
    }
    await this.userDao.insert(name, address, additional_info, age);
  }
}
