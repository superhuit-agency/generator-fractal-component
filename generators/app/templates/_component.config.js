/* eslint-disable */
/**
 * For more information, see
 * http://fractal.build/guide/components/configuration
 */

module.exports = {
	status: 'wip',
	label: '<%= label %>',
	display: {
		padding: '30px',
	},
	context: {
		modifiers: [],
		html_attrs: [],
	},<% if (modifiers) { %>
	variants: [<% modifiers.forEach(function(modifier, index, array){ %><%= index === 0 ? '\n		{' : '	{' %>
			name: '<%= modifier %>',
			context: {
				modifiers: ['<%= className %>--<%= modifier %>'],
				html_attrs: [],
			},
		},
	<%}); %>],<% } %>
};
