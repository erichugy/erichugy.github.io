/**
 * @NApiVersion 2.1
 * @file Module to query the NS database
 */
define([
    'N/error', 'N/search', 'N/log', 'N/record',
    "datetime_mdl",
    'cs',
], (
    Nerror, Nsearch, Nlog, Nrecord,
    dt,
    cs
) => {

    return {
        custom(criteria) { return getSearchResults(criteria) },

        getTransactions,
        getContractInformation,
        getVendorFromCustomer,
        getCustomerFromVendor,
    };

    /**
     * Creates an ad hoc search with the given criteria, and returns the results
     * as an array of objects
     * @private
     */
    function getSearchResults(criteria) {
        Nlog.debug('search criteria', criteria);

        let search = Nsearch.create(criteria).runPaged({ pageSize: 1000 });
        let results = search.pageRanges.reduce((results, pageRange) => {
            let page = search.fetch({ index: pageRange.index });
            let pageResults = page.data.map(data => {
                return (data.columns || []).reduce((result, column) => {
                    result[column.label || column.name] = data.getValue(column) || null;
                    return result;
                }, { id: data.id, type: data.recordType });
            });
            return [...results, ...pageResults];
        }, []);
        Nlog.debug('search results', results);

        if (!results.length && criteria.resultsNeeded) {
            throw Nerror.create({ name: 'NO_RESULTS_FOUND', message: criteria });
        }

        return results.length ? results : null;
    }

    function getVendorFromCustomer({ customer }) {
        let vendor = Nsearch.lookupFields({
            type: Nsearch.Type.ENTITY,
            id: customer,
            columns: [
                "custentity_related_vendor",
            ],
        }).custentity_related_vendor[0].value || null;
        Nlog.debug(`Associated Vendor for customer ${customer}`, vendor);
        return vendor;
    }

    function getCustomerFromVendor({ vendor }) {
        let customer = Nsearch.lookupFields({
            type: Nsearch.Type.ENTITY,
            id: vendor,
            columns: [
                "custentity_related_customer",
            ],
        }).custentity_related_customer[0].value || null;

        if (!customer) throw new Error(`Vendor ${vendor} is missing its `)
        Nlog.debug(`Associated customer for vendor ${vendor}`, customer);
        return customer;
    }

    function getEntityFilter({ customer }) {
        /*
        // If you can get this code working, then you could be able to merge the saved searches for PO's and SO's:
        // Create list of entities
        let entities = [customer];

        // Get Vendor and add it.
        let vendor = getVendorFromCustomer({ customer });
        if (vendor) entities.push(vendor);

        // Create Filter for saved search.
        let filter = ["formulatext: CASE"];
        entities.forEach(entity => {
            filter[0] += (` WHEN {entity.id} = ${entity} THEN 'T'`);
        });
        filter[0] += " ELSE 'F' END";
        filter.push(...["contains", "T"]);

        //Also returning the vendor just in case. But realistically, should refactor this function and get vendor elsewhere
        return {
            filter: [filter]
        };
        */
        let customerFilter = [[cs.CUSTOMER + ".internalid", "anyof", customer]],
            vendorFilter = getVendorFromCustomer({ customer }) ?
                [
                    [
                        cs.VENDOR + ".internalid",
                        "anyof",
                        getVendorFromCustomer({ customer })
                    ]
                ] :
                [];
        return {
            customer: customerFilter,
            vendor: vendorFilter,
        }
    }

    function getTransactions({ customer, billingCycle, billingDate, includePastUnbilled, excludeTransactions = false }) {
        let transactionSearch = ({ transactionType, entityFilter, dateFilter, excludeTransactionsFilter }) => {
            let filters = [
                ["type", "anyof", transactionType],
                "AND",
                ["mainline", "is", "F"], // might need to take this out
                "AND",
                ["custbody_invoiced", "is", "F"],
                "AND",
                ...entityFilter,
                ...dateFilter,
                ...excludeTransactionsFilter,
            ],
                columns = [
                    // Body Info
                    Nsearch.createColumn({ name: "internalid", label: 'id' }),
                    Nsearch.createColumn({ name: "trandate", label: "date" }),
                    Nsearch.createColumn({ name: "type", label: "type" }),
                    Nsearch.createColumn({ name: "tranid", label: "documentNumber" }),

                    // Line Info
                    Nsearch.createColumn({ name: "internalid", join: "item", label: "item" }),
                    // Nsearch.createColumn({name: "amount", label: "amount"}),
                    Nsearch.createColumn({ name: "quantity", label: "qty" }),
                    Nsearch.createColumn({ name: "unitid", label: "unitId" }),
                    Nsearch.createColumn({ name: "custcol_lidd_casecount", label: "cases" }),
                    Nsearch.createColumn({ name: "custcol_lidd_pallets", label: "pallets" }),
                    Nsearch.createColumn({ name: "shipaddressee", label: "shipTo" }),

                    // Nsearch.createColumn({name: "custcol_lidd_casecount", label: "CaseCount"})
                    // Nsearch.createColumn({name: "custcol_chep_pallet", label: "chepPallets"}), // not yet implemented
                ];

            columns.push(
                transactionType === cs.SO ?
                    Nsearch.createColumn({ name: "internalid", join: cs.CUSTOMER, label: "entity" }) :
                    Nsearch.createColumn({ name: "custentity_related_customer", join: cs.VENDOR, label: "entity" })
            );

            return getSearchResults({
                type: 'transaction',
                filters: filters,
                columns: columns
            });
        }

        let inputs = { customer, billingCycle, billingDate, includePastUnbilled, excludeTransactions };

        let
            entityFilter = getEntityFilter({ customer }),
            dateFilter = dt.getDates(inputs).transactionDateFilter,
            excludeTransactionsFilter = excludeTransactions && excludeTransactions.length ? ["AND", excludeTransactions] : [];

        let transactionSearchResults = [];
        // Get Sales Orders
        let salesOrders = transactionSearch({
            transactionType: cs.SO,
            entityFilter: entityFilter.customer,
            dateFilter,
            excludeTransactionsFilter
        }),
            // Append Purchase Orders
            purchaseOrders = transactionSearch({
                transactionType: cs.PO,
                entityFilter: entityFilter.vendor,
                dateFilter,
                excludeTransactionsFilter
            });

        transactionSearchResults.push(...(salesOrders && Array.isArray(salesOrders) ? salesOrders : []));
        transactionSearchResults.push(...(purchaseOrders && Array.isArray(purchaseOrders) ? purchaseOrders : []));

        return transactionSearchResults;
    }

    function getContractInformation({ customer, billingCycle, billingDate, includePastUnbilled }) {
        //Some logic about dates:
        /*
        To find contracts that affect sales orders that happen between the start and end dates,
        you'd need to find all contracts that are active over said time interval.
        That would mean that the end date of the contract would have to be after the start date of desired time interval,
        and that the start date of the contract would have to be before the end date of the interval.

        If the endDateContract < startDateInterval, then the contract would have ended before the interval,
        similarly, if startDateContract > endDateInterval, then the contract would have started before the interval.
        */
        let inputs = { customer, billingCycle, billingDate, includePastUnbilled };

        // run saved search for contracts with customer id and return details
        let contractSearchResults = getSearchResults({
            type: "customrecord_invoice_contract",
            filters: [
                ["custrecord_contract_customer", "anyof", customer],
                "AND",
                ["custrecord_contract_billing_cycle", "anyof", billingCycle],
                "AND",
                ["isinactive", "is", "F"],
                ...dt.getDates(inputs).contractDateFilter
            ],
            columns: [
                Nsearch.createColumn({ name: "internalid", label: 'id' }),
                Nsearch.createColumn({ name: "custrecord_contract_customer", label: "customer" }),
                Nsearch.createColumn({ name: "custrecord_contract_billing_cycle", label: "billingCycle" }),
                Nsearch.createColumn({ name: "custrecord_contract_end_date", label: "endDate" }),
                Nsearch.createColumn({ name: "custrecord_contract_start_date", label: 'startDate' }),
                Nsearch.createColumn({ name: "internalid", join: "CUSTRECORD_CHARGE_CONTRACT", label: "chargeId" }),
                Nsearch.createColumn({ name: "name", join: "CUSTRECORD_CHARGE_CONTRACT", label: "chargeName" }),
                Nsearch.createColumn({ name: "custrecord_charge_rate", join: "CUSTRECORD_CHARGE_CONTRACT", label: "chargeRate" }),
                Nsearch.createColumn({ name: "custrecord_charge_unit", join: "CUSTRECORD_CHARGE_CONTRACT", label: "chargeUnit" }),
                Nsearch.createColumn({ name: "custrecord_charge_service_item", join: "CUSTRECORD_CHARGE_CONTRACT", label: "chargeServiceItem" })
            ]
        });

        return contractSearchResults;
    }
});
