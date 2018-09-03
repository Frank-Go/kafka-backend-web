# kafka-backend-web
A proof of concept whether Kafka can be used as a backend

The frontend is a modified version of Flavio Copes React Chat App: https://github.com/flaviocopes/chat-app-react-redux-saga-websockets

## Setup

1. Kafka

Linux:

> cd kafka
> tar -xvzf kafka_2.11-1.1.1.tgz
> cd kafka_2.11-1.1.1
> bin/zookeeper-server-start.sh config/zookeeper.properties
> bin/kafka-server-start.sh config/server.properties

Windows:

> cd kafka
> Unpack kafka_2.11-1.1.1.tgz with 7Zip or something similar
> cd kafka_2.11-1.1.1
> bin/windows/zookeeper-server-start.sh config/zookeeper.properties
> bin/windows/kafka-server-start.sh config/server.properties

2. Middleware

> cd middleware
> yarn install
> yarn dev

3. Frontend

> cd frontend
> yarn install
> yarn start

Your browser should automatically open a new window on localhost:3000.
To test multiple clients: Open localhost:3000 in another browser.

## How it works

Whenever a user sends a new message a (Redux) action is dispatched. React Sagas is used for side effects, so the messages get's posted on a web socket.

This socket is provided by the middleware, which receives a new message via socket. This messages is processed and turned in a new kafka message, which is handed to a kafka producer. The producer then sends the message to the connected kafka instance. Kafka saves the message and provides some persistance that way.

Now the kafka consumer captures a new kafka message and therefore broadcasts the message on the socket. So all connected clients receive a new message, which is then dispatched as a (Redux) action, the state get's updated and the MessageList components get's rerendered with that user's message.

## Result

Some analysis (in german language) on the outcome can be found at:

* Heise Developer (online soon)
* [Herbstcampus conference](https://www.herbstcampus.de/veranstaltung-7230-kafka-als-backend-f%E3%BCr-webanwendungen.html?id=7230) (coming soon)
