import { ApiProperty } from "@nestjs/swagger";

export class MemoryDetailDTO {
    @ApiProperty({
      description:
        'Resident Set Size - total memory allocated for the process execution',
    })
    rss: string;
  
    @ApiProperty({
      description: 'total size of the allocated heap',
    })
    heapTotal: string;

    @ApiProperty({
      description: 'actual memory used during the execution',
    })
    heapUsed: string;
    
    @ApiProperty({
      description: ' V8 external memory',
    })
    external: string;
  }
  