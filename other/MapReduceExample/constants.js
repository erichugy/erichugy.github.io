/**
 * @NApiVersion 2.1
 * @file Constants
 */

define([], () => {

    // Helper Functions
    /**
    * Function to flip charge data for easy retrieval.
    * @function flippedCharges
    * @param {Object} data - The charge data object to be flipped.
    * @returns {Object} - The flipped charge data object.
    */
    let flippedCharges = (data) => Object.fromEntries(
        Object
            .entries(data)
            .map(([key, value]) => [value.serviceItem, { name: key, type: value.type }])
    );

    // Constants \\

    // Billing Cycle Constants
    const BILLING_CYCLE = {
        NONE: 0,
        WEEKLY: 1,
        MONTHLY: 2,
        SPECIAL: 3,
    };

    //Charge Types
    const
        MANUAL = 'manual',
        LINE_LEVEL = 'linelevel',
        BODY_LEVEL = 'bodylevel';

    // Charge Names and Types. Maps Charge Name to Service Item and the type of charge
    const CHARGE_NAMES = { // needs to be updated in prod
        "Handling": { serviceItem: 25, type: LINE_LEVEL },
        "Initial Storage": { serviceItem: 67, type: LINE_LEVEL },
        "Recurring Storage": { serviceItem: 70, type: BODY_LEVEL }, // CONTRACT_LEVEL
        "Case Pick": { serviceItem: 32, type: LINE_LEVEL },
        "Stretch Wrap": { serviceItem: 7444, type: LINE_LEVEL },
        "Slip Sheeting/Clamping": { serviceItem: 51, type: MANUAL },
        "Pallet management Charge": { serviceItem: 44, type: MANUAL },
        // "Pallets If Required"                   : {serviceItem: 14  , type: LINE_LEVEL}, not yet in SB. Want to call it spare pallets
        "Re-piling/ Ti-Hi": { serviceItem: 47, type: MANUAL },
        "BOL/Release Charge": { serviceItem: 30, type: BODY_LEVEL },
        "Inbound Receipt Charge": { serviceItem: 7656, type: BODY_LEVEL },
        "Case Labelling/Stamping": { serviceItem: 31, type: MANUAL },
        "Additional Pallet Labels": { serviceItem: 7443, type: MANUAL },
        "ASN/SSID Labels": { serviceItem: 28, type: LINE_LEVEL },
        "Pallet Placarding": { serviceItem: 7442, type: MANUAL },
        "Load Photo Verification": { serviceItem: 38, type: BODY_LEVEL },
        "Transfer, Internal Relocation/Movement": { serviceItem: 7657, type: MANUAL },
        "Restocking Cancelled Picked Orders": { serviceItem: 7658, type: MANUAL },
        "Temperature Reduction, Freezer": { serviceItem: 7445, type: MANUAL },
        "Insert Slip Sheet Between Pallets": { serviceItem: 7446, type: MANUAL },
        "Purchase Slip Sheets": { serviceItem: 7447, type: MANUAL },
        "Date Code Labelling": { serviceItem: 7659, type: MANUAL },
        "Rush Order or Order Revision Fee": { serviceItem: 49, type: MANUAL },
        "Brimich Insert Temperature Recorder": { serviceItem: 64, type: MANUAL },
        "Labour Charge": { serviceItem: 7448, type: MANUAL },
        "Chargeback Supplies and Services": { serviceItem: 7449, type: MANUAL },
        "Cancelled/Re-scheduled Appointment": { serviceItem: 7450, type: MANUAL },
        "Shunting Drop Trailers": { serviceItem: 7454, type: MANUAL },
        "Container De-Stuffing : 0-1,999": { serviceItem: 18, type: MANUAL },
        "Container De-Stuffing : 2000-2,999": { serviceItem: 7660, type: MANUAL },
        "Container De-Stuffing : 3000-3,999": { serviceItem: 7661, type: MANUAL },
        "Container De-Stuffing : 4000-4,999": { serviceItem: 7662, type: MANUAL },
        "Segregation Fee": { serviceItem: 23, type: MANUAL },
        "Customized Reports": { serviceItem: 7455, type: MANUAL },
    };

    const CUSTOMER = 'customer';
    const VENDOR = 'vendor';

    const ENTITY = { BARTEK: [1131, 1132, 1337, 1338] };

    // Invoice
    const INVOICE = {
        FORM: 216,
        MEMO: "Created by Customer Invoice Script - LIDD: Testing Phase",
        LOCATION: 5,
        SUBSIDIARY: 3,
        TYPE: 'invoice',
    }
    const INVOICE_STATUS = {
        NOT_INVOICED: 1,
        INVOICED: 2,
    }

    // Fields to summarize on Suitelet
    const PROPERTIES_TO_CONSOLIDATE = new Set([
        "qty",
        "cases",
        "pallets"
    ]);

    const REGEX = {
        SHIP_TO: {
            WALMART: ["(wal).?(mart)"],
            LOBLAW: ['loblaw'],
            SYSCO: ['sysco'],
            MATRIX: ['matrix'],
            SHOPPER: ["(shopper).+? (drug mart)"],
        },
        CLIENT: {
            HERSHEY: [1219, 1458] //Internal ID's
        },
        OR: "|",
    };

    // Types
    const SO = 'SalesOrd', PO = 'PurchOrd';
    const ALT_TYPE = {
        [SO]: 'salesorder',
        [PO]: 'purchaseorder',
    };

    const ENTITY_TYPE = (recordType) => {
        let type;
        if (recordType === SO || recordType === ALT_TYPE[SO]) {
            type = 'customer';
        } else if (recordType === PO || recordType === ALT_TYPE[PO]) {
            type = 'vendor';
        } else {
            throw new Error(`Error in Constants.js. Script is not made to handle ${recordType}. Unable to create sublist table links.`);
        }
        return type;
    };


    return {
        BILLING_CYCLE: BILLING_CYCLE,
        CHARGE_NAMES: CHARGE_NAMES,
        CHARGES: flippedCharges(CHARGE_NAMES),
        ENTITY: ENTITY,
        ENTITY_TYPE: ENTITY_TYPE,
        FLAGS: { BODY_LEVEL, LINE_LEVEL, MANUAL, },
        INVOICE: INVOICE,
        INVOICE_STATUS: INVOICE_STATUS,
        PROPERTIES_TO_CONSOLIDATE: PROPERTIES_TO_CONSOLIDATE,
        REGEX: REGEX,
        SO: SO,
        PO: PO,
        ALT_TYPE: ALT_TYPE,
        CUSTOMER: CUSTOMER,
        VENDOR: VENDOR,
    }
});