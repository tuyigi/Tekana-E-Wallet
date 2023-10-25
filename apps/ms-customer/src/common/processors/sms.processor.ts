import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { SmsDto } from '@app/common/dtos/sms.dto';
import axios from 'axios';

@Processor(process.env.QUEUE_NAME)
export class SmsProcessor {
  /**
   * A Processor for sending OTP SMS
   * @param job
   */
  @Process()
  async sendSMS(job: Job) {
    const smsData: SmsDto = job.data;
    try {
      const url = `${process.env.SMS_GATEWAY_URL}`;
      const data: URLSearchParams = new URLSearchParams();
      data.append('recipients', smsData.phoneNumber);
      data.append('message', smsData.message);
      data.append('sender', process.env.SMSSENDERID);
      const auth = {
        username: process.env.SMSUSERNAME,
        password: process.env.SMSPASSWORD,
      };
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const response = await axios.post(url, data, {
        auth,
        headers,
      });
    } catch (e) {
      /**
       * Throw the error so that the job can be retried if it failed
       */
      throw e;
    }
  }
}
