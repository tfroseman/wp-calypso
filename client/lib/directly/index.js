/**
 * External dependencies
 */
import config from 'config';

/**
 * Internal dependencies
 */
import { loadScript } from 'lib/load-script';

const DEFAULT_RTM_WIDGET_OPTIONS = {
	id: config( 'directly_rtm_widget_id' ),
	displayAskQuestion: false
};
const DIRECTLY_RTM_SCRIPT_URL = 'http://widgets.wp.com/directly/embed.js';
const DIRECTLY_ASSETS_BASE_URL = 'https://www.directly.com';
let initializationPromise;

function executeDirectlyCommand( ...args ) {
	// Havoc is wreaked if you try to execute Directly commands before initialization.
	// If initialization hasn't started, ignore the command.
	if ( typeof initializationPromise === 'undefined' ) {
		return;
	}
	// If initialization has started, add the command to the promise chain to execute
	// as soon as initialization has finished.
	return initializationPromise.then( () => {
		window.DirectlyRTM( ...args );
	} );
}

export function initialize( directlyConfig = {} ) {
	if ( typeof initializationPromise !== 'undefined' ) {
		return initializationPromise;
	}
	// Set up the global DirectlyRTM function, required for the Directly library
	window.DirectlyRTM = window.DirectlyRTM || function() {
		( window.DirectlyRTM.cq = window.DirectlyRTM.cq || [] ).push( arguments );
	};
	// Before loading the script, we need to enqueue the config details
	window.DirectlyRTM( 'config', { ...DEFAULT_RTM_WIDGET_OPTIONS, ...directlyConfig } );

	// Directly gathers the base URL for its assets by inspecting the src attribute
	// of a DOM element with id="directlyRTMScript". Since we're not using the standard
	// integration, we need to fake it by adding a dummy DOM object with those attributes.
	const d = document.createElement( 'div' );
	d.id = 'directlyRTMScript';
	d.src = DIRECTLY_ASSETS_BASE_URL;
	document.body.appendChild( d );

	initializationPromise = new Promise( ( resolve, reject ) => {
		loadScript( DIRECTLY_RTM_SCRIPT_URL, function( error ) {
			if ( error ) {
				reject( error );
			} else {
				resolve();
			}
		} );
	} );

	return initializationPromise;
}

export function askQuestion( questionText, name, email ) {
	executeDirectlyCommand( 'askQuestion', { questionText, name, email } );
}
