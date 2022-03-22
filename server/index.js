const http = require('http')
const { Client } = require('diffie-hellman-ts')
const restApiPort = 3000

// we will store a unique public number for each user
const serverState = {
    servers: {},
    publicNumbersForUser: {},
    clientPublicNumbers: {},
    sharedKeys: {}
}


// REST API endpoints
const handleKeyExchange = (method, httpBody) => {
    if (method !== 'POST') {
        return { status: 'error', message: 'method not supported' }
    }
    let data = null
    try {
        data = JSON.parse(httpBody)
    } catch (error) {
        return { status: 'error', message: error.toString() }
    }
    // expect a `.publicNumber` in the data
    const username = data.username
    const clientPublicNumber = data.publicNumber
    serverState.clientPublicNumbers[username] = clientPublicNumber

    // get server and server public number
    // so we can create the shared secret and
    // return the server's public number
    let server = serverState.servers[username]
    let serverPublicNumber = serverState.publicNumbersForUser[username]
    if (!server) {
        server = new Client()
        serverPublicNumber = server.generatePublicNumber()
        serverState.servers[username] = server
        serverState.publicNumbersForUser[username] = serverPublicNumber
    }
    // create the shared key from the supplied client public number
    const sharedKey = server.generateSharedSecret(clientPublicNumber)
    serverState.sharedKeys[username] = sharedKey
    
    console.log('==========================')
    console.log('Client paired:')
    console.log('==========================')
    console.log(`Username: ${username}`)
    console.log(`Client public number: ${clientPublicNumber}`)
    console.log(`Shared secret: ${sharedKey}`)

    const response = {
        status: 'success',
        message: 'shared key created',
        publicNumber: serverPublicNumber
    }
    return response
}

// REST API server
const simpleRestApiServer = http.createServer(async (req, res) => {
    console.log(req.url)
    const responseHeaders = {
        'Content-Type': 'application/json; encoding=utf-8'
    }
    let httpBody = ''
    req.on('data', chunk => {
        httpBody += chunk;
    })
    req.on('end', async () => {
        // a simple router
        if (req.url == '/dh/') {
            res.writeHead(404, responseHeaders)
            res.end(JSON.stringify(handleKeyExchange(req.method, httpBody)))
        } else {
            res.writeHead(404, responseHeaders)
            const response = { status: 'error', message: 'path not found' }
            res.end(JSON.stringify(response))
        }
    })
})



simpleRestApiServer.listen(restApiPort)
console.log(`REST API server at port ${restApiPort} is running...`)

/*
const { Client } = require('diffie-hellman-ts')
const alice = new Client()
const bob = new Client()

const alicePublicNumber = alice.generatePublicNumber()
const bobPublicNumber = bob.generatePublicNumber()

console.log('Alice Public Number:')
console.log(alicePublicNumber)
console.log('Bob Public Number:')
console.log(bobPublicNumber)

const aliceBobSharedKey = alice.generateSharedSecret(bobPublicNumber)

console.log('Alice and Bob Shared Key:')
console.log(aliceBobSharedKey)
*/
