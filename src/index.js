import 'babel-polyfill';
import http from 'http';
import express from 'express';
import logger from 'morgan';
import { messageSignatureService } from "./services/message-signature-service";
import { requestValidationService } from "./services/request-validation-service";
import { starService } from "./services/star-registration-service";
import { FORBIDDEN } from "./error";

/**
 * Init Express Config
 */
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('port', port);
server.listen(port);



/**
 * Request Validation Routes
 */
app.post('/requestValidation', async (req, res) => {
    const requestValidation = await requestValidationService.getRequestValidation(req.body.address, true);
    res.json(requestValidation);
});

/**
 * Message Signature Routes
 */
app.post('/message-signature/validate', async (req, res) => {
    try {
        const messageSignatureResponse = await messageSignatureService.validateSignature(req.body.address, req.body.signature);
        res.json(messageSignatureResponse);
    } catch (e) {
        const error = { error: e.message };
        if(e.message === FORBIDDEN) {
            res.status(403).json(error);
        } else {
            res.status(500).json(error)
        }
    }
});



/**
 * Block Routes
 */
const block_api = '/block';
app.get(block_api + '/:height', async (req, res) => {
    try {
        const block = await starService.getBlockByHeight(req.params.height);
        return block ? res.json(block) : res.status(404).json({ error : 'not found'});
    } catch (e) {
        res.status(500).json(e.message);
    }
});

app.post(block_api, async (req, res) => {
    try {
        const block = await starService.registerStar(req.body);
        res.json(block);
    } catch (e) {
        const error = { error: e.message };
        if (e.message === FORBIDDEN) {
            res.status(403).json(error);
        } else if (e.message === FORBIDDEN) {
            res.status(400).json(error);
        }
        else {
            res.status(500).json(error)
        }
    }

});

/**
 * Star Routes
 */
const star_api = '/star';

app.get(star_api + '/address:address', async (req, res) => {
    try {
        const block = await starService.getBlocksByAddress(req.params.address.substring(1));
        res.json(block);
    } catch (e) {
        res.status(500).json({ error : e.message});
    }
});

app.get(star_api + '/hash:hash', async (req, res) => {
    try {
        const block = await starService.getBlockByHash(req.params.hash.substring(1));
        return block ? res.json(block) : res.status(404).json({ error : 'not found'});
    } catch (e) {
        res.status(500).json(e.message);
    }
});





/**
 * Event listener for HTTP server "error" event.
 */

const onError = (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`Started on port ${bind}`);
};

server.on('error', onError);
server.on('listening', onListening);