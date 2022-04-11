import { DeleteMessageCommand } from '@aws-sdk/client-sqs';

export class TestScript {
  constructor() {
    // const createCommand = new CreateQueueCommand({
    //     QueueName: "http://localhost:4566/000000000000/tester",
    // })
    //const created = await sqsClient.send(createCommand);
    /* const deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle,
        };*/
    /*try {
            const data = await sqsClient.send(new DeleteMessageCommand(deleteParams));
            console.log("Message deleted", data);
        } catch (err) {
            console.log("Error", err);
        }*/
  }
}
