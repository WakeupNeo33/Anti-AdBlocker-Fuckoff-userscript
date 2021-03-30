// ==UserScript==
// @name            Anti-AdBlocker Fuckoff
// @namespace       Anti-AdBlocker-Fuckoff
// @version         1.3
// @description     Remove Anti-AdBlock & DeBlocker
// @author          Elwyn
// @license         MIT
// @homepage        https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript
// @supportURL      https://greasyfork.org/es/scripts/397070-anti-adblocker-off/feedback
// @downloadURL     https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/anti-adblocker-fuckoff.user.js
// @updateURL       https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/anti-adblocker-fuckoff.user.js
// @iconURL         https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/icon.png
// @include         *
// @noframes
// @run-at          document-start
// @grant           unsafeWindow
// ==/UserScript==
(function() {
	
	var enable_debug = false;

    // Skip iframes
    if ( window.location !== window.parent.location ) return;

    // Exclude domains
    var excluded_Domains = [
	'360.cn',
	'adblockplus.org',
	'agar.io',
	'aliexpress.com',
	'amazon.',
	'apple.com',
	'ask.com',
	'baidu.com',
	'bing.com',
	'bufferapp.com',
	'calm.com',
	'chatango.com',
	'chromeactions.com',
	'dolldivine.com',
	'duckduckgo.com',
	'easyinplay.net',
	'ebay.com',
	'exacttarget.com',
	'facebook.com',
	'flattr.com',
	'flickr.com',
	'fsf.org',
	'greasyfork.org',
	'ghacks.net',
	'google.',
	'imdb.com',
	'imgbox.com',
	'imgur.com',
	'instagram.com',
	'jsbin.com',
	'jsfiddle.net',
	'linkedin.com',
	'live.com',
	'mail.ru',
	'minds.com',
	'microsoft.com',
	'msn.com',
	'openuserjs.org',
	'pandoon.info',
	'paypal.com',
	'pinterest.com',
	'plnkr.co',
	'popmech.ru',
	'preloaders.net',
	'qq.com',
	'reddit.com',
	'stackoverflow.com',
	'tampermonkey.net',
	'twitter.com',
	'vimeo.com',
	'wikipedia.org',
	'w3schools.com',
	'xemvtv.net',
	'yahoo.',
	'yandex.ru',
	'youtu.be',
	'youtube.com',
	'vod.pl'
	];
    if ( new RegExp( excluded_Domains.join('|').replace(/\./g,'\.') ).test( location.host ) ) return;
	
    // AdBlock Pattern to Search
    var adblock_pattern = /ad-block|adblock|ad block|bloqueur|bloqueador|Werbeblocker|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
    var disable_pattern = /kapat|disabl|désactiv|desactiv|desativ|deaktiv|detect|enabled|turned off|turn off|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;

    var is_core_protected = false;
    var protect_body = false;

    // HELPER Functions
    //-----------------
    function debug( value ) {
        if ( !enable_debug ) return;
        if ( typeof value == 'string' ) {
            console.log( "ANTI-ADBLOCKER: " + value );
        } else {
            console.log( "ANTI-ADBLOCKER: -> ");
            console.log( value );
        }
    }

    function addStyle(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }

    function randomInt( min, max )
    {
        // min and max included
        if ( max === undefined ) {
            max = min;
            min = 0;
        }
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    function getRandomName( size )
    {
        var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var i;
        var name = '';
        for (i = 0; i < (size||randomInt(10,20)); i++)
        {
            name += chars.charAt( randomInt(0,chars.length) );
        }
        return name;
    }

    function includeElement( el ) {
        var name = getRandomName();
        if ( el.className.length == 0 ) {
            el.className = name;
        } else {
            el.className += ' ' + name;
        }
        return '.' + name + ',';
    }

    const enableContextMenu = () => {
        window.addEventListener('contextmenu', (event) => {
            event.stopPropagation();
            event.stopImmediatePropagation();
        }, true);
    }

    function protectCore() {
        if ( is_core_protected ) return;
        is_core_protected = true;
        // Protect RemoveChild
        // Blocks the possibility of being able to remove the BODY or the HEAD
        let $_removeChild = unsafeWindow.Node.prototype.removeChild;
        unsafeWindow.Node.prototype.removeChild = function( node ) {
            if ( node.tagName == 'HEAD' || node.tagName == 'BODY' ) return;
            if ( protect_body && node.parentNode.tagName == 'BODY' ) return;
            $_removeChild.apply( this, arguments );
        };
        let $_innerHTML = unsafeWindow.Node.prototype.innerHTML;
        unsafeWindow.Node.prototype.innerHTML = function( node ) {
            if ( node.tagName == 'HEAD' || node.tagName == 'BODY' ) return;
            $_innerHTML.apply( this, arguments );
        };

        // Protect innerHTML
        let $_innerHTML_set = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;

        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function (value) {
                if ( this.tagName == 'HEAD' || this.tagName == 'BODY' ) return;
                //Call the original setter
                return $_innerHTML_set.call(this, value);
            }
        });
    }

    // Main Functions
    function removeBlackout( el )
    {
        var classes = '';
        document.querySelectorAll( 'a,b,center,div,h1,h2,h3,h4,h5,h6,i,font,s,span,strong,p,q,u' ).forEach( ( el ) => {
            let style = window.getComputedStyle( el );
            let height, width;
            if ( style.getPropertyValue( 'position' ) == 'fixed' )
            {
                height = style.getPropertyValue( 'height' );
                width = style.getPropertyValue( 'width' );
                if ( ( height == '100%' && width == '100%' ) || ( parseInt( height ) > window.innerHeight - 100 && parseInt( width ) > window.innerWidth - 100 ) )
                {
                    classes += includeElement( el );
                }
            }
        });

        if ( classes.length > 0 ) {

            classes = classes.substring( 0, classes.length - 1 );

            debug( 'Blackout classes:' + classes );

            // Hide Anti-AdBlocker Blackout Elements
            addStyle( classes + '{ display: none !important; }' );

            // Remove Blur FX of Elements
            addStyle( '* { -webkit-filter: blur(0px) !important; filter: blur(0px) !important; }' );

            // enable context menu again
            enableContextMenu();
        }
    }

    function removeModal( el )
    {
        debug( 'AntiAdBlocker Found!');

        var classes = '';

        // Holder of the Modal message
        for (;;) {
            classes += includeElement( el );
            if ( el.parentNode.tagName == 'BODY' || el.parentNode.tagName == 'HEAD' ) break;
            el = el.parentNode;
        }

        if ( classes.length > 0 ) {

            classes = classes.substring( 0, classes.length - 1 );

            debug( 'Modal classes:' + classes );

            // Hide Anti-AdBlocker Modal Elements
            addStyle( classes + '{ display: none !important; }' );

            // Blackout Elements
            removeBlackout();

            // Blocks the possibility of being able to remove the BODY or the HEAD
            protectCore();
        }

    }



    document.addEventListener('DOMContentLoaded', function() {

        // Mutation Observer
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        // Create an observer instance
        var observer = new MutationObserver( (mutations) => {
            mutations.forEach( (mutation) => {
                if ( mutation.addedNodes.length ) {
                    Array.prototype.forEach.call( mutation.addedNodes, (addedNode) => {
                        // skip nodes with undefined text
                        if ( typeof addedNode.innerText == 'undefined' ) return;
                        // skip nodes without text
                        if ( addedNode.innerText.length < 1 ) return;
                        // search texts that ask to deactivate the AdBlock
                        // debug( addedNode.innerText );
                        if ( adblock_pattern.test( addedNode.innerText ) && disable_pattern.test( addedNode.innerText ) )
                        {
                            removeModal( addedNode );
                        }
                    });
                }
            });
        });
        // Observer
        observer.observe(document, {
            childList : true,
            subtree : true
        });

        let body_style = window.getComputedStyle( document.body );
        document.body.style.visibility = 'hidden';
        if ( body_style.getPropertyValue( 'visibility' ) == 'visible' )
        {
            protect_body = true;
            protectCore();
        }
        document.body.style.visibility = 'visible';

    },false);


})();