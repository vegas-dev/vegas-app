import {normalizeNonNegativeInt, safeQuerySelector} from "./utils/common";

class Filters {
    constructor(options = {}) {
        this._options = Object.assign({
            enabled: true,
            formSelector: '',
            formNode: null,
            debounceMs: 300,
            applyMode: 'auto', // auto | manual
            button: {
                apply: '[data-filter-apply]',
                reset: '[data-filter-reset]',
            },
            fieldAttr: 'data-filter-field',
            partAttr: 'data-filter-part',
            typeAttr: 'data-filter-type',
            valueAttr: 'data-filter-value',
            operatorAttr: 'data-filter-operator',
            defaultOperator: 'eq',
            skipEmpty: true,
            trimValues: true,
            emitOnInit: false,
            initialValues: {},
            onChange: null,
            onReset: null,
        }, options);

        this._form = null;
        this._timer = null;
        this._controls = [];
        this._boundInput = this._handleInput.bind(this);
        this._boundChange = this._handleChange.bind(this);
        this._boundClick = this._handleClick.bind(this);
        this._boundSubmit = this._handleSubmit.bind(this);
    }

    init() {
        if (!this._options.enabled) {
            return;
        }

        const form = this._resolveFormNode();
        if (!form) {
            return;
        }

        this._form = form;
        this._syncCachedNodes();
        this._form.addEventListener('input', this._boundInput);
        this._form.addEventListener('change', this._boundChange);
        this._form.addEventListener('click', this._boundClick);
        this._form.addEventListener('submit', this._boundSubmit);

        this.setValues(this._options.initialValues || {}, { emit: false });
        if (this._options.emitOnInit) {
            this._emit();
        }
    }

    destroy() {
        if (!this._form) {
            return;
        }
        this._form.removeEventListener('input', this._boundInput);
        this._form.removeEventListener('change', this._boundChange);
        this._form.removeEventListener('click', this._boundClick);
        this._form.removeEventListener('submit', this._boundSubmit);
        this._form = null;
        clearTimeout(this._timer);
        this._timer = null;
        this._controls = [];
    }

    getState() {
        return this._collectState();
    }

    getValues() {
        return this._collectState().params;
    }

    getFields() {
        const unique = new Set();
        this._getControls().forEach((control) => {
            const field = this._getField(control);
            if (field) {
                unique.add(field);
            }
        });
        return Array.from(unique);
    }

    setValues(nextValues = {}, options = {}) {
        if (!this._form) {
            return;
        }
        this._getControls().forEach((control) => {
            const field = this._getField(control);
            if (!field) {
                return;
            }
            const part = this._getPart(control);
            const key = part === 'operator' ? `${field}_op` : field;
            const hasOwn = Object.prototype.hasOwnProperty.call(nextValues, key);
            const nextValue = hasOwn ? nextValues[key] : '';
            this._setControlValue(control, nextValue);
        });
        if (options.emit) {
            this._emit();
        }
    }

    _resolveFormNode() {
        if (this._options.formNode && this._options.formNode.nodeType === 1) {
            return this._options.formNode;
        }
        const selector = String(this._options.formSelector || '').trim();
        if (!selector) {
            return null;
        }
        return safeQuerySelector(selector);
    }

    _handleInput(event) {
        if (!this._isFilterControl(event.target)) {
            return;
        }
        if (this._isManualMode()) {
            return;
        }
        const type = String(event.target.type || '').toLowerCase();
        if (type === 'checkbox' || type === 'radio' || event.target.tagName === 'SELECT') {
            this._emit();
            return;
        }
        clearTimeout(this._timer);
        this._timer = setTimeout(() => this._emit(), normalizeNonNegativeInt(this._options.debounceMs, 300));
    }

    _handleChange(event) {
        if (!this._isFilterControl(event.target)) {
            return;
        }
        if (this._isManualMode()) {
            return;
        }
        clearTimeout(this._timer);
        this._emit();
    }

    _handleClick(event) {
        if (!this._form) {
            return;
        }
        const button = this._options.button || {};
        const applySelector = String(button.apply || '[data-filter-apply]').trim();
        const resetSelector = String(button.reset || '[data-filter-reset]').trim();

        const applyButton = applySelector ? event.target.closest(applySelector) : null;
        if (applyButton) {
            event.preventDefault();
            clearTimeout(this._timer);
            this._emit();
            return;
        }

        const resetButton = resetSelector ? event.target.closest(resetSelector) : null;
        if (!resetButton) {
            return;
        }
        event.preventDefault();
        this._reset();
        if (typeof this._options.onReset === 'function') {
            this._options.onReset();
        }
        clearTimeout(this._timer);
        this._emit();
    }

    _handleSubmit(event) {
        if (!this._isManualMode()) {
            return;
        }
        event.preventDefault();
        clearTimeout(this._timer);
        this._emit();
    }

    _emit() {
        if (!this._form || typeof this._options.onChange !== 'function') {
            return;
        }
        this._options.onChange(this._collectState());
    }

    _collectState() {
        const groups = new Map();
        this._getControls().forEach((control) => {
            const field = this._getField(control);
            if (!field) {
                return;
            }
            if (!groups.has(field)) {
                groups.set(field, {
                    field,
                    type: this._getType(control),
                    operator: this._getStaticOperator(control),
                    value: '',
                    values: [],
                });
            }
            const item = groups.get(field);
            const part = this._getPart(control);
            const value = this._readControlValue(control);
            const controlType = String(control.type || '').toLowerCase();
            if (part === 'operator') {
                item.operator = String(value || '').trim() || item.operator || this._getDefaultOperator();
                return;
            }
            if (part === 'type') {
                item.type = String(value || '').trim() || item.type || 'text';
                return;
            }
            // Ignore unchecked radio/checkbox values so they do not wipe selected values in a group.
            if ((controlType === 'checkbox' || controlType === 'radio') && value === '') {
                return;
            }
            if (Array.isArray(value)) {
                item.values = value.slice();
                item.value = item.values.join(',');
                return;
            }
            item.value = value;
        });

        const filters = {};
        const params = {};
        groups.forEach((item, field) => {
            const normalized = this._normalizeFilterItem(item);
            if (!normalized) {
                return;
            }
            filters[field] = normalized;

            if (normalized.values.length > 0) {
                params[field] = normalized.values.slice();
            } else {
                params[field] = normalized.value;
            }
            if (normalized.operator) {
                params[`${field}_op`] = normalized.operator;
            }
        });

        return {
            filters,
            params,
            fields: Object.keys(filters),
            meta: {
                count: Object.keys(filters).length,
            },
        };
    }

    _normalizeFilterItem(item) {
        const type = String(item.type || 'text').trim() || 'text';
        const operator = String(item.operator || this._getDefaultOperator()).trim();
        let value = item.value;
        let values = Array.isArray(item.values) ? item.values.slice() : [];

        if (this._options.trimValues) {
            if (typeof value === 'string') {
                value = value.trim();
            }
            values = values.map((entry) => String(entry || '').trim()).filter((entry) => entry !== '');
        }

        if (this._options.skipEmpty) {
            const isEmptyArray = values.length === 0;
            const isEmptyValue = value === undefined || value === null || String(value) === '';
            if (isEmptyArray && isEmptyValue) {
                return null;
            }
        }

        return {
            field: String(item.field || '').trim(),
            type,
            operator,
            value: value === undefined || value === null ? '' : value,
            values,
        };
    }

    _setControlValue(control, nextValue) {
        const type = String(control.type || '').toLowerCase();
        if (type === 'checkbox') {
            const normalized = String(nextValue || '').toLowerCase();
            control.checked = normalized === String(control.value || '').toLowerCase()
                || normalized === '1'
                || normalized === 'true'
                || normalized === 'on';
            return;
        }
        if (type === 'radio') {
            control.checked = String(control.value || '') === String(nextValue || '');
            return;
        }
        if (control.tagName === 'SELECT' && control.multiple) {
            const rawValues = Array.isArray(nextValue)
                ? nextValue
                : String(nextValue || '').split(',');
            const selected = new Set(rawValues
                .map((value) => String(value || '').trim())
                .filter((value) => value !== ''));
            Array.from(control.options || []).forEach((option) => {
                option.selected = selected.has(String(option.value || '').trim());
            });
            return;
        }
        control.value = String(nextValue || '');
    }

    _readControlValue(control) {
        if (control.tagName === 'SELECT' && control.multiple) {
            return Array.from(control.selectedOptions || [])
                .map((option) => String(option.value || '').trim())
                .filter((value) => value !== '');
        }
        const type = String(control.type || '').toLowerCase();
        if (type === 'checkbox') {
            return control.checked ? (control.value || '1') : '';
        }
        if (type === 'radio') {
            return control.checked ? (control.value || '') : '';
        }
        return String(control.value || '');
    }

    _syncCachedNodes() {
        if (!this._form) {
            this._controls = [];
            return;
        }
        const attr = this._getFieldAttr();
        this._controls = Array.from(this._form.querySelectorAll(`[${attr}]`))
            .filter((control) => this._isSupportedControl(control));
    }

    _getControls() {
        if (!this._form) {
            return [];
        }
        if (!Array.isArray(this._controls) || this._controls.length === 0) {
            this._syncCachedNodes();
        }
        return this._controls;
    }

    _reset() {
        this._getControls().forEach((control) => {
            const type = String(control.type || '').toLowerCase();
            if (type === 'checkbox' || type === 'radio') {
                control.checked = false;
                return;
            }
            if (control.tagName === 'SELECT') {
                if (control.multiple) {
                    Array.from(control.options || []).forEach((option) => {
                        option.selected = false;
                    });
                    return;
                }
                control.selectedIndex = 0;
                return;
            }
            control.value = '';
        });
    }

    _getFieldAttr() {
        return String(this._options.fieldAttr || 'data-filter-field').trim() || 'data-filter-field';
    }

    _getPartAttr() {
        return String(this._options.partAttr || 'data-filter-part').trim() || 'data-filter-part';
    }

    _getTypeAttr() {
        return String(this._options.typeAttr || 'data-filter-type').trim() || 'data-filter-type';
    }

    _getValueAttr() {
        return String(this._options.valueAttr || 'data-filter-value').trim() || 'data-filter-value';
    }

    _getOperatorAttr() {
        return String(this._options.operatorAttr || 'data-filter-operator').trim() || 'data-filter-operator';
    }

    _getDefaultOperator() {
        return String(this._options.defaultOperator || 'eq').trim() || 'eq';
    }

    _getField(control) {
        return String(control.getAttribute(this._getFieldAttr()) || '').trim();
    }

    _getPart(control) {
        const part = String(control.getAttribute(this._getPartAttr()) || 'value').toLowerCase().trim();
        if (part === 'operator' || part === 'type') {
            return part;
        }
        return 'value';
    }

    _getType(control) {
        const type = String(control.getAttribute(this._getTypeAttr()) || '').toLowerCase().trim();
        return type || 'text';
    }

    _getStaticOperator(control) {
        const operator = String(control.getAttribute(this._getOperatorAttr()) || '').trim();
        return operator || '';
    }

    _isFilterControl(node) {
        return Boolean(
            node
            && this._isSupportedControl(node)
            && typeof node.getAttribute === 'function'
            && String(node.getAttribute(this._getFieldAttr()) || '').trim() !== ''
        );
    }

    _isSupportedControl(node) {
        if (!node || typeof node.tagName !== 'string') {
            return false;
        }
        const tag = String(node.tagName || '').toUpperCase();
        return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
    }
    _isManualMode() {
        const mode = String(this._options.applyMode || 'auto').toLowerCase().trim();
        return mode === 'manual';
    }
}

export default Filters;
