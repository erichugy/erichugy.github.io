/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */

define([
    'N/url', 'N/currentRecord',
    // 'N/task',
    'N/log'
], (
    Nurl, NcurrentRecord,
    // Ntask,
    Nlog,
) => {
    return {
        loadSearchResults,
        pageInit
    };

    function loadSearchResults() {

        let suitelet = NcurrentRecord.get();
        let params = {
            customer: suitelet.getValue({ fieldId: "customer" }),
            billing_date: suitelet.getText({ fieldId: "billing_date" }),
            billing_cycle: suitelet.getValue({ fieldId: "billing_cycle" }),
            include_past_unbilled: suitelet.getValue({ fieldId: "include_past_unbilled" })
        }
        console.log(`Type ${typeof params.customer} | customer: ${params.customer}`);
        console.log(`Type ${typeof params.billing_date} | Date: ${params.billing_date}`);
        console.log(`Type ${typeof params.billing_cycle} | Cycle: ${params.billing_cycle}`);
        console.log(`Type ${typeof params.include_past_unbilled} | IncludePast: ${params.include_past_unbilled}`);


        window.open(Nurl.resolveScript({
            scriptId: "customscript_customer_invoicing_suitelet",
            deploymentId: "customdeploy_customer_invoicing_suitelet",
            params,
        }), '_self');
    }

    //
    // }
    function pageInit() {
        // Dunno
    }

});