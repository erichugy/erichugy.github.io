/**
 * @NApiVersion 2.1
 * @file Logic specific for creating or modifying NetSuite-like forms
 */
define(['N/ui/message', 'N/ui/serverWidget'], (Nmsg, Nui) => {

  return {
    form: {
      create,
      update,

      get FieldBreakType() { return Nui.FieldBreakType; },
      get FieldDisplayType() { return Nui.FieldDisplayType; },
      get FieldLayoutType() { return Nui.FieldLayoutType; },
      get FieldType() { return Nui.FieldType; },
      get ListStyle() { return Nui.ListStyle; },
      get SublistDisplayType() { return Nui.SublistDisplayType; },
      get SublistType() { return Nui.SublistType; },
    },
    message: {
      get Type() { return Nmsg.Type; },
    }
  };

  /**
   * Creates a new serverWidget.Form and builts it out according to the provided
   *     outline
   * @param {Object} param.outline The outline of the form to create
   * @returns {serverWidget.Form} The newly created NetSuite form
   */
  function create(outline) {
    log.debug('outline', outline);
    const form = Nui.createForm({ title: outline.title });
    if ("clientScriptModulePath" in outline) {
      form.clientScriptModulePath = outline["clientScriptModulePath"];
    }

    buildUI({ form, outline });
    return form;
  }

  /**
   * Adds components to the provided form according to the provided outline
   * @param {Object} form The NetSuite form to add components to
   * @param {Object} outline The outline of the form to create
   */
  function update(form, outline) {
    log.debug('outline', outline);
    buildUI({ form, outline, update: true });
  }



  /**
   * Adds components to a serverWidget.Form based on an outline of components
   *     to add to the form or container
   * @private
   */
  function buildUI({ form, outline, container, update }) {
    // the method to call for each component type
    const Method = {
      submit: 'addSubmitButton',
      buttons: 'addButton',
      fields: 'addField',
      fieldGroups: 'addFieldGroup',
      sublists: 'addSublist',
      subtabs: 'addSubtab',
      tabs: 'addTab',
    };

    for (let def in outline) {
      if (Method[def]) { // if a valid component to add
        setupComponents({
          form,
          method: Method[def],
          components: outline[def],
          container,
          update,
        });
      }
    }
  }

  /**
   * Adds components to a serverWidget.Form, then calls buildUI to add any
   *     nested components
   * @private
   */
  function setupComponents({ form, method, components, container, update }) {
    components.forEach((component) => {
      let extComp = update ?
        form[method.replace('add', 'get')]({ ...component }) : null;
      let comp = extComp || form[method]({ ...component, container, tab: container });
      if ('value' in component) {
        if (!String(component.value).startsWith('lineItem')) {
          comp.defaultValue = component.value;
        }
      } else if ('defaultValue' in component && component.defaultValue) {
        comp.defaultValue = component.defaultValue;
      }
      if ('options' in component) {
        component.options.forEach(option => comp.addSelectOption(option));
      }
      if ('config' in component) {
        for (let cfg in component.config) {
          let isObject = typeof component.config[cfg] === 'object';
          let isDate = component.config[cfg] instanceof Date;

          // if an object and not a Date, call it as a method on the component
          if (isObject && !isDate) { comp[cfg](component.config[cfg]); }
          // else, set the property on the component
          else { comp[cfg] = component.config[cfg]; }
        }
      }

      if (method === 'addSublist') {
        // add the sublist columns
        buildUI({ form: comp, outline: component });
        if (component.markAll === true) {
          comp.addMarkAllButtons();
        }
        // loop through line items
        if ('data' in component) {
          component.data.forEach((lineItem, line) => { // lineItem will be used with eval()
            // loop columns
            component.fields.forEach((field) => {
              let { id, value: valueStr, linkText = null } = field;
              let value = eval(valueStr); // jshint ignore: line
              if (value) { comp.setSublistValue({ id, value, line }); }
            });
          });
        }
      }
      else {
        // add any nested components
        buildUI({ form, outline: component, container: component.id });
      }
    });
  }

});
