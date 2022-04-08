import {CustomTransportStrategy, Server} from "@nestjs/microservices";
import {DeleteMessageCommand, ListQueuesCommand, ReceiveMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {defer, delay, filter, repeat, take, throwError} from "rxjs";

export class SQSTransportStrategy extends Server implements CustomTransportStrategy {
    private readonly queueURL
    private readonly sqsClient
    private readonly messageName

    constructor(queueURL: URL, eventName: string) {
        super();
        this.queueURL = queueURL
        this.messageName = eventName
        this.sqsClient = new SQSClient({
            region: "us-east-1",
            endpoint: this.queueURL.origin,
            credentials: {secretAccessKey: "test", accessKeyId: "test"},
            tls: false
        })
    }

    async listen(callback: (...optionalParams: unknown[]) => any): Promise<any> {
        console.log("Listening....",)
        await this.listQueues()
        // ToDo: Improve later
        defer(() => this.receiveMessage())
            .pipe(
                take(1),
                delay(10000),
                repeat(),
                filter((data) => {
                  if(data.Messages === undefined){
                      console.log("No Message Available, ignoring")
                      return false
                  }
                  return true
                }))
            .subscribe(async (data) => {
                const handler = this.messageHandlers.get(this.messageName)
                try {
                    await handler(data)
                    console.log("Message successfully Processed, now deleting it")
                    await this.deleteMessage(data.Messages[0].ReceiptHandle)
                } catch (e) {
                    console.error("Error While Processing Message: ", e)
                }
            })

    }

    close(): any {
        this.sqsClient.close()
        console.log("Closed!!")
    }

    private async listQueues(): Promise<void> {
        const command = new ListQueuesCommand({});
        const queues = await this.sqsClient.send(command);
        console.log("Following Queues are available:", queues.QueueUrls)
    }

    private async deleteMessage(receiptHandle: string): Promise<void> {
        const deleteParams = {
            QueueUrl: this.queueURL.href,
            ReceiptHandle: receiptHandle,
        };
        try {
            const data = await this.sqsClient.send(new DeleteMessageCommand(deleteParams));
            console.log("Message deleted", data);
        } catch (err) {
            console.log("Error", err);
        }
    }

    private async receiveMessage() {
        try {
            const params = {
                AttributeNames: ["SentTimestamp"],
                MaxNumberOfMessages: 1,
                MessageAttributeNames: ["All"],
                QueueUrl: this.queueURL.href,
                VisibilityTimeout: 20,
                WaitTimeSeconds: 0,
            };
            return await this.sqsClient.send(new ReceiveMessageCommand(params));
        } catch (err) {
            console.log("Receive Error", err);
            return throwError(err)
        }
    };
}