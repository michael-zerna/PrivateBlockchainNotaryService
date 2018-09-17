export class MessageSignatureResponse {

    constructor(registerStar, status) {
        this.registerStar = registerStar;
        this.status = status;
    }
}

export class MessageSignatureStatus {

    constructor(address, requestTimeStamp, message, validationWindow, messageSignature) {
        this.address = address;
        this.requestTimeStamp = requestTimeStamp;
        this.message = message;
        this.validationWindow = validationWindow;
        this.messageSignature = messageSignature;
    }

}