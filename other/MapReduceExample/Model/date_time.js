/**
 * @module date_time
 * @NApiVersion 2.1
 * Module to handle datetime objects and formatting.
 */
define([
    'N/format', 'N/log',

    'cs',
], (
    Nformat, Nlog,
    cs,
) => {

    return {
        getDates,
        customGetDate,
        formatDate,
        monthStartEnd,
        today,
    }

    /**
     * Gets the current date.
     * @function today
     * @param {boolean} [format=true] - Whether to format the date as a NetSuite date (default: true).
     * @param {int} [dateOffset=0] - Date Offset from date string. Positive is in the future. (default: 0).
     * @returns {string|Date} - The current date as a formatted string or Date object.
     */
    function today(format = true, dateOffset = 0) {
        let date = new Date();
        date.setDate(date.getDate() + dateOffset);
        return formatDate(date, format);
    }

    function monthStartEnd({ date, format = true, monthOffset = 0 }) {
        date = date ? new Date(date) : new Date(),
            y = date.getFullYear(),
            m = date.getMonth() + monthOffset;
        let firstDay = new Date(y, m, 1);
        let lastDay = new Date(y, m + 1, 0);

        return {
            start: formatDate(firstDay, format),
            end: formatDate(lastDay, format),
        }
    }

    /**
     * Gets a date from a date string or datetime object.
     * @function customGetDate
     * @param {string|Date} date - The date to parse.
     * @param {boolean} [format=true] - Whether to format the date as a NetSuite date (default: true).
     * @param {int} [dateOffset=0] - Date Offset from date string. Positive is in the future. (default: 0).
     * @returns {string|Date} - The parsed date as a formatted string or Date object.
     */
    function customGetDate({ date, format = true, dateOffset = 0 }) {
        date = new Date(date);
        date.setDate(date.getDate() + dateOffset);
        return formatDate(date, format);
    }

    /**
     * Formats a date.
     * @function formatDate
     * @param {Date} date - The date to format.
     * @param {boolean} format - Whether to format the date as a NetSuite date.
     * @returns {string|Date} - The formatted date as a string or Date object.
     */
    function formatDate(date, format) {
        const month = date.getMonth() + 1; // Adding 1 because months are zero-based
        const day = date.getDate();
        const year = date.getFullYear();
        let datestr = `${month}/${day}/${year}`;
        return format ? Nformat.parse({ value: datestr, type: Nformat.Type.DATE }) : datestr;
    }

    function getDates({ billingDate, billingCycle, includePastUnbilled }) {
        let endDate = customGetDate({ date: billingDate, format: false });
        let startDate;

        switch (parseInt(billingCycle)) {
            case cs.BILLING_CYCLE.NONE:
                startDate = null;
                break;
            case cs.BILLING_CYCLE.WEEKLY:
                startDate = customGetDate({ date: billingDate, format: false, dateOffset: -7 });
                break;
            case cs.BILLING_CYCLE.MONTHLY:
                startDate = monthStartEnd({ date: billingDate, format: false }).start;
                endDate = monthStartEnd({ date: billingDate, format: false }).end;
                break;
            case cs.BILLING_CYCLE.SPECIAL:
                startDate = null;
                break;
            default:
                throw new Error(`Unaccounted for billing cycle in code ${billingCycle} (Type: ${typeof billingCycle}). Please configure in CustomerInvoicing/constants.js and CustomerInvoicing/date_time.js`);
        }

        let transactionDateFilter = includePastUnbilled ? ["AND", ["trandate", "before", endDate]] :
            [
                "AND", ["trandate", "within", startDate, customGetDate(({ date: endDate, format: false, dateOffset: -1 }))]
            ];
        let contractDateFilter = includePastUnbilled ? [] :
            [
                "AND",
                ["custrecord_contract_start_date", "before", endDate],
                "AND",
                ["custrecord_contract_end_date", "onorafter", startDate],
            ];

        let output = { startDate, endDate, transactionDateFilter, contractDateFilter };
        Nlog.debug("getDates Output", JSON.stringify(output));
        return output;
    }

});