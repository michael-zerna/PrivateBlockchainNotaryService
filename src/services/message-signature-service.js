import bitcoin from 'bitcoinjs-lib';
import bitcoinMessage from 'bitcoinjs-message';
const level = require('level');
import { requestValidationService } from "./request-validation-service";
import { MessageSignatureResponse, MessageSignatureStatus } from "../model/message-signature";
import { validationWindowService } from "./validation-window-service";
import { FORBIDDEN } from "../error";

class MessageSignatureService {

    constructor() {
        this.db = level('./db/messageSignatures', {
            valueEncoding: 'json'
        });
    }

    async validateSignature(address, signature) {
        const requestValidation = await requestValidationService.getRequestValidation(address, false);
        if (requestValidation) {
            const isSignatureValid = bitcoinMessage.verify(requestValidation.message, address, signature);
            return this.createMessageSignatureResponse(requestValidation, isSignatureValid);
        } else {
            throw new Error(FORBIDDEN);
        }
    }

    async createMessageSignatureResponse(requestValidation, isSignatureValid) {
        const messageSignatureStatus = new MessageSignatureStatus(requestValidation.address, requestValidation.requestTimeStamp, requestValidation.message, requestValidation.validationWindow, isSignatureValid);
        const messageSignatureResponse = new MessageSignatureResponse(isSignatureValid, messageSignatureStatus);
        await this.db.put(messageSignatureStatus.address, messageSignatureResponse);
        return messageSignatureResponse;
    }

    async getValidMessageSignatureResponse(address) {
        const messageSignatureResponse = await this.getFromDb(address);
        if (messageSignatureResponse) {
            const status = messageSignatureResponse.status;
            const isValid = status.messageSignature && validationWindowService.isWithinValidationWindow(status.requestTimeStamp);
            return isValid ? messageSignatureResponse : undefined;
        }
        return undefined;
    }

    async getFromDb(address){
        try {
            return await this.db.get(address);
        } catch (e) {
            if (e.message.startsWith('Key not found')) {
                return undefined;
            } else {
                throw new Error(e.message);
            }
        }
    }
}

export const messageSignatureService = new MessageSignatureService();