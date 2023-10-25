/**
 * Common DTO for sending SMS
 */
export class SmsDto {
  phoneNumber: string;
  message: string;
  senderID: string;
}
