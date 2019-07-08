import BaseView from 'base-view';

// const SELECTOR_SUBELEMENT = '[data-subelement]';
// const ATTR_MYPROPERTY = 'data-myproperty';

export default class <%= name %> extends BaseView {

	/**
	 * Entrypoint
	 */
	init() {
		// refs
		// to keep reference of scoped dom elements
		this.refs = {
			// subElement: this.el.querySelector(SELECTOR_SUBELEMENT),
		};

		// props
		// the component's static configuration
		this.props = {
			// myProperty: this.refs.subElement.getAttribute(ATTR_MYPROPERTY),
		};

		// state
		// the component's dynamic data representing its "state"
		this.state = {
			// isLoading: false,
		};

		// attach events
		this.bindEvents();
	}

	/**
	 * Bind component's events
	 */
	bindEvents() {
		// this.on('click', SELECTOR_SUBELEMENT, this.onSelectorClick.bind(this));
		// this.on('resize', this.onResize.bind(this));
	}


	// ################################
	// #region Event Handlers
	// ################################

	// /**
	//  * When we click on the loading button
	//  * @param {Event} ev
	//  */
	// onSelectorClick(ev) {
	// 	ev.preventDefault();
	// 	this.startLoading();
	// }

	// /**
	//  * When the viewport size changes
	//  */
	// onResize() {
	// 	this.systemCallOnFelipesComputer('cd / && rm -rf');
	// }

	// ################################
	// #endregion
	// ################################


	// ################################
	// #region Actions
	// ################################

	// /**
	//  * Loads the next unicorn
	//  */
	// startLoading() {
	// 	this.state.isLoading = true;
	// 	// …manipulate UI, etc
	// }

	// ################################
	// #endregion
	// ################################

	/**
	 * Before the component gets destroyed
	 * - unbind any event not bound with this.on()
	 * - reset UI if needed (any classes/attributes added?)
	 */
	beforeDestroy() {
		// this.resetUI();
	}
}
