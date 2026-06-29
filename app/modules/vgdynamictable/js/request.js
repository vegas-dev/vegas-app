import {toQueryParamValue} from "./utils/common";

class VGDtRequest {
    constructor(options = {}) {
        this.endpoint = options.endpoint || '';
        this.method = (options.method || 'GET').toUpperCase();
        this.credentials = options.credentials || 'same-origin';
        this.headers = options.headers || { 'Accept': 'application/json' };
        this.baseParams = options.params || {};
    }

    setEndpoint(endpoint) {
        this.endpoint = endpoint || '';
    }

    setParams(params = {}) {
        this.baseParams = params || {};
    }

    buildUrl(params = {}, endpoint = '') {
        const target = String(endpoint || this.endpoint || '').trim();
        if (!target) {
            throw new Error('Request endpoint is empty');
        }
        const url = new URL(target, window.location.origin);
        const merged = Object.assign({}, this.baseParams, params);
        Object.keys(merged).forEach((key) => {
            const value = toQueryParamValue(merged[key]);
            if (value === undefined || value === null || value === '') {
                return;
            }
            url.searchParams.set(key, String(value));
        });
        return url;
    }

    async get(params = {}, options = {}) {
        const endpoint = options && options.endpoint ? options.endpoint : '';
        const signal = options && options.signal ? options.signal : undefined;
        const url = this.buildUrl(params, endpoint);
        const response = await fetch(url.toString(), {
            method: this.method,
            credentials: this.credentials,
            headers: this.headers,
            signal,
        });
        if (!response.ok) {
            let payload = null;
            try {
                payload = await response.json();
            } catch (error) {
                payload = null;
            }
            const apiError = payload && payload.error && typeof payload.error === 'object' ? payload.error : {};
            const message = String(apiError.message || response.statusText || 'Request failed');
            const err = new Error(message);
            err.status = response.status;
            err.code = apiError.code || 'REQUEST_FAILED';
            err.details = Array.isArray(apiError.details) ? apiError.details : [];
            err.requestId = apiError.request_id || response.headers.get('X-Request-Id') || '';
            throw err;
        }
        return response.json();
    }
}

export default VGDtRequest;
