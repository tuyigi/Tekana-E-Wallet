import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './modules/customer/controllers/customer.controller';
import { CustomerService } from './modules/customer/services/customer.service';
import { CustomerDto } from '@app/common/types/ms_customer';

describe('MsCustomerController', () => {
  let customerController: CustomerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService],
    }).compile();

    customerController = app.get<CustomerController>(CustomerService);
  });

  describe('root', () => {
    const request: CustomerDto = {
      email: 'gtuyishime@bk.rw',
      password: 'gyrfbjcnrr',
    } as CustomerDto;
    // it('should return "Hello World!"', () => {
    //   expect(msCustomerController.registerCustomer(request)). .toBe('Hello World!');
    // });
  });
});
