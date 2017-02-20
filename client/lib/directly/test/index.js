/**
 * External dependencies
 */
import { expect } from 'chai';
import sinon from 'sinon';

 /**
 * Internal dependencies
 */
import useFakeDom from 'test/helpers/use-fake-dom';
// import * as loadScript from 'lib/load-script';

let directly;
let loadScript;

describe( 'index', () => {
	// Need to use `require` to correctly spy on loadScript
	loadScript = require( 'lib/load-script' );
	sinon.spy( loadScript, 'loadScript' );

	useFakeDom();

	beforeEach( () => {
		directly = require( '..' );
	} );

	afterEach( () => {
		loadScript.loadScript.reset();

		// After each test, clean up the globals put in place by Directly
		const script = document.querySelector( '#directlyRTMScript' );
		if ( script ) {
			script.remove();
		}
		delete window.DirectlyRTM;
		delete require.cache[ require.resolve( '..' ) ];
	} );

	describe( '#initialize()', () => {
		it( 'creates a window.DirectlyRTM function', () => {
			directly.initialize();
			expect( typeof window.DirectlyRTM ).to.equal( 'function' );
		} );

		it( 'uses the given config data for Directly', () => {
			const config = { a: '1', b: '2', c: '3' };
			directly.initialize( config );

			expect( window.DirectlyRTM.cq ).to.have.lengthOf( 1 );
			expect( window.DirectlyRTM.cq[ 0 ][ 0 ] ).to.equal( 'config' );
			expect( window.DirectlyRTM.cq[ 0 ][ 1 ] ).to.contain.all.keys( config );
		} );

		it( 'attempts to load the remote script', () => {
			directly.initialize();
			expect( loadScript.loadScript ).to.have.been.calledOnce;
		} );

		it( 'does nothing after the first call', () => {
			const config1 = { id: '1', a: 'e', b: 'e', c: 'e' };
			const config2 = { id: '2', m: '4', n: '5', o: '6' };
			const config3 = { id: '3', x: '7', y: '8', z: '9' };

			directly.initialize( config1 ).then( () => {} );
			directly.initialize( config2 ).then( () => {} );
			directly.initialize( config3 ).then( () => {} );

			expect( window.DirectlyRTM.cq ).to.have.lengthOf( 1 );
			expect( window.DirectlyRTM.cq[ 0 ][ 0 ] ).to.equal( 'config' );
			Object.keys( config1 ).forEach( ( key ) => {
				expect( window.DirectlyRTM.cq[ 0 ][ 1 ][ key ] ).to.equal( config1[ key ] );
			} );
			expect( loadScript.loadScript ).to.have.been.calledOnce;
		} );

		it( 'resolves the returned promise if the library load succeeds', ( done ) => {
			directly.initialize().then( () => done() );
			loadScript.loadScript.firstCall.args[ 1 ]();
		} );

		it( 'rejects the returned promise if the library load fails', ( done ) => {
			const error = { oh: 'no' };
			directly.initialize().then(
				() => {},
				( e ) => {
					expect( e ).to.equal( error );
					done();
				}
			);
			loadScript.loadScript.firstCall.args[ 1 ]( error );
		} );
	} );

	describe( '#askQuestion()', () => {
		const questionText = 'How can I give you all my money?';
		const name = 'Richie Rich';
		const email = 'richie@richenterprises.biz';

		it( 'does nothing if Directly hasn\'t been initialized', () => {
			directly.askQuestion( questionText, name, email );
			expect( window.DirectlyRTM ).to.be.undefined;
		} );

		it( 'invokes the Directly API with the given paramaters', ( done ) => {
			window.DirectlyRTM = sinon.spy();
			const initializationPromise = directly.initialize();
			directly.askQuestion( questionText, name, email );

			// Enqueue the checks at the tail of the promise chain
			initializationPromise.then( () => {
				expect( window.DirectlyRTM ).to.have.been.calledWith( 'askQuestion', { questionText, name, email } );
				done();
			} );

			loadScript.loadScript.firstCall.args[ 1 ]();
		} );
	} );
} );
