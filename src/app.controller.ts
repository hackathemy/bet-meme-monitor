import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SetContractAddressDto } from './dto/set-contract-address.dto';

@ApiTags('BetMeme')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('setContractAddress')
  @ApiOperation({ summary: 'Set the contract address' })
  @ApiResponse({ status: 200, description: 'Contract address updated successfully.' })
  @ApiBody({ type: SetContractAddressDto })
  setContractAddress(@Body() setContractAddressDto: SetContractAddressDto) {
    this.appService.setContractAddress(setContractAddressDto.contractAddress);
    return { message: 'Contract address updated successfully' };
  }
}
