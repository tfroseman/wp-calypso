/**
 * External dependencies
 */
import React, { PropTypes, Component } from 'react';

/**
 * Internal dependencies
 */
import EditorDrawer from 'post-editor/editor-drawer';
import EditorSidebarHeader from './header';
import SidebarFooter from 'layout/sidebar/footer';
import EditorActionBar from 'post-editor/editor-action-bar';

export default class EditorSidebar extends Component {
	static propTypes = {
		savedPost: PropTypes.object,
		post: PropTypes.object,
		isNew: PropTypes.bool,
		onPublish: PropTypes.func,
		onTrashingPost: PropTypes.func,
		site: PropTypes.object,
		type: PropTypes.string,
		toggleSidebar: PropTypes.func,
	}

	render() {
		const { toggleSidebar, isNew, onTrashingPost, onPublish, post, savedPost, site, type } = this.props;
		return (
			<div className="post-editor__sidebar">
				<EditorSidebarHeader toggleSidebar={ toggleSidebar } />
				<EditorActionBar
					isNew={ isNew }
					onTrashingPost={ onTrashingPost }
					onPrivatePublish={ onPublish }
					post={ post }
					savedPost={ savedPost }
					site={ site }
					type={ type }
				/>
				<EditorDrawer
					site={ site }
					savedPost={ savedPost }
					post={ post }
					isNew={ isNew }
					type={ type }
				/>
				<SidebarFooter />
			</div>
		);
	}

}
