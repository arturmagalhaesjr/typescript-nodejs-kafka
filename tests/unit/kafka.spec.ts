// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { KafkaHandler } from '../../src/kafka/KafkaHandler';

jest.mock('kafka-node', () => {
    return {
        KafkaClient: require('./mocked/KafkaClient'),
        Producer: require('./mocked/KafkaProducer'),
        Consumer: require('./mocked/KafkaConsumer'),
    };
});
describe('Kafka handler tests', () => {
    process.env.KAFKA_HOST = 'localhost';
    process.env.KAFKA_PORT = '29092';

    const kafka = new KafkaHandler();

    test('Kafka connect', (done) => {
        console.log('yes');
        kafka.connect();
        kafka.sendTopic('topic.name', { none: 'none' });
        done();
    });
    test('Emit and event', (done) => {
        process.env.KAFKA_PARTITIONS = '1';
        process.env.KAFKA_REPLICATION = '1';
        kafka.connect();
        kafka.sendTopic('topic.name', { none: 'none' });
        done();
    });
    test('handle topics', (done) => {
        kafka.handleTopics([
            {
                topic: 'test',
                callback() {
                    console.log('yes');
                },
            },
        ]);
        done();
    });
});
