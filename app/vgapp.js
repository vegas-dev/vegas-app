import VGAlert from './modules/vgalert';
import VGCollapse from './modules/vgcollapse';
import VGDropdown from './modules/vgdropdown';
import { VGDynamicTable } from './modules/vgdynamictable';
import VGFiles from './modules/vgfiles';
import VGFilePreview from './modules/vgfilepreview';
import VGFormSender from './modules/vgformsender';
import VGLawCookie from './modules/vglawcookie';
import VGLoadMore from './modules/vgloadmore';
import VGModal from './modules/vgmodal';
import VGNav from './modules/vgnav';
import VGNestable from './modules/vgnestable';
import VGRangeSlider from './modules/vgrangeslider';
import VGRollup from './modules/vgrollup';
import VGSelect from './modules/vgselect';
import VGSidebar from './modules/vgsidebar';
import VGSpy from './modules/vgspy';
import VGTabs from './modules/vgtabs';
import VGToast from './modules/vgtoast';
import VGTooltip from './modules/vgtooltip';

class VGApp {
	constructor(options = {}) {
		this._modules = new Map();
		this._initializer = typeof options.initializer === 'function'
			? options.initializer
			: null;
		this._isInitialized = false;
	}

	register(...entries) {
		const modules = entries.flatMap((entry) => {
			if (Array.isArray(entry)) {
				return entry;
			}

			return entry ? [entry] : [];
		});

		for (const Module of modules) {
			const candidate = Module?.default ?? Module;
			const name = String(candidate?.NAME || '').trim();

			if (!name) {
				const moduleKeys = Module && typeof Module === 'object'
					? Object.keys(Module).join(', ')
					: '';
				throw new Error(`VGApp.register() ожидает модуль со статическим NAME. Получено: ${moduleKeys || typeof Module}`);
			}

			this._modules.set(name, candidate);
		}

		return this;
	}

	boot(config = {}) {
		this._ensureInitialized();

		for (const [name, Module] of this._modules) {
			if (typeof Module?.boot !== 'function') {
				continue;
			}

			const moduleConfig = this._resolveModuleConfig(name, config);
			Module.boot(moduleConfig);
		}

		return this;
	}

	get(name) {
		this._ensureInitialized();
		return this._modules.get(String(name).trim());
	}

	has(name) {
		this._ensureInitialized();
		return this._modules.has(String(name).trim());
	}

	_resolveModuleConfig(name, config) {
		if (!config || typeof config !== 'object') {
			return undefined;
		}

		return Object.prototype.hasOwnProperty.call(config, name)
			? config[name]
			: undefined;
	}

	_ensureInitialized() {
		if (this._isInitialized || typeof this._initializer !== 'function') {
			return;
		}

		this._isInitialized = true;
		this._initializer(this);
	}
}

const defaultModules = [
	VGAlert,
	VGCollapse,
	VGDropdown,
	VGDynamicTable,
	VGFiles,
	VGFilePreview,
	VGFormSender,
	VGLawCookie,
	VGLoadMore,
	VGModal,
	VGNav,
	VGNestable,
	VGRangeSlider,
	VGRollup,
	VGSelect,
	VGSidebar,
	VGSpy,
	VGTabs,
	VGToast,
	VGTooltip,
];

const vgapp = new VGApp({
	initializer: (app) => app.register(defaultModules),
});

export { VGApp, vgapp };
export default vgapp;
