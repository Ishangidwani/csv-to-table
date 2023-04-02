import { ApiProperty } from '@nestjs/swagger';
import { MemoryDetailDTO } from './memory-usage.dto';

export class UploadResponseDTO {
  @ApiProperty({
    description: 'File size uploaded',
  })
  fileSize: string;

  @ApiProperty({
    description: 'Seconds it consumed for processing',
  })
  seconds: string;

  @ApiProperty({
    description: 'Total records',
  })
  totalRecords: number;

  @ApiProperty({
    description: 'Total memory consumed while processing',
  })
  memory: MemoryDetailDTO;
}

