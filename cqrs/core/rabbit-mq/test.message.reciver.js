import {RabbitMQConnector} from './RabbitMQConnector';
import {MessageReceiver} from './MessageReceiver';
import {EventHandlersBucket} from './EventHandlersBucket';

const EXCHANGE = 'message1';
const connector = new RabbitMQConnector({host: 'amqp://localhost'});
connector.connect();


const bucket1 = new EventHandlersBucket('Test_Scenario1');
bucket1.addHandler('test.started', (event) => {
    console.log('===> Test_Scenario1 Event recieved');
    console.log(event);
    return Promise.resolve(true);
});
bucket1.addHandler('test.two', (event) => {
    console.log('===> Test_Scenario1 Event recieved');
    console.log(event);
    return Promise.resolve(true);
});

const receiver1 = new MessageReceiver(connector, EXCHANGE, bucket1);



const bucket2 = new EventHandlersBucket('Test_Scenario2');
bucket2.addHandler('test.started', (event) => {
    console.log('===> Test_Scenario2 Event recieved');
    console.log(event);
    return Promise.resolve(true);
});
bucket2.addHandler('test.three', (event) => {
    console.log('===> Test_Scenario2 Event recieved');
    console.log(event);
    return Promise.resolve(true);
});

const receiver2 = new MessageReceiver(connector, EXCHANGE, bucket2);