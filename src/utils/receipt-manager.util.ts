import pdfMake from "pdfmake/build/pdfmake";
import type { TDocumentDefinitions } from "pdfmake/interfaces";

export class ReceiptManager {
  private static _instance: ReceiptManager;

  private constructor() {
    this._initializeFonts();
  }

  public static getInstance(): ReceiptManager {
    if (ReceiptManager._instance) {
      return ReceiptManager._instance;
    }

    return new ReceiptManager();
  }

  private _initializeFonts(): void {
    pdfMake.fonts = {
      Roboto: {
        normal:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Regular.ttf",
        bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Medium.ttf",
        italics:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-Italic.ttf",
        bolditalics:
          "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/fonts/Roboto/Roboto-MediumItalic.ttf",
      },
    };
  }

  public downloadReceipt(data: TDocumentDefinitions, id: number): void {
    pdfMake.createPdf(data).download(`order-receipt-${id}.pdf`);
  }

  public printReceipt(data: TDocumentDefinitions): void {
    pdfMake.createPdf(data).print();
  }
}
