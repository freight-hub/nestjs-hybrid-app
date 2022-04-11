import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

export class SendMessage {
  private readonly sqsClient;
  static readonly userData = {
    name: 'Viresh Mahajan',
    email: 'viresh.mahajan@forto.com',
    city: 'Berlin',
  };
  constructor() {
    this.sqsClient = new SQSClient({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: { secretAccessKey: 'test', accessKeyId: 'test' },
      tls: false,
    });
  }

  async execute(data: any) {
    const params = {
      DelaySeconds: 10,
      MessageAttributes: {
        Title: {
          DataType: 'String',
          StringValue: 'The Whistler',
        },
        Author: {
          DataType: 'String',
          StringValue: 'John Grisham',
        },
        WeeksOn: {
          DataType: 'Number',
          StringValue: '6',
        },
      },
      MessageBody: JSON.stringify(data),
      QueueUrl: 'http://localhost:4566/000000000000/tester', //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
    };
    try {
      const data = this.sqsClient.send(new SendMessageCommand(params));
      console.log('Success, message sent. MessageID:', data.MessageId);
      return data; // For unit tests.
    } catch (err) {
      console.log('Error', err);
    }
  }
}

new SendMessage().execute(SendMessage.userData).then((data) => {
  console.log('Data ', data);
});
