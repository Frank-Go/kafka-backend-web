const kafka                 = require('kafka-node');
const HighLevelProducer     = kafka.HighLevelProducer;
const Client                = kafka.Client;


exports.createMessage = function (message) {
    let client          = new Client(process.env.KAFKA_SERVER_URL);
    // requireAcks:1 = wait for acknowledgment of recieved message
    let producer        = new HighLevelProducer(client, {requireAcks: 1});
    const kafkaTopic    = message.topic;
    const kafkaMessage  = message.data;

    producer.on('ready', function () {
        // send massage on topic
        producer.send([{
            topic: kafkaTopic, partition: 0, messages: [JSON.stringify(kafkaMessage)], attributes: 0
        }], function(error,result) {
            if (error) {
                console.error(error);
            } else {
                // debugging: check result
                console.log('result: ', result)
            }
        });
    });

    // errors get logged
    producer.on('error', function (err) {
        console.error(err);
    });
};

