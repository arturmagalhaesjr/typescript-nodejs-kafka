module.exports = class KafkaConsumer {
    on(method: string, callback: () => void) {
        callback();
        return;
    }
    send(arr: Array<any>, callback: (err: string | null, data: string | null) => void) {
        console.log(arr);
        callback('err', 'data');
        callback(null, null);
    }
};
