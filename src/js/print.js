import { Component } from './utils';

export default class PDFPrinter extends Component {
  constructor(parent) {
    super(parent)
  }

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

  printToPDF(divClass, filename = "printout") {
    var printableArea = document.getElementsByClassName(divClass)[0];

    html2canvas(printableArea, {
      useCORS: true,
      onrendered: function (canvas) {

        var pdf = new jsPDF('p', 'pt', 'letter');

        var pageHeight = 980;
        var pageWidth = 900;
        for (var i = 0; i <= printableArea.clientHeight / pageHeight; i++) {
          var srcImg = canvas;
          var sX = 0;
          var sY = pageHeight * i; // start 1 pageHeight down for every new page
          var sWidth = pageWidth;
          var sHeight = pageHeight;
          var dX = 0;
          var dY = 0;
          var dWidth = pageWidth;
          var dHeight = pageHeight;

          window.onePageCanvas = document.createElement("canvas");
          onePageCanvas.setAttribute('width', pageWidth);
          onePageCanvas.setAttribute('height', pageHeight);
          var ctx = onePageCanvas.getContext('2d');
          ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);

          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
          var width = onePageCanvas.width;
          var height = onePageCanvas.clientHeight;

          if (i > 0) // if we're on anything other than the first page, add another page
            pdf.addPage(612, 791); // 8.5" x 11" in pts (inches*72)

          pdf.setPage(i + 1); // now we declare that we're working on that page
          pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62)); // add content to the page

        }
        pdf.save(`${filename}.pdf`);
      }
    });
  }
}
