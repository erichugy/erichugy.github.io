/**
 * @NApiVersion 2.1
 * @file Constants
 */

define([], () => {
    const CHANTAL   = "chantal";
    const VIKASHA   = "vikasha";
    const WAYLEN    = "waylen";
    const EVERYONE  = [CHANTAL, VIKASHA, WAYLEN];
    const SEARCH_PREFIX = "custscript_ap_kpi_";
    return {
        CHANTAL,
        VIKASHA,
        WAYLEN,
        EVERYONE,
        SEARCH_PREFIX: SEARCH_PREFIX
    }
});