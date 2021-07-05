module.exports = class KafkaClient {
    topics!: Array<any>;
    createTopics(topics: Array<any>, callback: (error: string | null, result: string | null) => void) {
        this.topics = topics;
        callback('error', 'result');
        callback(null, null);
    }
    refreshMetadata(topics: Array<any>, callback: (error: string | null, result: string | null) => void) {
        callback('error', 'result');
        callback(null, null);
        return;
    }
};
