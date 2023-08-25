/**
 * @NApiVersion 2.1
 * @file renders open item fulfillments
 */

define([
	'N/ui/serverWidget', 'N/ui/message',
	'ui',
	'N/search', 'N/record', 'N/log',
	'search_mdl', "datetime_mdl", "summarize_mdl",
	'cs'
], (
	Nui, Nmessage,
	ui,
	Nsearch, Nrecord, Nlog,
	search, dt, summarize_mdl,
	cs,
) => {
	const SEARCH_INPUT_FIELDS = [
		{
			id: 'customer',
			type: Nui.FieldType.SELECT,
			label: 'Customer',
			source: 'customer'
		},
		{
			id: 'billing_date',
			type: ui.form.FieldType.DATE,
			label: 'Billing Date'
		},
		{
			id: 'billing_cycle',
			type: ui.form.FieldType.SELECT,
			label: 'Billing Cycle',
			options: [
				{ text: 'Weekly', value: cs.BILLING_CYCLE.WEEKLY },
				{ text: 'Monthly', value: cs.BILLING_CYCLE.MONTHLY }
			]
		},
		{
			id: 'include_past_unbilled',
			label: 'Include Past Unbilled',
			type: ui.form.FieldType.CHECKBOX,
		},
	];

	return {
		createLandingPage,
		createSearchResultsPage
	};

	function createLandingPage() {
		let searchFields = SEARCH_INPUT_FIELDS;
		const page = ui.form.create({
			title: 'Customer Invoice Creator',
			// submit: [
			// 	{
			// 		label: 'Search for Transactions',
			// 	}
			// ],
			clientScriptModulePath: '/SuiteScripts/CustomerInvoicing/Views/client.js',
			buttons: [{
				id: "button_search",
				label: "Search",
				functionName: "loadSearchResults"
			}],
			tabs: [
				{
					id: 'customer_invoicing_params',
					label: 'Script Parameters',
					fields: searchFields,
				},
			],
		});

		return page;
	}

	function createSearchResultsPage(params) {
		// Nlog.audit("Search Params", JSON.stringify(params));
		Nlog.audit("Results Page Params", JSON.stringify(params));

		// Set Body fields:
		let title = 'Search Results', sublists = [], searchFields = SEARCH_INPUT_FIELDS;

		// Set line fields
		let inputs = {
			customer: parseInt(params.customer),
			billingCycle: parseInt(params.billing_cycle),
			billingDate: params.billing_date,
			includePastUnbilled: params.include_past_unbilled.toLowerCase() === 'true'
		};

		//Format Param Values
		params = {
			customer: parseInt(params.customer),
			billing_cycle: parseInt(params.billing_cycle),
			billing_date: params.billing_date,
			include_past_unbilled: params.include_past_unbilled.toLowerCase() === 'true'
		};
		addDefaultSearchValues(searchFields, params);


		Nlog.audit("Results Page Inputs", JSON.stringify(inputs));

		let transactions = search.getTransactions(inputs);

		transactions = transactions && transactions.length > 0 ? summarize_mdl.summarizeTransactions(transactions, cs.PROPERTIES_TO_CONSOLIDATE) : [];


		if (transactions.length > 0) {
			sublists.push({
				id: 'transaction_list',
				label: `Transactions: ${transactions.length} Results`,
				type: ui.form.SublistType.LIST,
				// markAll: true,
				data: transactions,
				fields: [
					// {
					// 	id: 'list_exclude',
					// 	label: 'Exclude',
					// 	type: ui.form.FieldType.CHECKBOX,
					// }, // uncomment markAll if when you put this back
					{
						id: 'transaction_url',
						label: 'View',
						type: ui.form.FieldType.URL,
						value: 'lineItem.transaction_url',
						config: {
							// updateDisplayType: { displayType: ui.form.FieldDisplayType.INLINE
							linkText: 'View'
						}
					},
					{
						id: 'list_internalid',
						label: 'Internal ID',
						type: ui.form.FieldType.TEXT,
						value: 'lineItem.id',
						config: {
							updateDisplayType: { displayType: ui.form.FieldDisplayType.HIDDEN }
						}
					},
					{
						id: 'list_tranid',
						label: 'Document Number',
						type: ui.form.FieldType.TEXT,
						value: 'lineItem.documentNumber'
					},
					{
						id: 'list_date',
						label: 'Date',
						type: ui.form.FieldType.DATE,
						value: 'lineItem.date',
					},
					{
						id: 'list_customer',
						label: 'Customer',
						type: ui.form.FieldType.SELECT,
						source: 'customer',
						value: 'lineItem.entity',
						config: {
							updateDisplayType: { displayType: ui.form.FieldDisplayType.DISABLED }
						}
					}, // will just use the customer name
					{
						id: 'list_total_cases',
						label: 'Total Cases',
						type: ui.form.FieldType.FLOAT,
						value: 'lineItem.cases'
					},
					{
						id: 'list_total_pallets',
						label: 'Total pallets',
						type: ui.form.FieldType.FLOAT,
						value: 'lineItem.pallets'
					},
					// form.addField({
					// 	id: 'custpage_item',
					// 	label: 'Item',
					// 	type: serverWidgetModule.FieldType.MULTISELECT,
					// 	source: 'item'
					// }).defaultValue = params.hasOwnProperty('custpage_item') ? params['custpage_item'] : null;
				],
			});
		} else {
			sublists.push({
				id: 'transaction_empty_list',
				label: `No Transactions Found. Please Change Search Criteria.`,
				type: ui.form.SublistType.LIST,
			});
		}

		// Create a form
		let outline = {
			title,
			clientScriptModulePath: '/SuiteScripts/CustomerInvoicing/Views/client.js',
			buttons: [{
				id: "button_search",
				label: "Search",
				functionName: "loadSearchResults"
			}],
			fields: searchFields,
			sublists
		};
		if (transactions.length > 0)
			outline['submit'] = [{ label: 'Create Invoice', }];

		const page = ui.form.create(outline);
		// page.
		return page;
	}

	function addDefaultSearchValues(searchFields, params) {
		searchFields.forEach((field) => {
			if (params.hasOwnProperty(field.id))
				field['defaultValue'] = params[field.id];
		})
	}

});