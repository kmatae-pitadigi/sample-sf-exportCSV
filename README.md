# Lightinging Web Component CSVエクスポートサンプル

## 概要
Lightning Web Componentで、取引先の下記項目をCSV形式(ShiftJIS)でエクスポートする
* 名称(Name)
* 請求先都道府県(BillingState)

## ポイント

### 使用ライブラリ
本サンプルプログラムでは以下のライブラリを使っている。

encoding.js https://github.com/polygonplanet/encoding.js/blob/master/README_ja.md
SalesforceはUTF-8。Lightning Web ComponentでCSVファイルを作成してもUTF-8となる。
本サンプルではShiift-JISでの出力を目的としているため、文字コードの変換が必要となる。
それを実現するためのライブラリ

FileSaver https://github.com/eligrey/FileSaver.js/
作成したCSVファイル(プログラム内部的にはBlob)をダウンロードするためのライブラリ。
自分で実装してもそんなに難しくはないが、ブラウザにより実装方法が微妙に異なるため本ライブラリを使用。

### 外部ライブラリの使い方

1.外部ライブラリ(js)を静的リソースに登録する
2.外部ライブラリをインポートする
```
import ENCODING from '@salesforce/resourceUrl/encoding';
import FILESAVER from '@salesforce/resourceUrl/filesaver';
```
3.外部ライブラリをロードする
```
connectedCallback() {
    // Javascriptライブラリをロードする
    Promise.all([
        loadScript(this, ENCODING),
        loadScript(this, FILESAVER)
    ]);
}
```
4.外部ライブラリを使う
使用する外部ライブラリをロードすると何がロードされるのかを知っておく必要がある。
例えば、enoding.jsはロードするとEncordingがロードされると言うことを理解しておく。
外部ライブラリのインポート、ロードではENCODINGと定義しているが、使う時にはEncodingとすると言うこと。

### CSVのMIMEタイプは、text/csvだがtext/plainを使う
SalesforceのLockerサービスでは、Blobを作成する際に指定できるMIMEタイプに制限がある。
CSVファイルは通常text/csvを使うがサポートされていないため、text/plainを使う必要がある。
https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/security_js_mime.htm
