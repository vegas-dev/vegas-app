import {normalizeNonNegativeInt, safeQuerySelector} from "./utils/common";

class Search {
    constructor(options = {}) {
        this._options = Object.assign({
            enabled: true,
            debounceMs: 300,
            inputSelector: '',
            param: 'q',
            onSearch: null,
        }, options);

        this._input = null;
        this._timer = null;

        this._boundInput = this._handleInput.bind(this);
        this._boundKeyDown = this._handleKeyDown.bind(this);
    }

    init() {
        if (!this._options.enabled) {
            return;
        }

        const selector = String(this._options.inputSelector || '').trim();
        if (!selector) {
            return;
        }

        const input = safeQuerySelector(selector);
        if (!input) {
            return;
        }

        this._input = input;
        this._input.addEventListener('input', this._boundInput);
        this._input.addEventListener('keydown', this._boundKeyDown);
    }

    destroy() {
        if (!this._input) {
            return;
        }

        this._input.removeEventListener('input', this._boundInput);
        this._input.removeEventListener('keydown', this._boundKeyDown);
        this._input = null;
        clearTimeout(this._timer);
        this._timer = null;
    }

    _handleInput() {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this._emit();
        }, normalizeNonNegativeInt(this._options.debounceMs, 300));
    }

    _handleKeyDown(event) {
        if (event.key !== 'Enter') {
            return;
        }

        event.preventDefault();
        clearTimeout(this._timer);
        this._emit();
    }

    _emit() {
        if (typeof this._options.onSearch !== 'function' || !this._input) {
            return;
        }

        this._options.onSearch({
            value: this._input.value.trim(),
            param: String(this._options.param || 'q'),
        });
    }
}

export default Search;

