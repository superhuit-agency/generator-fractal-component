import BaseView from 'base-view';

export default class <%= name %> extends BaseView {
	bind() {
		console.info(`JS for '<%= name %>' component successfully loaded.`);
	}

	destroy() {
	}
}
