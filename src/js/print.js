import {Observable} from './utils';

export default class PDFPrinter extends Observable {
    printDiv(payload) {
        let filename = 'geography';
        if (payload.payload != undefined)
            filename = payload.payload;

        console.log(payload);

        const style = `
            <title style='display:none'>${filename}</title>
            <link href="css/wazi.webflow.css" rel="stylesheet" type="text/css">
            `
        const printWindow = document.getElementsByClassName('content__charts-area_main')[0];
        const div = document.createElement('div');

        div.innerHTML = printWindow.innerHTML;
        printWindow.innerHTML = div.innerHTML;
        const divToPrint = printWindow;

        const newWin = window.open('', 'Print-Window');

        newWin.document.open();
        newWin.document.write(`
            <html>
                <head>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,italic,500,500italic,700,700italic,900,900italic" media="all">
                        ${style}
                </head>
                <body onload="window.print()">${divToPrint.innerHTML}</body>
            </html>'`
        );


        newWin.document.close();

        this.triggerEvent("profilePrinted")
    }
}

