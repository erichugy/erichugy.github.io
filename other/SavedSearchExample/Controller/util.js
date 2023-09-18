/**
 * @NApiVersion 2.1
 * @NAmdConfig ../config.json
 * @File Controller for Daily KPI Dashboard Parser
 */

define([
    "N/runtime", "N/log", "N/search", "N/format",
    "cs",
], function (
    Nruntime, Nlog, Nsearch, Nformat,
    cs
) {

    return{
        yesterday: yesterday,
        getSearchInternalIdCount: getSearchInternalIdCount,
        getSearchCount:getSearchCount,
        getSearchAvgByCol: getSearchAvgByCol,
    };


    function getSearchInternalIdCount(id, name = "internalid", summary = 'COUNT', column = null){
        let searchResults = {};
        let col = column ? column : {name : name, summary: summary};
        let scriptName = cs.SEARCH_PREFIX + id.toString();
        Nlog.debug("scriptName", scriptName);

        let script = Nruntime.getCurrentScript();
        let searchId = script.getParameter({name: scriptName});

        if (!searchId) Nlog.error(`Unable to get saved search parameter`, `Missing search for ${scriptName}`);

        Nsearch.load({id: searchId}).run().each((result) => {
            searchResults.value = result.getValue(col);
            return true;
        });

        return searchResults.value;
    }

    function getSearchCount(id){
        let scriptName = cs.SEARCH_PREFIX + id.toString();
        Nlog.debug("scriptName", scriptName);

        let script = Nruntime.getCurrentScript();
        let searchId = script.getParameter({name: scriptName});
        if (!searchId) Nlog.error(`Unable to get saved search parameter`, `Missing search for ${scriptName}`);

        return Nsearch.load({id: searchId}).runPaged().count;
    }

    function getSearchAvgByCol(id, targetColIndex = -1){
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

        if (targetColIndex < 0)
            targetColIndex += resultsSet.columns.length;
        if (targetColIndex < 0 || targetColIndex >=  resultsSet.columns.length)
            throw new Error(`Input Error: Invalid targetColIndex value ${targetColIndex}`);

        resultsSet.each((result) => {
            let lineVal = parseFloat(result.getValue(resultsSet.columns[targetColIndex]));
                // result.getValue({"name":"formulanumeric","label":"Approval Time"});
            searchResults.value += lineVal;
            searchResults.count ++;
            // Nlog.debug(`Line (count) ${searchResults.count}`,`Cumulative Sum ${searchResults.value}`);
            return true;
        });

        return searchResults.value / searchResults.count;
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

});