import { ApiProperty } from '@nestjs/swagger';

export class AddressDTO {
  @ApiProperty({ default: 'A-563 Rakshak Society' })
  line1: string;
  @ApiProperty({ default: 'New Pune Road' })
  line2: string;
  @ApiProperty({ default: 'Pune' })
  city: string;
  @ApiProperty({ default: 'Maharashtra' })
  state: string;
}
export class NameDTO {
  @ApiProperty({ default: 'Rohit' })
  firstName: string;
  @ApiProperty({ default: 'Prasad' })
  lastName: string;
}
export class UserDTO {
  @ApiProperty()
  name: NameDTO;
  @ApiProperty()
  address: AddressDTO;
  @ApiProperty({ default: 'Male' })
  gender: string;
  @ApiProperty({ default: 35 })
  age: number;
}
