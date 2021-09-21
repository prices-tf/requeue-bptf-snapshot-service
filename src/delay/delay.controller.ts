import { Controller, Get, Param } from '@nestjs/common';
import { DelayService } from './delay.service';

@Controller('delay')
export class DelayController {
  constructor(private readonly delayService: DelayService) {}

  @Get('/sku/:sku')
  async getBySKU(@Param('sku') sku: string): Promise<{ delay: number }> {
    const delay = await this.delayService.getBySKU(sku);

    return { delay };
  }
}
