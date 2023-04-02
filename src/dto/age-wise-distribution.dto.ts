import { ApiProperty } from '@nestjs/swagger';

export class DataColumn {
  @ApiProperty()
  name: string;
  @ApiProperty()
  type: string;
}
export class AgeWiseDistributionDTO {
  @ApiProperty()
  columns: Array<DataColumn>;
  @ApiProperty() 
  data: Array<any>;
}
