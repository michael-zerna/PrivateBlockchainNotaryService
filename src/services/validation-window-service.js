class ValidationWindowService {

    validationWindow = 300;

    getTimeLeftForValidationWindow(requestTimeStamp) {
        const actualTime = parseInt(this.getActualTimestamp());
        const savedTime = parseInt(requestTimeStamp);
        return this.validationWindow - (actualTime - savedTime);
    }

    isWithinValidationWindow(requestTimeStamp) {
        return this.getTimeLeftForValidationWindow(requestTimeStamp) > 0;
    }

    getActualTimestamp() {
        return new Date().getTime().toString().slice(0,-3);
    }
}
export const validationWindowService = new ValidationWindowService();