import {RabbitMQConnector} from './RabbitMQConnector';
import {MessageSender} from './MessageSender';

const EXCHANGE = 'message1';
const connector = new RabbitMQConnector({host: 'amqp://localhost'});
connector.connect();
const sender = new MessageSender(connector, EXCHANGE);
setTimeout(
    () => {
        console.log('Sending event test.started');
        sender.publish('test.started', JSON.stringify({test: "me"}));

        console.log('Sending event test.two');
        sender.publish('test.two', JSON.stringify({test: "two"}));

        console.log('Sending event test.three');
        sender.publish('test.three', JSON.stringify({test: "three"}));
    },
    1000
);