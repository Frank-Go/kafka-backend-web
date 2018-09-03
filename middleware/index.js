const WebSocket = require('ws')
const kafkaProducer = require('./controllers/kafka.producer');
const kafkaConsumer = require('./controllers/kafka.consumer');

const wss = new WebSocket.Server({ port: 8989 })

const users = []

// broadcast message on all connected clients
const broadcast = (data, ws) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client !== ws) {
            client.send(JSON.stringify(data))
        }
    })
}

wss.on('connection', (ws) => {

    kafkaConsumer.subscribeToTopics(['ADD_USER', 'ADD_MESSAGE'], ws);

    let index
    // when client sends new message
    ws.on('message', (message) => {
        const data = JSON.parse(message)
        switch (data.type) {
            // if new user was added
            case 'ADD_USER': {
                index = users.length
                // add user to user list
                users.push({ name: data.name, id: index + 1 })
                // post new user list
                ws.send(JSON.stringify({
                  type: 'USERS_LIST',
                  users
                }))

                // create kafka message for new user list
                kafkaProducer.createMessage({
                    topic: 'ADD_USER',
                    data: {
                        type: 'USERS_LIST',
                        users
                    }
                })
                break
            }
            // if new message was posted
            case 'ADD_MESSAGE':

                // create kafka message for message
                kafkaProducer.createMessage({
                    topic: 'ADD_MESSAGE',
                    data: {
                        type: 'ADD_MESSAGE',
                        message: data.message,
                        author: data.author
                    }
                })
                break
            default:
                break
        }
    })

    // broadcast message on connected sockets
    ws.on('broadcast', (broadcastData) => {
        broadcast(broadcastData, ws)
    })

    // when sockets get closed
    ws.on('close', () => {
        // remove the user
        users.splice(index, 1)

        //create kafka message for new list
        kafkaProducer.createMessage({
            topic: 'ADD_USER',
            data: {
                type: 'USERS_LIST',
                users
            }
        })
    })
})