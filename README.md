# Diffie Hellman Key Exchange Test

This project aims to test a Diffie-Hellman key exchang between an app and a server

It contains:
* A NodeJS Rest API server
* A React Native (expo) Client


## Installing

Install required modules

```console
$ yarn
```

## Running

### Running the server:

Bring up a REST API server on port 3000:

```console
$ node server/index.js
````

### Running the client:

Run an expo React Native client.

```console
$ cd client/client
$ expo run
```

Once the client is running, you can click the "Perform Key Exchange" button to create a key exchange with the server.

![Screen shot](https://github.com/backupbrain/diffie-hellman-test/blob/main/client/client-screenshot.png)
