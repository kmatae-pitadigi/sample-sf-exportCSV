public with sharing class AccountList {
    public AccountList() {

    }

    /**
    * 取引先情報を取得する
    */
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        return [select Id,Name,BillingState from Account limit 1000];
    }
}
