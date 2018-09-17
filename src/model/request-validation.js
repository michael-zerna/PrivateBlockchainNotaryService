export class RequestValidation {

    constructor(address, requestTimeStamp, message, validationWindow) {
        this.address = address;
        this.requestTimeStamp = requestTimeStamp;
        this.message = message;
        this.validationWindow = validationWindow;
    }
}