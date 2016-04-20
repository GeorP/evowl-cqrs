import {RabbitMQConnector} from './RabbitMQConnector';
import {RPCOperationSender} from './RPCOperationSender';

const commandName = 'foo.ping';
const EXCHANGE = 'test2';
const connector = new RabbitMQConnector({host: 'amqp://localhost'});
connector.connect();
const sender = new RPCOperationSender(connector, EXCHANGE);
sender.ready.then(
    () => sender.execute(commandName, JSON.stringify({test: 'me'}))
).then(
    result => {
        console.log('Operation processed, result: ', result);
    }
);
