import BaseModule from "../../base-module";
import EventHandler from "../../../utils/js/dom/event";
import {dismissTrigger} from "../../module-fn";
import {execute, isDisabled, makeRandomString, mergeDeepObject, noop} from "../../../utils/js/functions";
import Selectors from "../../../utils/js/dom/selectors";

/**
 * Constants
 */
const NAME = 'spy';
const NAME_KEY = 'vg.spy';


class VGSpy extends BaseModule {
	constructor(element, params = {}) {
		super(element, params);

		this._params = this._getParams(element, mergeDeepObject({
			speed: 1500,
			offset: 0,
			easing: 'easeInOutSine', // easeInOutSine:easeOutSine:easeInOutQuint
			isState: false,
			onActive: noop,
			onClick: noop,
			activeClass: ['active']
		}, params));

		this.isClick = false;

		this.links = this._element.querySelectorAll('[data-vg-target]').length ?
			this._element.querySelectorAll('[data-vg-target]') :
			this._element.querySelectorAll('a')
		;

		this.onLoad();
		this.onClick();
		this.onScroll();
	}

	static get NAME() {
		return NAME;
	}

	static get NAME_KEY() {
		return NAME_KEY
	}

	onLoad() {
		let _this = this;

		document.addEventListener('DOMContentLoaded', function () {
			_this.setCurrentSection(null);
		});
	}

	onClick() {
		let _this = this;

		_this.links.forEach(el => {
			if (el) {
				el.onclick = function (e) {
					execute(_this._params.onClick, [e, this])
					_this.setCurrentSection(this);

					return false;
				}
			}
		});
	}

	onScroll() {
		let _this = this;

		if (!_this.isClick) {
			window.onscroll = function () {
				_this.setCurrentSection(null);
			}
		}
	}

	setCurrentSection($link = null) {
		this.removeCurrentActive();

		if (this._params.isState) {
			// TODO не тестили
			let target = window.location.hash;
			if (target) {
				let $element = document.querySelector('[href="'+ target +'"]') ||
					document.querySelector('[href="\/' + target +'"]') ||
					document.querySelector('[data-vg-target="'+ target.replace('#', '') +'"]') || null;

				if ($element !== null) {
					$link = $element;
				}
			}
		}

		if ($link) {
			let target = this.attributes($link, 'target'),
				offset = this.attributes($link, 'offset'),
				section = document.getElementById(target);

			if (section) {
				let scrollTargetY = section.offsetTop + (offset) + (this._params.offset),
					scrollY = window.scrollY || document.documentElement.scrollTop,
					speed = this._params.speed,
					easing = this._params.easing,
					currentTime = 0;

				this.removeCurrentActive();
				this.setActive($link, section);

				let time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8)),
					easingEquations = {
						easeOutSine: function (pos) {
							return Math.sin(pos * (Math.PI / 2));
						},
						easeInOutSine: function (pos) {
							return (-0.5 * (Math.cos(Math.PI * pos) - 1));
						},
						easeInOutQuint: function (pos) {
							if ((pos /= 0.5) < 1) {
								return 0.5 * Math.pow(pos, 5);
							}
							return 0.5 * (Math.pow((pos - 2), 5) + 2);
						}
					};

				window.requestAnimFrame = (function(){
					return  window.requestAnimationFrame       ||
						window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame    ||
						function( callback ){
							window.setTimeout(callback, 1000 / 60);
						};
				})();

				function move() {
					currentTime += 1 / 60;

					let p = currentTime / time,
						t = easingEquations[easing](p);

					if (p < 1) {
						requestAnimFrame(move);
						window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
					} else {
						window.scrollTo(0, scrollTargetY);
					}
				}

				move();

				this.isClick = false;
			}
		} else {
			for (let i = 0; i < this.links.length; i++) {
				let target = this.attributes(this.links[i], 'target'),
					offset = this.attributes(this.links[i], 'offset'),
					section = document.getElementById(target);

				if (section) {
					let start = section.offsetTop + (offset) + (this._params.offset),
						end = start + section.offsetHeight,
						currentPosition = (document.documentElement.scrollTop || document.body.scrollTop),
						isInView = currentPosition >= start && currentPosition < end;

					if (isInView) {
						this.removeCurrentActive({ignore: this.links[i]});
						this.setActive(this.links[i], section);
					}
				}
			}
		}
	}

	setActive($link, $section) {
		const isActive = this._params.activeClass.every(function (value){
			return $link.classList.contains(value);
		});

		if (this._params.isState) {
			let text = this.attributes($link, 'text'),
				target = this.attributes($link, 'target');

			history.pushState("", document.title + text, '#' + target);
		}

		if (!isActive) {
			if ($section) {
				$section.classList.add(...this._params.activeClass);
			}

			if ($link) {
				$link.classList.add(...this._params.activeClass);
			}

			execute(this._params.onActive, [$link, $section]);
		}
	}

	removeCurrentActive(options = { ignore: null }) {
		for (let i = 0; i < this.links.length; i++) {
			let target = this.attributes(this.links[i], 'target'),
				section = document.getElementById(target);

			if ((options.ignore !== this.links[i]) && section) {
				this.links[i].classList.remove(...this._params.activeClass);
				section.classList.remove(...this._params.activeClass);
			}
		}
	}

	attributes(self, prop = '') {
		let target = self.getAttribute('href') || self.dataset.vgTarget;

		if (target !== 'undefined' && target.indexOf('#') !== -1) {
			target = target.replace(/(^.+)#/gm, '');

			if (target.indexOf('#') !== -1) {
				target = target.replace('#', '');
			}
		} else if (target !== 'undefined' && target.indexOf('#') === -1) {
			target = ''
		}

		let offset = self.dataset.vgOffset ? parseInt(self.dataset.vgOffset) : 0;
		let text = self.innerHTML;

		if (prop === 'target') return target;
		if (prop === 'offset') return offset;
		if (prop === 'text') return text;

		return {
			target: target,
			offset: offset,
			text: text
		};
	}
}

export default VGSpy;
