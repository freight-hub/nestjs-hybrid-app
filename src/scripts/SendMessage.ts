import {SendMessageCommand, SQSClient} from "@aws-sdk/client-sqs";
import {ObjectId} from "mongodb";

export class SendMessage {
    private readonly sqsClient
    static readonly bookingData = {
        "_id" : new ObjectId("624e736d91a51826a0d057a9"),
        "changes" : [ ],
        "history" : [
            {
                "by" : "swivel:isabella.liu",
                "data" : {

                },
                "at" : new Date("2022-04-07T07:15:25.194+02:00"),
                "type" : "created"
            },
            {
                "by" : "system",
                "data" : {
                    "comment" : "Your booking was automatically accepted due to booking green-light"
                },
                "at" : new Date("2022-04-07T07:15:25.197+02:00"),
                "type" : "authorized"
            },
            {
                "by" : "swivel:isabella.liu",
                "data" : {
                    "when" : new Date("2022-04-07T02:00:00.000+02:00"),
                    "carrierCode" : "COSU",
                    "contractNumber" : "EWC22422"
                },
                "at" : new Date("2022-04-07T07:15:25.630+02:00"),
                "type" : "contacted"
            }
        ],
        "bookingParty" : "buyer",
        "customerReference" : "BCO",
        "shipper" : {
            "id" : null,
            "companyName" : "CLASSIC INTERNATIONAL LIMITED",
            "contactPerson" : null,
            "email" : null,
            "phone" : null,
            "address" : "ON BEHALF OF ZHEJIANG DOT LIGHTING CO.,LTD, SUITE 1328,13/F.,BLOCK 1,GOLDEN IND.BLDG, 16-26, KWAI TAK STREET,KWAI CHUANG N.T.HONG KO"
        },
        "incoterm" : "FOB",
        "transportMode" : "sea",
        "pickupAddress" : null,
        "deliveryAddress" : "ChIJadzOt3KylkcRiuSmiT1K8xk",
        "internalNotes" : "",
        "originHandlingAgent" : null,
        "destinationHandlingAgent" : null,
        "insurance" : null,
        "cargo" : [
            {
                "type" : "45G0",
                "grossWeightKg" : 7200,
                "commodity" : "",
                "quantity" : 1,
                "dimensions" : null,
                "containerSpecification" : null
            }
        ],
        "transportType" : "fcl",
        "customerID" : "C-27466",
        "originPort" : "CNNBG",
        "destinationPort" : "NLRTM",
        "consignee" : {
            "id" : null,
            "companyName" : "LEDVANCE GMBH DC MOLSHEIM",
            "contactPerson" : null,
            "email" : null,
            "phone" : null,
            "address" : "35 ROUTE ESOSPACE, 67120 MOLSHEIM FRANCE"
        },
        "notifyParty" : {
            "id" : null,
            "companyName" : "LEDVANCE GMBH DC MOLSHEIM",
            "contactPerson" : null,
            "email" : null,
            "phone" : null,
            "address" : "35 ROUTE ESOSPACE, 67120 MOLSHEIM FRANCE"
        },
        "cargoReadyAt" : new Date("2022-04-15T02:00:00.000+02:00"),
        "deliveryDueAt" : null,
        "legalEntityID" : "LE13511",
        "state" : "carrierContacted",
        "stateChangedAt" : new Date("2022-04-07T07:15:25.629+02:00"),
        "bookedAt" : new Date("2022-04-07T07:15:25.134+02:00"),
        "updatedAt" : new Date("2022-04-07T07:15:25.134+02:00"),
        "code" : "B-CNNBG-NLRTM-220407-98648",
        "bookedBy" : "swivel:isabella.liu",
        "originAssignee" : {
            "email" : "isabella.liu@forto.com",
            "id" : "61a8f02310d429001ca956e8",
            "name" : "Isabella Liu"
        },
        "swivelReference" : "CNNGBMOL000683",
        "swivelLastUpdatedAt" : new Date("2022-04-07T15:09:12.000+02:00"),
        "carrierCode" : "COSU",
        "contractNumber" : "EWC22422"
    }
    constructor() {
        this.sqsClient = new SQSClient({
            region: "us-east-1",
            endpoint: "http://localhost:4566",
            credentials: {secretAccessKey: "test", accessKeyId: "test"},
            tls: false
        })
    }

    async execute(data: any) {
        const params = {
            DelaySeconds: 10,
            MessageAttributes: {
                Title: {
                    DataType: "String",
                    StringValue: "The Whistler",
                },
                Author: {
                    DataType: "String",
                    StringValue: "John Grisham",
                },
                WeeksOn: {
                    DataType: "Number",
                    StringValue: "6",
                },
            },
            MessageBody: JSON.stringify(data),
            //MessageBody:
             //   "Information about current NY Times fiction bestseller for week of 12/11/2016.",
            // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
            // MessageGroupId: "Group1",  // Required for FIFO queues
            QueueUrl: "http://localhost:4566/000000000000/tester" //SQS_QUEUE_URL; e.g., 'https://sqs.REGION.amazonaws.com/ACCOUNT-ID/QUEUE-NAME'
        };
        try {
            const data = this.sqsClient.send(new SendMessageCommand(params));
            console.log("Success, message sent. MessageID:", data.MessageId);
            return data; // For unit tests.
        } catch (err) {
            console.log("Error", err);
        }
    }
}

new SendMessage().execute(SendMessage.bookingData).then((data) => {
    console.log("Data ", data)
})