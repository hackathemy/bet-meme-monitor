import { ApiProperty } from '@nestjs/swagger';

export class SetContractAddressDto {
  @ApiProperty({
    description: 'The address of the smart contract',
    example: '0x1234567890abcdef1234567890abcdef12345678',
  })
  contractAddress: string;
}
