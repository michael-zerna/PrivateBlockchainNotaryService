# PrivateBlockchainNotaryService

This is a example for setting up an Private Blockchainfor with Bitcoin Identity and register a Star via Webservice

- Node.js framework RESTful API: Express
- Node.js tested version: 9.5.0
- Using Babel
- Separate databases for blockchain, message signing and request generation.

comments
---------------
This project is far from my productive requirements. The request parameters were not checked for completeness or correctness. Therefore I ask you to pass the parameters correctly. Also the error handling is certainly not enough and has a lot of code duplication especially within the API. 

### Lets get started to register a star

#### 1. Install dependencies
```sh
npm install
```
#### 2. Build and start api on port 8000
```sh
npm start
```
#### 3. Request validation
```sh
curl -X "POST" "http://localhost:8000/requestValidation" -H 'Content-Type: application/json; charset=utf-8' -d $'{ "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J"}'
```
##### Example response
```sh
{
    "address":"1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
    "requestTimeStamp":"1535829495",
    "message":"1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J:1535829495:starRegistry",
    "validationWindow":300
}
```

#### 4. Request for user message signature
```sh
curl -X "POST" "http://localhost:8000/message-signature/validate" -H 'Content-Type: application/json; charset=utf-8' -d $'{ "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J", "signature": "﻿H+2s6QzvqyHqQCmENaumQL8xJdg4w4eC9kEWpSpN+ncxVrUrQ/AauNCAZI6iLumm+/Nevv1FRPEHtIiHjh9uX8M="}'
```
##### Example response if successful

```sh
{
    "address":"1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
    "requestTimeStamp":"1535829495",
    "message":"1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J:1535829495:starRegistry",
    "validationWindow":300
}
```

#### 5. Add new star 

```sh
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json; charset=utf-8' -d $'{"address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J","star": {"dec": "-26° 29' 24.9","ra": "16h 29m 1.0s","story": "Found star using https://www.google.com/sky/"}}'
```
##### Example response
```sh
{
    "hash": "bede121fb62a8edf964821902ce712eaa5d3d61bb858d36e44fd42d66558d2be",
    "height": 2,
    "body": {
        "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        }
    },
    "time": "1535830051",
    "previousBlockHash": "1205feff0b464cd3d8c48adf2f4e629f5aea9a89f4a494976fd766ac9d7ea0d6"
}
```

### Reguest against blockchain

#### Get Star by block height
```sh
curl http://localhost:8000/block/1
```
##### Example response

```sh
{
    "hash": "1205feff0b464cd3d8c48adf2f4e629f5aea9a89f4a494976fd766ac9d7ea0d6",
    "height": 1,
    "body": {
        "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1535827663",
    "previousBlockHash": "eb972b40fa202d53a027d7bc87d290c8d4b45063a18e1e608d012346a8237a77"
}
```

#### Get Star by block hash
```sh
curl http://localhost:8000/star/hash:1205feff0b464cd3d8c48adf2f4e629f5aea9a89f4a494976fd766ac9d7ea0d68
```
##### Example response

```sh
{
    "hash": "1205feff0b464cd3d8c48adf2f4e629f5aea9a89f4a494976fd766ac9d7ea0d6",
    "height": 1,
    "body": {
        "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
        "star": {
            "dec": "-26° 29' 24.9",
            "ra": "16h 29m 1.0s",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "time": "1535827663",
    "previousBlockHash": "eb972b40fa202d53a027d7bc87d290c8d4b45063a18e1e608d012346a8237a77"
}
```

#### Get Stars by address
```sh
curl http://localhost:8000/star/address:1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J
```
##### Example response

```sh
[
    {
        "hash": "eb972b40fa202d53a027d7bc87d290c8d4b45063a18e1e608d012346a8237a77",
        "height": 0,
        "body": {
            "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1535827329",
        "previousBlockHash": ""
    },
    {
        "hash": "1205feff0b464cd3d8c48adf2f4e629f5aea9a89f4a494976fd766ac9d7ea0d6",
        "height": 1,
        "body": {
            "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1535827663",
        "previousBlockHash": "eb972b40fa202d53a027d7bc87d290c8d4b45063a18e1e608d012346a8237a77"
    },
    {
        "hash": "bede121fb62a8edf964821902ce712eaa5d3d61bb858d36e44fd42d66558d2be",
        "height": 2,
        "body": {
            "address": "1HHbtQcDm4Y9UdWh1oUaTNBq5mtEQAYU5J",
            "star": {
                "dec": "-26° 29' 24.9",
                "ra": "16h 29m 1.0s",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "time": "1535830051",
        "previousBlockHash": "1205feff0b464cd3d8c48adf2f4e629f5aea9a89f4a494976fd766ac9d7ea0d6"
    }
]
```