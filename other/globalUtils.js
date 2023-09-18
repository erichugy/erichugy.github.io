
/**
 * @NApiVersion 2.1
 * @File Controller for all useful functions
 */

define(["N/record", "N/log", "N/search"], function (
    Nrecord,
    Nlog,
    Nsearch
) {

    // for loops
    let itemSublistLength = nRec.getLineCount({ sublistId: "item", });

        for (let i = 0; i < itemSublistLength; i ++){
            let exitObject = validateLineTolerances(vendorBillRecord, lineNumber);
            if (exitObject.exitCode === REJECTED) return exitObject;
        }


    //Sublists
    function calculateAndSetLineWeightAndPallets (nRec, line) { // need to work in dynamic mode, so need to load nRec in dynamic mode | deleted a bucnh of the code btw
        nRec.selectLine({ sublistId: 'item', line});

        try{

            let quantity = nRec.getCurrentSublistValue({ sublistId: "item", fieldId: "quantity"});
            if ( isNaN(quantity) ) throw new Error(`Invalid quantity: ${quantity}`) ;

            // Get Item Information
            let itemId      = nRec.getCurrentSublistValue({ sublistId: "item", fieldId: "item" });
            let itemInfo    = _getItemInformation(itemId);

            let itemWeight          = !_isNum(itemInfo.custitem_can_net_itm_weight)  && _isNum(itemInfo.weight)     ? itemInfo.weight : itemInfo.custitem_can_net_itm_weight ;

            nRec.setCurrentSublistValue({
                sublistId:          'item',
                fieldId:            'custcol_total_gross_weight',
                value:              roundToTwoDecimalPoints(_parseNumber(itemWeight)),
                ignoreFieldChange:  true
            });

            // Commit Line
            nRec.commitLine({ sublistId: "item"});

            return {totalRowWeight, totalRowGrossWeight, palletQuantity};
        } catch (error) {
            nRec.cancelLine({ sublistId: 'item' });
            throw new Error("Unable to perform all calculations and set values on line " + line + " . Aborting line commit.| Error: " + error.message);
        }
        }

    //Date Time:
    function today() {
            let date = new Date();
            date.setDate(date.getDate());

            const month = date.getMonth() + 1; // Adding 1 because months are zero-based
            const day = date.getDate();
            const year = date.getFullYear();
            let datestr = `${month}/${day}/${year}`;
            return Nformat.parse({value: datestr, type: Nformat.Type.DATE});
        }

    function getDate(dateStr) {
            let date = new Date(dateStr);
            const month = date.getMonth() + 1; // Adding 1 because months are zero-based
            const day = date.getDate();
            const year = date.getFullYear();
            let datestr = `${month}/${day}/${year}`;
            return Nformat.parse({value: datestr, type: Nformat.Type.DATE});
        }

    function yesterday() {
            let date = new Date();
            date.setDate(date.getDate() - 1); //yesterday

            const month = date.getMonth() + 1; // Adding 1 because months are zero-based
            const day = date.getDate();
            const year = date.getFullYear();
            let datestr = `${month}/${day}/${year}`;
            return Nformat.parse({value: datestr, type: Nformat.Type.DATE});
        }


    //Nrecord
    let approvalStepZero = Nrecord.create({ type: "customrecord_approval_step", });

        approvalStepZero.setValue({ fieldId: 'custrecord_approval_step_vendor_bill', value: nRec.id });
        approvalStepZero.setValue({ fieldId: 'custrecord_approval_step_status', value: 2 });

        approvalStepZero.setValue({ fieldId: 'custrecord_approval_step_step_no', value: stepNo });
        if (nextApprover) approvalStepZero.setValue({ fieldId: 'custrecord_approval_step_next_approver', value: nextApprover });
        if (threshold) approvalStepZero.setValue({ fieldId: 'custrecord_approval_step_threshold', value: threshold });

        approvalStepZero.save();


    var objRecord = Nrecord.transform({
        fromType: record.Type.CUSTOMER,
        fromId: 107,
        toType: record.Type.SALES_ORDER,
        isDynamic: true,
        });


    //Search Module

    // Nsearch.lookupFields
    locationSearchResults = Nsearch.lookupFields({
        type: Nsearch.Type.LOCATION,
        id: locationRecordId,
        columns: [
            "custrecord_quantity_tolerance",
            "custrecord_rate_tolerance",
        ],
    });
    let qtyTolerance = locationSearchResults.custrecord_quantity_tolerance;


    //Iterating and getting values from saved searches
    function getSearchColAvg(id, col){
        let searchResults = {
            "value":0,
            'count':0,
        };
        let scriptName = cs.SEARCH_PREFIX + id.toString();
        Nlog.debug("scriptName", scriptName);

        let script = Nruntime.getCurrentScript();
        let searchId = script.getParameter({name: scriptName});

        if (!searchId) Nlog.error(`Unable to get saved search parameter`, `Missing search for ${scriptName}`);

        let mySearch = Nsearch.load({id: searchId});
        let resultsSet = mySearch.run();
        Nlog.debug('searchResults.columns', resultsSet.columns);


        mySearch.run().each((result) => {
            let lineVal = parseFloat(result.getValue({"name":"formulanumeric","label":"Approval Time"}));
            Nlog.debug('Script 16', `Val for line ${JSON.stringify(result)}`); // doesn't tell you much

            //look at results.object members and results set object members
            Nlog.debug('This shorter version works', result.getValue({"name":"formulanumeric","label":"Approval Time"}));
            Nlog.debug('This way also works', result.getValue(resultsSet.columns[resultsSet.columns.length-1]));
            searchResults.value += lineVal;
            searchResults.count ++;
            Nlog.debug(searchResults.count, searchResults.value );
            return true;
        });

        return Math.round(searchResults.value / searchResults.count);
        }


        // inventory detail ; lots
        function getLots(nRec){
            let inventoryDetail = nRec.getSubrecord({fieldId:"inventorydetail"});

            let lotToQtyStack = [];

            let sublistLength = inventoryDetail.getLineCount({sublistId:'inventoryassignment'});
            while (sublistLength--){
                let lot = inventoryDetail.getSublistValue({ sublistId:'inventoryassignment', fieldId:'issueinventorynumber'   , line}),
                // expDate = inventoryDetail.getSublistValue({ sublistId:'inventoryassignment', fieldId:'existingexpdate'        , line}),
                qty     = inventoryDetail.getSublistValue({ sublistId:'inventoryassignment', fieldId:'quantity'               , line});

                lotToQtyStack.push({
                    "lot"       : lot,
                    // "expDate"   : expDate,
                    'qty'       : qty,
                });
            }

        return lotToQtyStack;
    }
    function createInventoryAdjustment({item, location, totalQty ,byProduct, lotToQtyStack}){
        let sublistId = "inventory";

        let nRec = Nrecord.create({
            type: "inventoryadjustment",
            isDynamic: true,
            defaultValues: {
                customform: 87
            }
        });

        nRec.setValue({ fieldId:'account'  , value: cs.ADJUSTMENT_ACCOUNT});

        nRec.selectNewLine({sublistId, line});

        // Set Line fields
        nRec.setCurrentSublistValue({ sublistId, fieldId:'item'         , value: item     , ignoreFieldChange: true});
        nRec.setCurrentSublistValue({ sublistId, fieldId:'location'     , value: location , ignoreFieldChange: true});
        nRec.setCurrentSublistValue({ sublistId, fieldId:'adjustqtyby'  , value: totalQty , ignoreFieldChange: true});

        // Get Inventory Detail Record
        invDetRec = nRec.getCurrentSublistSubrecord({
            sublistId: 'item',
            fieldId: 'inventorydetail',
        });

        // Set Inventory Detail

        let sublistLength = lotToQtyStack.length;
        while (sublistLength--){
            let lotDetails = lotToQtyStack.pop();

            Nlog.debug("Log Details", JSON.stringify(lotDetails));

            invDetRec.selectNewLine({sublistId:'inventoryassignment'});
            invDetRec.setCurrentSublistValue({ sublistId:'inventoryassignment', fieldId:'issueinventorynumber'   , value: lotDetails.lot        , ignoreFieldChange: true}),
            invDetRec.setCurrentSublistValue({ sublistId:'inventoryassignment', fieldId:'existingexpdate'        , value: lotDetails.expDate    , ignoreFieldChange: true}),
            invDetRec.setCurrentSublistValue({ sublistId:'inventoryassignment', fieldId:'quantity'               , value: lotDetails.qty        , ignoreFieldChange: true});
            invDetRec.commitLine({sublistId:'inventoryassignment'});
        }

        nRec.commitLine({sublistId,});

        return nRec.save();
    }



});