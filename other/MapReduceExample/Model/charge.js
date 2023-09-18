/**
 * @NApiVersion 2.1
 * @file Module to calculate charge quantities based on specific conditions.
 */
define([
    'N/search', 'N/log',
    'search_mdl', "datetime_mdl",
    'cs',
], (
    Nsearch, Nlog,
    search, dt,
    cs,
) => {
    /**
     * Calculates charge quantity based on charge ID and data.
     * @function getChargeQty
     * @param {Object} params - Parameters for calculation.
     * @param {Object} params.data - Record Data object for calculation.
     * @param {number} params.serviceItem - ServiceItem for a charge
     * @returns {number|null} - Calculated charge quantity, or null if manual.
     */
    return {
        getChargeQty({ data, serviceItem }) { // returns null if manual
            // Nlog.debug("Switch inputs", `${JSON.stringify({data, chargeId})}`);
            switch (Number(serviceItem)) {
                case cs.CHARGE_NAMES["Handling"].serviceItem:
                    return handling({ data });
                case cs.CHARGE_NAMES["Initial Storage"].serviceItem:
                    return initialStorage({ data });
                case cs.CHARGE_NAMES["Recurring Storage"].serviceItem:
                    return recurringStorage({ data });
                case cs.CHARGE_NAMES['Case Pick'].serviceItem:
                    return casePick({ data });
                case cs.CHARGE_NAMES['Stretch Wrap'].serviceItem:
                    return stretchWrap({ data });
                case cs.CHARGE_NAMES["Slip Sheeting/Clamping"].serviceItem:
                    return slipSheeting_Clamping({ data });
                case cs.CHARGE_NAMES["Pallet management Charge"].serviceItem:
                    return palletManagement({ data });
                case cs.CHARGE_NAMES["Re-piling/ Ti-Hi"].serviceItem:
                    return re_Piling_Ti_Hi({ data });
                case cs.CHARGE_NAMES["BOL/Release Charge"].serviceItem:
                    return bol_ReleaseCharge({ data });
                case cs.CHARGE_NAMES["Inbound Receipt Charge"].serviceItem:
                    return inboundReceiptCharge({ data });
                case cs.CHARGE_NAMES["Case Labelling/Stamping"].serviceItem:
                    return caseLabelling_Stamping({ data });
                case cs.CHARGE_NAMES["Additional Pallet Labels"].serviceItem:
                    return additionalPalletLabels({ data });
                case cs.CHARGE_NAMES["ASN/SSID Labels"].serviceItem:
                    return asn_ssidLabels({ data });
                case cs.CHARGE_NAMES["Pallet Placarding"].serviceItem:
                    return palletPlacarding({ data });
                case cs.CHARGE_NAMES["Load Photo Verification"].serviceItem:
                    return loadPhotoVerification({ data });
                default:
                    Nlog.audit("Charge Names", JSON.stringify(cs.CHARGE_NAMES));
                    throw new Error("Unknown Charge Service Item " + serviceItem);
            }
        },
    };

    function handling({ data }) {
        return data.type === cs.PO ? data.pallets : 0;
    };

    function initialStorage({ data }) {
        return data.type === cs.PO ? data.pallets : 0;
    };

    function recurringStorage({ data }) {

        let
            filters = [
                ["custrecord_contract_customer", "anyof", data.entity],
                "AND",
                ["custrecord_contract_billing_cycle", "anyof", data.inputs.billingCycle],
                "AND",
                ["isinactive", "is", "F"],
                ...dt.getDates(data.inputs).contractDateFilter
            ],
            columns = [
                Nsearch.createColumn({
                    name: "internalid",
                    join: "CUSTRECORD_RECURRING_CONTRACT",
                    label: "id"
                }),
                Nsearch.createColumn({
                    name: "custrecord_recurring_amount_pallets",
                    join: "CUSTRECORD_RECURRING_CONTRACT",
                    label: "qty"
                }),
                Nsearch.createColumn({
                    name: "custrecord_recurring_storage_type",
                    join: "CUSTRECORD_RECURRING_CONTRACT",
                    label: "type"
                }),
                Nsearch.createColumn({
                    name: "custrecord_recurring_billing_date",
                    join: "CUSTRECORD_RECURRING_CONTRACT",
                    label: "billingDate"
                })
            ];

        let contractSearchResults = search.custom({
            type: "customrecord_invoice_contract",
            filters: filters,
            columns: columns,
        });

        // Here need to filter out unwanted results or do it in the search
        let qty = contractSearchResults.reduce((contract) => {
            return contract.qty;
        });

        return qty;
    };

    function casePick({ data }) {
        ;
        return data.cases ? data.cases : 0;
    };

    function stretchWrap({ data }) {
        if (data.type !== cs.SO) return;
        return data.pallets ? data.pallets : 0;
    };

    function slipSheeting_Clamping({ data }) {
        return null;
    }

    function palletManagement({ data }) {
        return null;
    }

    // function sparePallets({recordData}) { // pallets if required
    //     //rate = cost + 20%;
    //     return manuel(recordData, null);
    // }

    function re_Piling_Ti_Hi({ data }) {
        return null;
    }

    function bol_ReleaseCharge({ data }) { // per Outbound WMS order
        return data.type === cs.SO ? 1 : 0; // 0 per line, will calculate actual quantity later
    }

    function inboundReceiptCharge({ data }) { // per inbound WMS POs
        return data.type === cs.PO ? 1 : 0;
    }

    function caseLabelling_Stamping({ data }) {
        return null;
    }

    function additionalPalletLabels({ data }) {
        return null;
    }

    function asn_ssidLabels({ data }) {
        // Needs to be outbound
        if (data.type !== cs.SO) return;

        return (
            cs.REGEX.CLIENT.HERSHEY.includes(data.ENTITY)
            &&
            matchShipTo(data.shipTo)
        ) ? data.pallets : null;
    }

    function palletPlacarding({ data }) {
        return null;
    }

    function loadPhotoVerification({ data }) {
        if (isEntity(cs.ENTITY.BARTEK, data.entity)) {
            return null; // to do
        }
        // iff bartek => 1 per outbound wms
        return null;
    }

    // function transfer_InternalRelocation_Movement({recordData}) {
    //     return 1;
    // }

    // function restockingCancelledPickedOrders({recordData}) {
    //     return 1;
    // }

    // function temperatureReduction_Freezer({recordData}) {
    //     return 1;
    // }

    // function insertSlipSheetBetween({recordData}) {
    //     return 1;
    // }

    // function purchserSpliSheets({recordData}) {
    //     return 1;
    // }

    // function dateCodeLabelling({recordData}) {
    //     return 1;
    // }

    // function rushOrderOrOrderRevision({recordData}) {
    //     return 1;
    // }

    // function brimichInsertTemperatureRecorder({recordData}) {
    //     return 1;
    // }

    // function labour({recordData}) {
    //     return 1;
    // }

    // function chargebackSuppliesAndServices({recordData}) {
    //     return 1;
    // }

    // function cancelled_Re_ScheduledAppointment({recordData}) {
    //     return 1;
    // }

    // function shuntingDropTrailers({recordData}) {
    //     return 1;
    // }

    // function containerDe_Stuffing({recordData}) {
    //     return 1;
    // }

    // function segregationFee({recordData}) {
    //     return 1;
    // }

    // function customizedReports({recordData}) {
    //     return 1;
    // }



    // Helper Functions

    function isEntity(entity, otherEntity) {// Helper function to check if an entity matches.
        if (!otherEntity || typeof otherEntity !== Number) return false;
        return isIterable(entity) ? entity.includes(otherEntity) : entity === otherEntity;
    }
    function isIterable(obj) { // Helper function to check if an object is iterable.
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }
    function matchShipTo(str) {
        let shipTo = Object
            .values(cs.REGEX.SHIP_TO)
            .join('|');

        let regex = new RegExp(shipTo, 'i');
        return regex.test(str);
    }
});