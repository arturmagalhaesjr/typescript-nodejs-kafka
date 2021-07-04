import { Consumer, KafkaClient, Producer } from 'kafka-node';
import { Service } from 'typedi';
const PARTITION = process.env['KAFKA_PARTITIONS'] ?? 1;
const REPLICATION = process.env['KAFKA_REPLICATION'] ?? 1;

type KafkaTopic = {
    topic: string;
    callback(): void;
};

@Service()
export class KafkaHandler {
    private client!: KafkaClient;
    private producer!: Producer;
    private consumer!: Consumer;

    connect(): void {
        this.client = new KafkaClient({ kafkaHost: process.env.KAFKA_HOST + ':' + process.env.KAFKA_PORT });
        this.producer = new Producer(this.client);
        this.producer.on('ready', () => {
            console.log('Connected to Kafka');
        });
        this.producer.on('error', (error) => {
            console.log(error);
        });
    }

    private createTopic(topicName: string): void {
        this.client.createTopics(
            [
                {
                    topic: topicName,
                    partitions: parseInt(PARTITION.toString()),
                    replicationFactor: parseInt(REPLICATION.toString()),
                    configEntries: [
                        {
                            name: 'compression.type',
                            value: 'gzip',
                        },
                        {
                            name: 'min.compaction.lag.ms',
                            value: '50',
                        },
                    ],
                },
            ],
            (error, result) => {
                if (error) {
                    console.log(error);
                }
                console.log(result);
            },
        );
    }

    handleTopics(topics: Array<KafkaTopic>): void {
        topics.forEach((topic) => {
            this.createTopic(topic.topic);
        });
        this.consumer = new Consumer(
            this.client,
            topics.map((topic) => {
                return topic.topic;
            }),
            {},
        );
    }

    sendTopic(topicName: string, data: any): void {
        this.createTopic(topicName);
        this.client.refreshMetadata([topicName], (error) => {
            if (error) console.log(error);
        });
        this.producer.send(
            [
                {
                    topic: topicName,
                    messages: JSON.stringify(data),
                },
            ],
            (err, data) => {
                if (err) {
                    console.error(err);
                }
                console.log(data);
            },
        );
    }
}
