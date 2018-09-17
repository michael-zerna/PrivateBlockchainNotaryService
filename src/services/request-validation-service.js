import {RequestValidation} from "../model/request-validation";
import { validationWindowService } from "./validation-window-service";

const level = require('level');


class RequestValidationService {


    constructor(){
        this.db = level('./db/requestValidation', {
            valueEncoding: 'json'
        });
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

    async createRequestValidation(address) {
        const requestTimeStamp = validationWindowService.getActualTimestamp();
        const message = this.getMessageToValidate(address, requestTimeStamp);
        const requestValidation = new RequestValidation(address, requestTimeStamp, message, validationWindowService.validationWindow);
        await this.db.put(address, requestValidation);
        return requestValidation;
    }

    async getRequestValidation(address, createNewEntry) {
        const requestValidation = await this.getFromDb(address);
        if (requestValidation) {
            const timeLeft = validationWindowService.getTimeLeftForValidationWindow(requestValidation.requestTimeStamp);
            if (timeLeft > 0) {
                requestValidation.validationWindow = timeLeft;
                await this.db.put(address, requestValidation);
                return requestValidation;
            } else if (createNewEntry) {
                return this.createRequestValidation(address);
            }
        } else if (createNewEntry) {
            return this.createRequestValidation(address);
        }
        return undefined;
    }

    getMessageToValidate(address, timestamp) {
        return `${address}:${timestamp}:starRegistry`;
    }
}
export const requestValidationService = new RequestValidationService();