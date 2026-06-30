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
	constructor() {
		this._modules = new Map();
	}

	register(...entries) {
		const modules = entries.flatMap((entry) => {
			if (Array.isArray(entry)) {
				return entry;
			}

			return entry ? [entry] : [];
		});

		for (const Module of modules) {
			const name = String(Module?.NAME || '').trim();

			if (!name) {
				throw new Error('VGApp.register() ожидает модуль со статическим NAME.');
			}

			this._modules.set(name, Module);
		}

		return this;
	}

	boot(config = {}) {
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
		return this._modules.get(String(name).trim());
	}

	has(name) {
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
}

const vgapp = new VGApp();

vgapp.register(
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
);

export { VGApp, vgapp };
export default vgapp;
