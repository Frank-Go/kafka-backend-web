const kafka = require('kafka-node');
const HighLevelConsumer = kafka.HighLevelConsumer;
const HighLevelProducer = kafka.HighLevelProducer;
const Client = kafka.Client;

const createTopics = (client, topics) => {
    let producer = new HighLevelProducer(client, { requireAcks: 1 });
    return new Promise((resolve, reject) => {
        producer.on('ready', function (errProducer, dataProducer) {
            producer.createTopics(topics, true, function (err, data) {
                if (!err) {
                    resolve(true);
                } else {
                    console.error('Error create Topics', err);
                    reject();
                }
            });
        })
    });
};

exports.subscribeToTopics = function (topics, socket) {
    let client = new Client(process.env.KAFKA_SERVER_URL);

    try {
        // create topic before they are accessed
        createTopics(client, topics).then(topicIsCreated => {
            const clientTopics = topics.map(topic => { return { topic, partition: 0 } });
            
            let consumer = new HighLevelConsumer(client, clientTopics, { autoCommit: true });
            // if consumer reads new message
            consumer.on('message', function (data) {
                // emit broadcast
                socket.emit('broadcast', JSON.parse(data.value));
            });

            // errors get logged
            consumer.on('error', function (err) {
                console.error('error', err);
            });

            // close consumer if middleware is terminated
            process.on('SIGINT', function () {
                consumer.close(true, function () {
                    process.exit();
                });
            });

        }).then(err => {
            console.log(err);
        });
    } catch (e) {
        console.log(e);
    }
};