export const config = {
    "rabbitMQHost": "amqp://localhost",
    "commandBusExchange": "command-bus-tmp1",
    "eventBusExchange": "event-bus-tmp1",

    "logger": [
        {
            "filter": {
                "type": "LogFilterAny"
            },
            "formatter": {
                "type": "LogFormatterConfigurableLine"
            },
            "writer": {
                "type": "LogWriterToFile",
                "options": {
                    "filePath": "/tmp/evowl.log"
                }
            }
        }
    ]
};