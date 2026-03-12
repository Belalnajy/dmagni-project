import { Controller, Post, Body, Headers } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('webhook/stripe')
  handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentService.handleStripeWebhook(payload);
  }

  @Post('webhook/paymob')
  handlePaymobWebhook(@Body() payload: any) {
    return this.paymentService.handlePaymobWebhook(payload);
  }
}
