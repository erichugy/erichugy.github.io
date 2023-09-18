/**
 * @NApiVersion 2.1
 * @file Module to summarize javascript objects and maps.
 */
define([
    'N/error', 'N/search', 'N/log', 'N/url',
    "datetime_mdl", 'charge_mdl',
    'cs',
], (
    Nerror, Nsearch, Nlog, Nurl,
    dt, charge_mdl,
    cs
) => {
    return {
        formatParameters,
        parseCommaSeparatedIntegers,
        summarizeTransactions,
        addChargeQtyToMap,
        mergeLineCharges,
        flattenCharges
    }

    function formatParameters(inputs) {
        if (typeof inputs.includePastUnbilled === 'string')
            inputs.includePastUnbilled = inputs.includePastUnbilled.toLowerCase() === "true";
        inputs.excludeTransactions = parseCommaSeparatedIntegers(inputs.excludeTransactions);

        return inputs
    }

    function parseCommaSeparatedIntegers(inputText) {
        if (!inputText) return [];
        const integerStrings = inputText.split(',').map(str => str.trim());
        const integers = integerStrings.map(str => parseInt(str, 10)).filter(num => !isNaN(num));
        return integers;
    }

    /**
     * Summarizes an array of transactions, consolidating transactions with the same ID by
     * adding their numeric properties.
     * Also adds 'transaction_url' property for each transaction
     *
     * @param {Array<Object>} transactions - An array of transaction objects.
     * @param {Set<string>} propertiesToConsolidate - A set of property names to consolidate.
     * @returns {Array<Object>} - An array of summarized transaction objects.
     */
    function summarizeTransactions(transactions, propertiesToConsolidate) {
        /**
         * Consolidates numeric properties of two objects.
         *
         * @param {Object} self - The target object to consolidate properties into.
         * @param {Object} other - The source object whose properties will be added.
         * @param {Set<string>} propertiesToConsolidate - A set of property names to consolidate.
         */
        let consolidateProperties = (self, other, propertiesToConsolidate) => {
            for (const key of Object.keys(self)) {
                if (propertiesToConsolidate.has(key))
                    self[key] = (parseFloat(self[key]) || 0) + (parseFloat(other[key]) || 0);
            }
        }

        // Map to store summarized transactions
        let summarizedMap = {};

        // Iterate through transactions
        transactions.forEach((transaction) => {
            if (transaction.id in summarizedMap) {
                // If transaction ID already seen, consolidate properties
                consolidateProperties(summarizedMap[transaction.id], transaction, propertiesToConsolidate);
            } else {
                // First time seeing this transaction, add it to the map
                summarizedMap[transaction.id] = transaction;

                // Add url to transaction
                try {
                    summarizedMap[transaction.id]['transaction_url'] = Nurl.resolveRecord({
                        recordType: cs.ALT_TYPE[transaction.type],
                        recordId: transaction.id,
                        isEditMode: false
                    });
                } catch (error) {
                    Nlog.error(`Error creating url for ${transaction.type} ${transaction.id}.`);
                    summarizedMap[transaction.id]['transaction_url'] = "Failed link";
                }
            }
        });

        // Return array of summarized transactions
        return Object.values(summarizedMap);
    }

    /**
     * Adds charge quantities to charges map.
     * @function addChargeQtyToMap
     * @param {Object} record - Transaction record.
     * @param {Object} charges - Charges map to update.
     */
    function addChargeQtyToMap(record, charges) {
        // Nlog.debug("Adding to Charge Map", JSON.stringify(charges));

        for (const chargeKey in charges) {
            let chargeQty = charge_mdl.getChargeQty({ data: record, serviceItem: charges[chargeKey].serviceItem });
            if (chargeQty)
                charges[chargeKey].qty = parseFloat(charges[chargeKey].qty) ? parseFloat(charges[chargeKey].qty) + parseFloat(chargeQty) : chargeQty;
        }
        // Nlog.debug("Charge Map Now", JSON.stringify(charges));
    }

    /**
     * Merges line charges from one object into another.
     * @function mergeLineCharges
     * @param {Object} masterObj - The main charges object to merge into.
     * @param {Object} otherObj - The charges object to merge from.
     */
    function mergeLineCharges(masterObj, otherObj) {
        // Nlog.debug("Map before merge", JSON.stringify(masterObj));
        for (const key in otherObj) {
            if (masterObj.hasOwnProperty(key)) {
                // Both objects have the same key, so sum the quantities.
                const qtyA = parseFloat(masterObj[key].qty) || 0;
                const qtyB = parseFloat(otherObj[key].qty) || 0;
                masterObj[key].qty = qtyA + qtyB;
            } else {
                // Key is present in object B but not in object A, so add it to object A.
                masterObj[key] = { ...otherObj[key] };
            }
        }
        // Nlog.debug("Map post merge", JSON.stringify(masterObj));
    }

    /**
     * Flattens and filters charges object.
     * @function flattenCharges
     * @param {Object} inputObj - Input charges object.
     * @returns {Object} - Flattened and filtered charges.
     */
    function flattenCharges(inputObj) {
        const flattened = {};

        for (const level in inputObj) {
            const subObj = inputObj[level];
            for (const id in subObj) {
                if (level === cs.FLAGS.MANUAL || subObj[id].qty)
                    flattened[id] = subObj[id];
            }
        }
        Nlog.debug("Flattened", JSON.stringify(flattened));
        return flattened;
    }

});