export class ErrorNotifier {
    constructor() {
        this._ignoreMessages = ["The user aborted a request."];
    }

    get ignoreMessages() {
        return this._ignoreMessages;
    }

    registerErrorHandler() {
        let self = this;
        window.addEventListener("error", function (errorEvent) {
            self.showNotification();
        });

        window.addEventListener("unhandledrejection", function (promiseRejectionEvent) {
            // handle promise errors
            let reason = promiseRejectionEvent.reason.message;
            if (self.ignoreMessages.indexOf(reason) < 0) {
                self.showNotification();
            }
        });
    }

    showNotification() {
        alert('An unexpected error occurred. Please reload the page and try again. If the problem persists, please contact support@wazimap.co.za');
    }
}
