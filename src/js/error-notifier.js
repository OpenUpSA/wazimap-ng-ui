export class ErrorNotifier {
  registerErrorHandler() {
    let self = this;
        window.addEventListener("error", function (errorEvent) {
            self.showNotification();
        });

        window.addEventListener("unhandledrejection", function (promiseRejectionEvent) {
            // handle promise errors
            self.showNotification();
        });
    }

    showNotification() {
        //alert('An unexpected error occurred. Please reload the page and try again. If the problem persists, please contact support@wazimap.co.za');
    }
}
