/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 * @NAmdConfig ../config.json
 * @file Suitelet
 */


define([
    'N/log', 'N/ui/serverWidget', 'N/task',
    'mr_ctrl',
    'render',
    'cs',
], (
    Nlog, serverWidget, Ntask,
    ctrl,
    render,
    cs
) => {
    return {
        onRequest
    }

    function onRequest({ request, response }) {
        let params = request.parameters;
        Nlog.debug("Default Params", JSON.stringify(params));

        params = formatSuiteletParams(params);
        Nlog.debug("Post Formatted Params", JSON.stringify(params));

        let page;
        if (request.method === 'GET') {
            if ('customer' in params)
                page = render.createSearchResultsPage(params);
            else
                page = render.createLandingPage();

            response.writePage(page);
        } else if (request.method === 'POST') {
            //call map reduce
            Nlog.audit("Params", JSON.stringify(params));

            createInvoice(params);

            //make page == final
            let html = '<html><head><title>Creating Invoice</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:0}header{background-color:#63779a;color:white;text-align:center;padding:20px}h1{margin-bottom:10px}h2{margin-top:0;color:#555}a{color:#64749c;text-decoration:underline;transition:color 0.3s}a:hover{color:#649bdd}</style></head><body><header><h1>Creating Invoice</h1></header><div style="text-align:center;padding:20px"><h2>Please see <a href="https://6928028-sb1.app.netsuite.com/app/common/scripting/mapreducescriptstatus.nl?whence=">Map Reduce Job Status</a></h2></div></body></html>';
            // "Please Click Link for MR Status: https://6928028-sb1.app.netsuite.com/app/common/scripting/mapreducescriptstatus.nl?whence=")
            response.write(html);
        }
    }

    /**
     * Used to convert a stringified Object or Array parameter sent to a Suitelet into an Object or Array
     *
     * @param {{}} params : Stringified parameters sent to the Suitelet
     * @returns {{}} formattedParams : Fomatted parameters in the form of object or array
     */
    function formatSuiteletParams(params) {
        delete params.script;
        delete params.deploy;
        delete params.compid;
        delete params.whence;

        if (Object.keys(params).length <= 0) {
            return params;
        }

        let formattedParams = {};

        let regexObj = /^{.*}$/;
        let regexList = /^\[.*]$/;
        for (fieldId in params) {
            if (regexObj.test(params[fieldId]) || regexList.test(params[fieldId])) {
                formattedParams[fieldId] = JSON.parse(params[fieldId]);
            } else {
                formattedParams[fieldId] = params[fieldId];
            }
        }

        return formattedParams;
    }

    function createInvoice(params) {

        let msg = "";
        try {
            let inputs = {
                customer: parseInt(params.customer),
                billingCycle: parseInt(params.billing_cycle),
                billingDate: params.billing_date,
                includePastUnbilled: params.include_past_unbilled.toLowerCase() === 'true'
            };

            callMapReduce(inputs);

            msg = "Done";
        } catch (e) {
            msg += " Error: " + e.message;
        } finally {
            return (msg);
        }
    }

    function callMapReduce(inputs) {
        let mrTask = Ntask.create({
            taskType: Ntask.TaskType.MAP_REDUCE,
            scriptId: 'customscript_customer_invoice_mr',
            deploymentId: 'customdeploy_customer_invoice_mr',
        });

        mrTask.params = {
            'custscript_customer': inputs.customer,
            'custscript_billing_date': inputs.billingDate,
            'custscript_billing_cycle': inputs.billingCycle,
            'custscript_past_unbilled': inputs.includePastUnbilled,
        }

        let taskId = mrTask.submit();
        Nlog.audit("Executed task ID " + taskId);
    }

});