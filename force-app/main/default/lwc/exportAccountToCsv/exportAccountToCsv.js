import { LightningElement, track, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import ENCODING from '@salesforce/resourceUrl/encoding';
import FILESAVER from '@salesforce/resourceUrl/filesaver';
import getAccounts from '@salesforce/apex/AccountList.getAccounts';

/**
 * データテーブルのカラム定義
 */
const columns = [
    { label: '取引先名', fieldName: 'Name'},
    { label: '都道府県', fieldName: 'BillingState'}
];

export default class ExportAccountToCsv extends LightningElement {
    /**
     * 取引先情報
     */
    @wire(getAccounts)
    wiredGetAccounts({error, data}) {
        if (data) {
            this.record = data;
        } else {
            this.record = undefined;
        }
    }

    @track
    record;

    /**
     * データテーブルのカラム定義
     */
    @track
    columns = columns;

    /**
     * 初期処理
     */
    connectedCallback() {
        // Javascriptライブラリをロードする
        Promise.all([
            loadScript(this, ENCODING),
            loadScript(this, FILESAVER)
        ]);
    }

    /**
     * 表示している取引先をCSVにエクスポートする
     * @param {*} event イベント情報
     */
    handleExportClick(event) {
        // 改行
        const crlf = '\r\n';
        // デリミタ文字
        const delimiter = ',';
        // ダブルクォーテーション
        const dq = '\"';
        
        // CSV形式の文字列を作成する
        let csvdata = '';
        for(let i=0 ; i<this.record.length ; i++) {
            csvdata += dq + this.record[i].Name + dq;
            csvdata += delimiter;
            csvdata += dq + this.record[i].BillingState + dq;
            csvdata += crlf;
        }

        // CSVデータをShiftJISに変換する
        const unicodeList = [];
        for(let i=0 ; i<csvdata.length ; i++) {
            unicodeList.push(csvdata.charCodeAt(i));
        }
        const shiftjisList = Encoding.convert(unicodeList, 'sjis', 'unicode');
        const uInt8List = new Uint8Array(shiftjisList);

        // ダウンロードするデータを作成する
        // MIMEタイプはtext/csvを指定するのが普通だが、Salesforce Lockerサービスではサポートしていないためtext/plainを指定
        // https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_js_mime.htm
        const downloadData = new Blob([uInt8List], { type: 'text/plain' });

        // ファイルをダウンロードする
        saveAs(downloadData, `Accounts.csv`);
    }
}