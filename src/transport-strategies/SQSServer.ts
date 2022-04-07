import {CustomTransportStrategy, Server} from "@nestjs/microservices";
import {CreateQueueCommand, ListQueuesCommand, SQSClient} from "@aws-sdk/client-sqs";
import {
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import {
    defer,
    delay,
    repeat,
    take,
    throwError
} from "rxjs";
import {IncomingRequestDeserializer} from "@nestjs/microservices/deserializers/incoming-request.deserializer";

export class SQSServer extends Server implements CustomTransportStrategy {
    constructor() {
        super();
    }
    listen(callback: (...optionalParams: unknown[]) => any): any {
        console.log("Listening....", new Date())

// Set the parameters
        const queueURL = "http://localhost:4566/000000000000/tester"; //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
        const sqsClient = new SQSClient({
            region: "us-east-1",
            endpoint: "http://localhost:4566",
            credentials: {secretAccessKey: "test", accessKeyId: "test"},
            tls: false
        })
        const params = {
            AttributeNames: ["SentTimestamp"],
            MaxNumberOfMessages: 1,
            MessageAttributeNames: ["All"],
            QueueUrl: "http://localhost:4566/000000000000/tester",
            VisibilityTimeout: 20,
            WaitTimeSeconds: 0,
        };

        const run = async () => {
            try {
                // const command = new ListQueuesCommand({});
                //const queues = await sqsClient.send(command);
                //console.log("Queues are", queues)
                const data = await sqsClient.send(new ReceiveMessageCommand(params));
                if (data.Messages) {
                    //console.log("Messages: ", JSON.parse(data.Messages[0].Body))
                } else {
                    console.log("No messages to delete");
                }
                return data; // For unit tests.
            } catch (err) {
                console.log("Receive Error", err);
                return throwError(err)
            }
        };

        // ToDo: Improve later
        defer(() => run())
            .pipe(
                take(1),
                delay(10000),
                repeat())
            .subscribe(async (data) => {
                const handler = this.messageHandlers.get("hello-test")
                await handler(data)
                //console.log("Data Received", data)
            })

    }

    close(): any {
        console.log("Closed!!")
    }

    private listQueues(): void {

    }
}