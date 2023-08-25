/**
 * @NApiVersion 2.1
 * @NAmdConfig ../config.json
 * @file Map Reduce Controller
 */
define([
    'N/search', 'N/record', 'N/runtime', 'N/log',
    'search_mdl', "datetime_mdl", 'charge_mdl', 'summarize_mdl',
    'cs',
], (
    Nsearch, Nrecord, Nruntime, Nlog,
    search, dt, charge_mdl, summarize_mdl,
    cs,
) => {
    return {
        getScriptParameters,
        validateInputs,
        getTransactions,
        getContractInformation,
        getChargesList,
        addLineChargeQty,
        getAllCharges,
        createInvoice,
        invoiceTransactions,
    }

    /**
     * Retrieves script parameters.
     * @function getScriptParameters
     * @returns {Object} - Script parameters.
     */
    function getScriptParameters() {
        let script = Nruntime.getCurrentScript();
        let inputs = {
            customer: script.getParameter({ name: 'custscript_customer' }),
            billingCycle: script.getParameter({ name: 'custscript_billing_cycle' }),
            billingDate: script.getParameter({ name: 'custscript_billing_date' }),
            includePastUnbilled: script.getParameter({ name: 'custscript_past_unbilled' }),
            excludeTransactions: script.getParameter({ name: 'custscript_exclude_transactions' }),
        };

        // Format Inputs
        return summarize_mdl.formatParameters(inputs);
    };

    /**
     * Validates input parameters.
     * @function validateInputs
     * @param {Object} params - Input parameters.
     * @returns {boolean} - True if inputs are valid.
     * @throws {Error} - If any required input is missing.
     */
    function validateInputs({ customer, billingCycle, billingDate, includePastUnbilled }) {

        if (!customer)
            throw new Error("Missing 'customer' input.");

        if (!billingCycle)
            throw new Error("Missing 'billingCycle' input.");

        if (!includePastUnbilled && (billingDate === null || billingDate === ''))
            throw new Error("Missing 'Billing Date' input.");

        // All inputs are valid

        // Debug Purposes:
        let inputs = { customer, billingCycle, billingDate, includePastUnbilled };
        Object
            .entries(inputs)
            .forEach(([key, val]) => { inputs[key] = { value: val, type: typeof val } });
        Nlog.debug("Validated Inputs", JSON.stringify(inputs));

        // Nlog.debug("Validated Inputs", JSON.stringify({ customer, billingCycle, billingDate, includePastUnbilled }));
    };

    /**
     * Retrieves transactions based on input criteria.
     * @function getTransactions
     * @param {Object} params - Transaction retrieval parameters.
     * @returns {Array} - Array of transaction search results.
     */
    function getTransactions(inputs) {
        Nlog.debug("Inputs in getTransactions", JSON.stringify(inputs));
        try {
            return search.getTransactions(inputs);
        } catch (error) {
            let msg = "Error in getTransactions. Error: " + error.message;
            Nlog.error(msg);
            throw new Error(msg);
        }
    };

    /**
     * Retrieves contract information based on input criteria.
     * @function getContractInformation
     * @param {Object} params - Contract retrieval parameters.
     * @returns {Object} - Contract information.
     */
    function getContractInformation(inputs) {
        // Nlog.debug("Started mr ctrl getContractInformation", JSON.stringify(inputs));
        let contractSearchResults = search.getContractInformation(inputs);
        // Nlog.debug("Past mr ctrl getContractInformation", JSON.stringify(contractSearchResults));

        // Turn search results into js obj
        let contracts = {};
        contractSearchResults.forEach((contract) => {
            // Add Meta Data
            if (!contracts.hasOwnProperty(contract.id)) {
                contracts[contract.id] = {
                    customer: contract.customer,
                    billingCycle: contract.billingCycle,
                    startDate: contract.startDate,
                    endDate: contract.endDate,
                    charges: {},
                }
            }
            // Add Charges
            contracts[contract.id].charges[contract.chargeId] = {
                name: contract.chargeName,
                rate: contract.chargeRate,
                unit: contract.chargeUnit,
                serviceItem: contract.chargeServiceItem,
                qty: null,
            }
        });
        if (!contracts || contracts.length <= 0)
            throw new Error("Could not find any contracts for this customer.");
        return contracts;
    };

    /**
     * Retrieves a list of charges from contracts.
     * @function getChargesList
     * @param {Object} contracts - Object of contracts.
     * @returns {Object} - Charges list = {chargeType: {chargeKey : charge}} ; where chargeKey = `${contractId}|${charge.serviceItem}`
     */
    function getChargesList(contracts) { // returns {type: {`${contractId}|${charge.serviceItem}`: charge}}
        Nlog.debug("Charge Map to Name and Type", JSON.stringify(cs.CHARGES));
        let charges = {};
        for (const key in cs.FLAGS) charges[cs.FLAGS[key]] = {};

        Object
            .entries(contracts)
            .forEach(([contractId, contract]) => { // for every contract

                // copy all the charges from said contract to the charges object.
                for (const chargeId in contract.charges) {
                    if (isNaN(chargeId) || !chargeId) continue;

                    let charge = contract.charges[chargeId];

                    if (!cs.CHARGES.hasOwnProperty(charge.serviceItem))
                        throw new Error(`Charge ${chargeId} not added to script files or charge service item ${charge.serviceItem} is missing for charge ${charge.chargeName}. Please configure it in SuiteScripts/CustomerInvoicing/constants.js`);

                    let type = cs.CHARGES[charge.serviceItem].type;

                    /* Create a unique key for each charge in each contract to
                    combine the same charges from the same contracts
                    and differentiate the same charge from different contracts */
                    let chargeKey = `${contractId}|${charge.serviceItem}`;
                    if (!charges[type].hasOwnProperty(chargeKey))
                        charges[type][chargeKey] = charge;

                    /* what happens if there's two competing charges?????
                    Ie: if there are two charges with the same service item,
                    but with different rates?*/
                };
            });

        return charges;
    };

    /**
     * Takes all the transaction lines of all transactions and, one-by-one,
     * adds the number of times each line charge appears. This frequency is added to the chargeMap.
     * @function addLineChargeQty
     * @param {Array} lines - Array of transaction lines.
     * @param {Object} charges - Charges list.
     */
    function addLineChargeQty(lines, charges) {
        // Nlog.debug('Line Lvl Charges', JSON.stringify(charges[cs.FLAGS.LINE_LEVEL]));

        lines.forEach((value) => {
            try {
                let line = JSON.parse(value);
                // if (line.pallets) Nlog.debug("Add Line Charge Qty", JSON.stringify(line));
                // Calculate the qty of each line-charge per line of the transaction and add it to charges['linelevel']
                summarize_mdl.addChargeQtyToMap(line, charges[cs.FLAGS.LINE_LEVEL]);
            } catch (e) {
                throw new Error(`Failed to add Line charge QTY on line ${JSON.stringify(JSON.parse(value))}. | Error: ${e.message}`);
            }
        });

        // Nlog.debug("Post Line Charges", JSON.stringify(charges[cs.FLAGS.LINE_LEVEL]));
    }

    /**
     * Retrieves all charges from context and merges them.
     * Also builds a list of transactions and their types to invoice them later.
     * @function getAllCharges
     * @param {Object} context - Script context.
     * @returns {Object} - Merged charges.
     */
    function getAllCharges(context) {

        let charges = null;
        let transactions = [];

        context.output.iterator().each((key, value) => { // recall each value represents a PO or SO
            let record = JSON.parse(value);
            // Nlog.audit("Summarize Record Data", JSON.stringify(record));

            // Aggregate Line Charges: Add the charges which apply to the record, to the total charges
            if (charges)
                summarize_mdl.mergeLineCharges(charges[cs.FLAGS.LINE_LEVEL], record.charges[cs.FLAGS.LINE_LEVEL])
            else
                charges = record.charges;

            // Calculate Body Charges and add it to the master charges
            summarize_mdl.addChargeQtyToMap(record, charges[cs.FLAGS.BODY_LEVEL]);

            // Nlog.audit("Summarize Charge Map Post Addition", JSON.stringify(record));

            // Transaction tracking part
            transactions.push({ id: record.id, type: record.type });

            return true;
        });

        Nlog.audit("Original all charges", JSON.stringify(charges));
        return {
            charges: summarize_mdl.flattenCharges(charges),
            transactions
        };
    }

    /**
     * Creates an invoice based on charges.
     * @function createInvoice
     * @param {Object} context - Script context.
     * @param {Object} charges - Charges list.
     * @returns {number} - ID of the created invoice.
     */
    function createInvoice(context, charges) {
        let record = getRecordFromContext(context);

        // Iff no record => skip invoicing.
        if (!record) return null;

        let nRec = Nrecord.create({
            type: cs.INVOICE.TYPE,
            isDynamic: true,
            defaultValues: {
                entity: record.entity,
                customform: cs.INVOICE.FORM,
            },
        });

        nRec.setValue({ fieldId: 'memo', value: cs.INVOICE.MEMO });
        nRec.setValue({ fieldId: 'location', value: cs.INVOICE.LOCATION });
        nRec.setValue({ fieldId: 'trandate', value: dt.customGetDate({ date: record.inputs.billingDate, }) });

        // Populate Sublist
        for (const chargeId in charges) {
            setChargeValue(nRec, charges[chargeId]);
        }

        return nRec.save();
    };

    /**
     * Retrieves a record from the script context.
     * @function getRecordFromContext
     * @param {Object} context - Script context.
     * @returns {Object} - Retrieved record.
     */
    function getRecordFromContext(context) {
        let record;
        context.output.iterator().each((key, value) => {
            record = JSON.parse(value);
            return false;
        });
        Nlog.debug("Record from context", JSON.stringify(record));
        return record;
    }

    /**
     * Sets charge values for an invoice line.
     * @function setChargeValue
     * @param {Object} nRec - Invoice record.
     * @param {Object} charge - Charge information.
     */
    function setChargeValue(nRec, charge) {
        nRec.selectNewLine({ sublistId: 'item' });

        let serviceItem = charge.serviceItem,
            rate = charge.rate,
            qty = charge.qty;

        if (!serviceItem) {
            Nlog.error("Skipping line", `Charge ${charge.name} is missing Service Item: ${serviceItem} | Quantity: ${qty} | Rate: ${rate}.`);
            nRec.cancelLine({ sublistId: 'item' });
            return;
        }
        qty = charge.qty ? charge.qty : 0;
        rate = charge.rate ? charge.rate : 0;

        nRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'item', value: serviceItem });
        nRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'rate', value: rate });
        nRec.setCurrentSublistValue({ sublistId: 'item', fieldId: 'quantity', value: qty });

        nRec.commitLine({ sublistId: 'item', });
    }

    function invoiceTransactions(invoiceId, transactions) {
        transactions.forEach((transaction) => {
            let nRec = Nrecord.load({
                id: transaction.id,
                type: cs.ALT_TYPE[transaction.type],
                isDynamic: true
            });

            // Set as invoiced
            nRec.setValue({ fieldId: "custbody_invoiced", value: true }); // Comment out when debugging

            // Set Related Invoice
            nRec.setValue({ fieldId: "custbody_customer_invoice", value: invoiceId });
            nRec.save();
        });
    }
});