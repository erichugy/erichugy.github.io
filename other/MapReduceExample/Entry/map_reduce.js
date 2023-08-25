/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 * @NAmdConfig ../config.json
 * @file Map Reduce Entry
 */

define([
    'N/log',
    'mr_ctrl', 'search_mdl',
    'cs',
], (
    Nlog,
    ctrl, search,
    cs,
) => {
    return {
        /**
         * Gets input data for processing.
         * @function getInputData
         * @returns {Object[]} Array of transaction data objects.
         * @throws {Error} If input data retrieval or validation fails.
         */
        getInputData: getInputData,

        /**
         * Maps transaction data to unique keys.
         * @function map
         * @param {Object} context - Map context object.
         * @throws {Error} If mapping encounters an error.
         */
        map: map,

        /**
         * Reduces and aggregates mapped data at the body level.
         * @function reduce
         * @param {Object} context - Reduce context object.
         * @throws {Error} If reducing encounters an error.
         */
        reduce: reduce,

        /**
         * Summarizes the final results and creates invoices.
         * @function summarize
         * @param {Object} context - Summarize context object.
         * @throws {Error} If summarizing encounters an error.
         */
        summarize: summarize,
    }

    function getInputData() {
        Nlog.debug("Input Stage");

        let inputs = ctrl.getScriptParameters();
        ctrl.validateInputs(inputs);

        let transactionSearchResults = ctrl.getTransactions(inputs);

        return transactionSearchResults;
    }

    function map(context) { // line lvl
        Nlog.debug("Map", JSON.stringify(context));

        let lineData = JSON.parse(context.value);

        context.write({
            key: lineData.id, // rn it's per transaction id
            value: lineData
        });
    }

    /*
        values = list of transaction lines
    */
    function reduce(context) { // body lvl
        try {
            Nlog.debug("Reduce", JSON.stringify(context));

            // Get Contracts
            let inputs = ctrl.getScriptParameters();
            Nlog.debug("Inputs in Reduce", JSON.stringify(inputs));

            let contracts = ctrl.getContractInformation(inputs);
            // Nlog.debug("All contracts", JSON.stringify(contracts));

            // Create a list of charges that the script needs to address
            let charges = ctrl.getChargesList(contracts);
            Nlog.debug("Empty list of Contracts", JSON.stringify(charges));

            // Add Charge Qty's of line charges
            ctrl.addLineChargeQty(context.values, charges);

            // Create record
            let bodyFields = JSON.parse(context.values[0]);
            let entity = bodyFields.entity;


            let record = {
                id: bodyFields.id,
                date: bodyFields.date,
                type: bodyFields.type,
                entity: entity,
                documentNumber: bodyFields.documentNumber,
                charges: charges,
                inputs: inputs,
            };

            Nlog.debug("Reduce Record Data", JSON.stringify(record));

            context.write({
                key: record.entity,
                value: record,
            });
        } catch (error) {
            Nlog.error("Reduce Error", error.message);
            throw new Error("Error in Reduce: " + error.message);
        }
    }

    function summarize(context) {

        try {
            Nlog.error("Summarize", JSON.stringify(context));

            let allCharges = ctrl.getAllCharges(context);

            let invoiceId = ctrl.createInvoice(context, allCharges.charges);

            if (!invoiceId)
                Nlog.error("No transactions found to invoice. Skipping invoicing.");

            ctrl.invoiceTransactions(invoiceId, allCharges.transactions);

            Nlog.audit("Created Invoice", invoiceId);

        } catch (error) {
            Nlog.error("Error in Summarize", error.message);
            throw error;
        }

        // Summary
        var type = context.toString();
        Nlog.audit(type + ' Usage Consumed', context.usage);
        Nlog.audit(type + ' Concurrency Number ', context.concurrency);
        Nlog.audit(type + ' Number of Yields', context.yields);

        if (context.inputSummary.error)
            Nlog.error('input stage error: ', context.inputSummary.error);


        context.mapSummary.errors.iterator().each(function (key, value) {
            Nlog.error('map stage error: ' + key, value);
            return true;
        });

        context.reduceSummary.errors.iterator().each(function (key, value) {
            Nlog.error('reduce stage error: ' + key, value);
            return true;
        });

    }
});