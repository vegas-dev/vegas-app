import VGAlert from './modules/vgalert';
import VGCollapse from './modules/vgcollapse';
import VGDropdown from './modules/vgdropdown';
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
import VGTable from "./modules/vgtable";
import VGToast from './modules/vgtoast';
import VGTooltip from './modules/vgtooltip';

/**
 * VGApp — центральный реестр модулей библиотеки vgapp.
 *
 * Скрипт собирает стандартные модули из `defaultModules`, регистрирует их по
 * статическому имени `Module.NAME`, а затем запускает метод `boot()` только у
 * тех модулей, которые есть в реестре и не были исключены пользователем.
 *
 * Базовое использование:
 *
 * import vgapp from 'vgapp';
 *
 * vgapp.boot();
 *
 * Передача настроек конкретному модулю:
 *
 * vgapp.boot({
 * 	modal: {
 * 		backdrop: true,
 * 		keyboard: true,
 * 	},
 * 	tooltip: {
 * 		placement: 'top',
 * 	},
 * });
 *
 * Исключение модулей из автоматической регистрации и запуска:
 *
 * vgapp.boot({
 * 	excludeModules: ['tooltip', 'toast', 'lawcookie'],
 * });
 *
 * Допустимые алиасы для списка исключений: `excludeModules`, `exclude`,
 * `without`. Значение можно передать массивом, Set или строкой через запятую:
 *
 * vgapp.boot({ exclude: 'tooltip, toast' });
 *
 * Важно: исключение работает на уровне реестра и автозапуска. Такой модуль не
 * будет зарегистрирован в `vgapp`, не получит вызов `boot()` и не будет
 * доступен через `vgapp.get(name)`. Так как этот файл использует статические
 * import-ы, исключенный модуль всё равно может попасть в итоговый JS-бандл на
 * этапе сборки. Если нужно физически убрать модуль из бандла, нужно собирать
 * отдельную точку входа или переводить загрузку модулей на dynamic import.
 *
 * Список стандартных имен для исключения:
 * `alert`, `collapse`, `dropdown`, `dynamicTable`, `files`, `filepreview`,
 * `form-sender`, `lawcookie`, `loadmore`, `modal`, `nav`, `nestable`,
 * `rangeslider`, `rollup`, `select`, `sidebar`, `spy`, `tabs`, `toast`,
 * `tooltip`.
 *
 * Исключения можно задать заранее, если создается отдельный экземпляр:
 *
 * const app = new VGApp({
 * 	excludeModules: ['tooltip', 'toast'],
 * 	initializer: (app) => {
 * 		defaultModules.forEach((Module) => app.register(Module.NAME, Module));
 * 	},
 * });
 *
 * Также можно управлять списком программно:
 *
 * vgapp.exclude(['tooltip', 'toast']).boot();
 * vgapp.include('tooltip');
 *
 * Метод `include()` возвращает имя в список допустимых, но не импортирует и не
 * регистрирует модуль заново после инициализации. Если модуль нужно вернуть в
 * уже инициализированное приложение, его нужно зарегистрировать явно через
 * `vgapp.register(Module.NAME, Module)`.
 */
class VGApp {
	constructor(options = {}) {
		this._modules = new Map();
		this._excludedModules = this._normalizeModuleNameList(
			options.excludeModules ?? options.exclude ?? options.without
		);
		this._initializer = typeof options.initializer === 'function'
			? options.initializer
			: null;
		this._isInitialized = false;
	}

	register(name, Module) {
		const normalizedName = this._normalizeModuleName(name);
		const candidate = this._resolveModuleCandidate(Module);

		if (!normalizedName) {
			throw new Error('VGApp.register() ожидает строковое имя модуля первым аргументом.');
		}

		if (this._isModuleExcluded(normalizedName)) {
			return this;
		}

		this._modules.set(normalizedName, candidate);
		return this;
	}

	boot(config = {}) {
		const bootConfig = this._normalizeBootConfig(config);

		this.exclude(bootConfig.excludeModules);
		this._ensureInitialized();

		for (const [name, Module] of this._modules) {
			if (this._isModuleExcluded(name)) {
				continue;
			}

			if (typeof Module?.boot !== 'function') {
				continue;
			}

			const moduleConfig = this._resolveModuleConfig(name, bootConfig.modulesConfig);
			Module.boot(moduleConfig);
		}

		return this;
	}

	get(name) {
		this._ensureInitialized();
		return this._modules.get(this._normalizeModuleName(name));
	}

	has(name) {
		this._ensureInitialized();
		return this._modules.has(this._normalizeModuleName(name));
	}

	exclude(names) {
		this._normalizeModuleNameList(names).forEach((name) => {
			this._excludedModules.add(name);

			if (this._isInitialized) {
				this._deleteModuleByExcludedName(name);
			}
		});

		return this;
	}

	include(names) {
		this._normalizeModuleNameList(names).forEach((name) => {
			this._excludedModules.delete(name);
		});

		return this;
	}

	isExcluded(name) {
		return this._isModuleExcluded(name);
	}

	getExcluded() {
		return Array.from(this._excludedModules);
	}

	_resolveModuleCandidate(Module) {
		const candidate = Module?.default ?? Module;

		if (!candidate) {
			throw new Error('VGApp.register() ожидает валидный модуль.');
		}

		return candidate;
	}

	_resolveModuleConfig(name, config) {
		if (!config || typeof config !== 'object') {
			return undefined;
		}

		return Object.prototype.hasOwnProperty.call(config, name)
			? config[name]
			: undefined;
	}

	_normalizeBootConfig(config) {
		if (!config || typeof config !== 'object') {
			return {
				excludeModules: [],
				modulesConfig: {},
			};
		}

		const excludeModules = config.excludeModules ?? config.exclude ?? config.without ?? [];
		const modulesConfig = config.modules && typeof config.modules === 'object'
			? config.modules
			: config;

		return {
			excludeModules,
			modulesConfig,
		};
	}

	_normalizeModuleNameList(names) {
		if (!names) {
			return new Set();
		}

		const source = typeof names === 'string'
			? names.split(',')
			: Array.from(names);

		return new Set(
			source
				.map((name) => this._normalizeExcludedModuleName(name))
				.filter(Boolean)
		);
	}

	_normalizeModuleName(name) {
		return String(name || '').trim();
	}

	_normalizeExcludedModuleName(name) {
		return this._normalizeModuleName(name).toLowerCase();
	}

	_isModuleExcluded(name) {
		return this._excludedModules.has(this._normalizeExcludedModuleName(name));
	}

	_deleteModuleByExcludedName(name) {
		for (const moduleName of this._modules.keys()) {
			if (this._normalizeExcludedModuleName(moduleName) === name) {
				this._modules.delete(moduleName);
			}
		}
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
	VGTable,
	VGToast,
	VGTooltip,
];

const vgapp = new VGApp({
	initializer: (app) => {
		defaultModules.forEach((Module) => {
			app.register(Module.NAME, Module);
		});
	},
});

export { VGApp, vgapp };
export default vgapp;
