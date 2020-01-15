import {Observer} from './utils';

export default class PDFPrinter {
    constructor() {
        this.observer = new Observer();
        //$("#profile-print").on("click", el => this.printDiv())
        //document.getElementById('profile-print').setAttribute("onclick", "printDiv()");
    }

    on = (event, func) => {
        this.observer.on(event, func);
    };

    triggerEvent = (event, payload) => {
        this.observer.triggerEvent(event, payload);
    };

    printDiv = (payload) => {
        let filename = 'geography';
        if (payload.payload != undefined)
            filename = payload.payload;

        console.log(payload);
        const css = this.getCss();
        const style = `<style style = 'display:none;'>${css} *{display:block} .data-category__title_wrapper--with-icon{margin-left:0px;} @media print { .indicator__chart { display:block; page-break-inside: avoid; }}</style>`;
        const printWindow = document.getElementsByClassName('content__charts-area_main')[0];
        const divToPrint = document.createElement('div');

        divToPrint.innerHTML = printWindow.innerHTML;

        const newWin = window.open('', 'Print-Window');

        newWin.document.open();
        newWin.document.write(`<html><head>${style}</head><body onload="window.print()">${divToPrint.innerHTML}</body></html>`);
        newWin.document.title = filename;
        newWin.document.close();

        this.triggerEvent("profilePrinted")
    }

    getCss() {
        return "@media print{.data-category__header_icon{display:none;}.indicator__chart_options{display:none;}.content__charts-area_bumper{display:none;}} body{font-family:Roboto,sans-serif;font-size:14px;margin:0;min-height:100%;background-color:#fff;line-height:20px;color:#333}.indicator__chart_container rect.bar {fill: #e4653d;}.content__charts-area_main{max-width:960px;margin-right:auto;margin-left:auto}.grid__module_container{display:block;width:100%;padding-right:12px;padding-left:12px}.location-profile__header{margin-bottom:32px;padding-bottom:48px;border-bottom:1px solid #000}.grid__module_col{margin-bottom:12px;padding-right:12px;padding-left:12px}.location-header_title{color:#000}h1{margin-top:30px;font-size:2.8em;font-weight:500}h1,h2{margin-bottom:10px;line-height:110%}h2{margin-top:20px;color:#000;font-size:2em;font-weight:700;letter-spacing:.15em}.key-metric_title{color:#999;font-size:.8em;line-height:1.3em}.key-metric_value{margin-bottom:2px;font-size:1.8em;line-height:1em}.key-metric,.key-metrics{display:flex}.key-metrics{margin-right:10px;margin-left:10px}.key-metrics_title{margin-top:8px;margin-bottom:-6px;padding-left:4px;font-size:.9em;line-height:140%;letter-spacing:1.5px;text-transform:uppercase}.key-metric{max-width:30%;min-width:22%;margin:4px;padding:10px 12px 8px;flex-direction:column;border-radius:2px;background-color:rgba(0,0,0,.06)}.location-header__key-metrics_source{margin-top:6px;padding-left:4px}.location-header__key-metrics_source,.point-data__trigger_close{display:flex;align-items:center}.indicator__chart_footnote,.key-metrics_title{color:#999}.chart__footer_label{color:#333;font-size:.85em}.chart__data-source{display:flex;height:32px;margin-left:4px;padding-right:8px;padding-left:8px;-ms-flex-align:center;align-items:center;font-size:.85em;text-decoration:underline}.location-profile__data-category--first{margin-bottom:64px;padding-top:32px}.data-category__header{padding-bottom:24px;flex-direction:column;border-bottom:1px dashed #ccc}.data-category__header_subtitle,.data-category__header_title{text-transform:uppercase}.data-category__title_wrapper--with-icon{position:relative;margin-bottom:-2px}.data-category__title_underline--with-icon{position:absolute;top:auto;right:auto;bottom:-7px;z-index:-1;width:60%;height:10px;background-color:#f55b2c}.data-category__header_subtitle{color:#999;font-size:.9em;line-height:140%;letter-spacing:1.5px}.grid__module_col.col_1{max-width:8.3333333%}.grid__module_col.col_2{max-width:16.666667%}.grid__module_col.col_3{max-width:25%}.grid__module_col.col_4{max-width:33.33333%}.grid__module_col.col_5{max-width:41.666666%}.grid__module_col.col_6{max-width:50%}.grid__module_col.col_7{max-width:58.3333%}.grid__module_col.col_8{max-width:66.66666%}.grid__module_col.col_9{max-width:75%}.grid__module_col.col_10{max-width:83.333333%}.grid__module_col.col_11{max-width:91.6666%}.grid__module_col.col_12{max-width:100%}.data-category__indicator{border-bottom:1px dashed #e6e6e6}.indicator__header{margin-bottom:16px}.indicator__title{position:relative;margin-top:24px;margin-bottom:12px}.data-category__header_description,.indicator__title{display:flex}.indicator__title_wrapper{position:relative}h3,h4{margin-top:10px;margin-bottom:10px}h3{font-size:1.8em;line-height:30px;font-weight:700}h4{font-size:1.4em;line-height:24px;font-weight:500}.h2__line-v{position:absolute;left:-2px;top:auto;right:0;bottom:8px;z-index:-1;height:4px;background-color:#f55b2c}p{font-size:1em;line-height:170%;margin-top:0}h5,p{margin-bottom:10px}.indicator__chart{margin-top:11px;margin-bottom:11px}.indicator__chart_header{margin-bottom:8px}.indicator__chart_title{font-weight:500}img{max-width:100%;vertical-align:middle;border:0}.divider{height:1px;background-color:#e6e6e6}.location-profile__data-category{position:relative;margin-bottom:64px;padding-top:64px;border-top:1px solid #000}.location-header_breadcrumbs{margin-bottom:-30px}.location-header__breadcumbs_wrapper,.location-header_breadcrumbs{display:flex}.location-header__breadcumbs_wrapper{margin:-4px}.breadcrumb{height:24px;margin:4px;padding-right:8px;padding-left:8px;align-items:center;border-radius:2px;background-color:#333;color:hsla(0,0%,100%,.63);font-size:.85em}.chart__footer_label,.indicator__chart_source{flex:0 0 auto}";
    }
}
