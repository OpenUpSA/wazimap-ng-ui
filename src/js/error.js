export class Error {
    handleErrors() {
        let self = this;
        window.onerror = function () {
            self.showNotification();
        }

        window.addEventListener("unhandledrejection", function (promiseRejectionEvent) {
            // handle promise errors
            self.showNotification();
        });
    }

    showNotification() {
        alert('An unexpected error occurred. Please reload the page and try again. If the problem persists, please contact wazimap-support@openup.org.za');
    }
}