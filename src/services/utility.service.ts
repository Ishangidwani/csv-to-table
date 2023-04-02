import { Logger, Injectable } from '@nestjs/common';
import { MemoryDetailDTO } from '../dto';

@Injectable()
export class UtilityService {
  private readonly logger = new Logger(UtilityService.name);

  logMemory(): MemoryDetailDTO {
    //getting memory usage from process thread
    const memoryData = process.memoryUsage();
    //generating process response
    const memoryUsage = new MemoryDetailDTO();
    memoryUsage.external = this.byteToMb(memoryData.external);
    memoryUsage.rss = this.byteToMb(memoryData.rss);
    memoryUsage.heapTotal = this.byteToMb(memoryData.heapTotal);
    memoryUsage.heapUsed = this.byteToMb(memoryData.heapUsed);
    return memoryUsage;
  }

  byteToMb(data: number){
    if(isNaN(data)){
      this.logger.error("Invalid number");
    }
    return `${Math.round(data / 1024 / 1024).toFixed(2)} MB`;
  };

  //calculating seconds it consumed for processing file
  parseHrtimeToSeconds(hrtime: Array<number>) {
    var seconds = (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
    return seconds;
  }
}
