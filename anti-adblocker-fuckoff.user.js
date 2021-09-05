// ==UserScript==
// @name            Anti-AdBlocker Fuckoff
// @namespace       Anti-AdBlocker-Fuckoff
// @version         1.5.2
// @description     Protects from Anti-AdBlockers & DeBlocker
// @author          Elwyn
// @license         MIT
// @homepage        https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript
// @supportURL      https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/issues
// @downloadURL     https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/anti-adblocker-fuckoff.user.js
// @updateURL       https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/anti-adblocker-fuckoff.user.js
// @iconURL         https://github.com/WakeupNeo33/Anti-AdBlocker-Fuckoff-userscript/raw/main/icon.png
// @include         *
// @exclude         https://*aliexpress.com/*
// @exclude         https://*amazon.*/*
// @exclude         https://*anaconda.org/*
// @exclude         https://*apple.com/*
// @exclude         https://*ask.com/*
// @exclude         https://*baidu.com/*
// @exclude         https://*bing.com/*
// @exclude         https://*buffer.com/*
// @exclude         https://*bufferapp.com/*
// @exclude         https://*calm.com/*
// @exclude         https://*chatango.com/*
// @exclude         https://*duckduckgo.com/*
// @exclude         https://*ebay.com/*
// @exclude         https://*facebook.com/*
// @exclude         https://*flattr.com/*
// @exclude         https://*flickr.com/*
// @exclude         https://*fsf.org/*
// @exclude         https://*geeksforgeeks.org/*
// @exclude         https://*ghacks.net/*
// @exclude         https://*github.com/*
// @exclude         https://*gitlab.com/*
// @exclude         https://*google.*
// @exclude         https://*greasyfork.org/*
// @exclude         https://*imdb.com/*
// @exclude         https://*imgbox.com/*
// @exclude         https://*imgur.com/*
// @exclude         https://*instagram.com/*
// @exclude         https://*jsbin.com/*
// @exclude         https://*jsfiddle.net/*
// @exclude         https://*linkedin.com/*
// @exclude         https://*live.com/*
// @exclude         https://*mail.ru/*
// @exclude         https://*minds.com/*
// @exclude         https://*microsoft.com/*
// @exclude         https://*msn.com/*
// @exclude         https://*odysee.com/*
// @exclude         https://*openuserjs.org/*
// @exclude         https://*paypal.com/*
// @exclude         https://*pinterest.com/*
// @exclude         http*://*plnkr.co/*
// @exclude         https://*qq.com/*
// @exclude         https://*reddit.com/*
// @exclude         https://*stackoverflow.com/*
// @exclude         https://*tampermonkey.net/*
// @exclude         https://*trello.com/*
// @exclude         https://*twitch.tv/*
// @exclude         https://*twitter.com/*
// @exclude         https://*vimeo.com/*
// @exclude         https://*wikipedia.org/*
// @exclude         https://*w3schools.com/*
// @exclude         https://*yahoo.*
// @exclude         https://*yandex.ru/*
// @exclude         https://*youtube.com/*
// @exclude         https://*vod.pl/*
// @noframes
// @run-at          document-start
// @grant           unsafeWindow
// ==/UserScript==
(function() {

	var enable_debug = false;

    // Skip iframes
    //if ( window.location !== window.parent.location ) return;

    // AdBlock Pattern to Search
    var adblock_pattern = /ad-block|adblock|ad block|bloqueur|bloqueador|Werbeblocker|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
    var disable_pattern = /kapat|disabl|désactiv|desactiv|desativ|deaktiv|detect|enabled|turned off|turn off|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;

    var tagNames_pattern = /div|span|section|p/i;

    var is_core_protected = false;

    var classes = [];


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
        var style = document.createElement('style');
        style.innerHTML = str;
        document.body.appendChild( style );
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

    function addRandomClass( el ) {
        var name = getRandomName();
        if ( el.className.length == 0 ) {
            el.className = name;
        } else {
            el.className += ' ' + name;
        }
        return name;
    }

    /* Thanks to RuiGuilherme  */
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
            if ( node.tagName == 'HEAD' || node.parentNode.tagName == 'HEAD' || node.tagName == 'BODY' ) return;
            if ( node.parentNode == document.body.firstElementChild ) return;
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

        debug( 'Core Protected');
    }

    function isElementBlur( el )
    {
        let style = window.getComputedStyle( el );
        let filter = style.getPropertyValue( 'filter' );
        return ( (/blur/i).test( filter ) );
    }

    function isElementFixed( el )
    {
        let style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'position' ) == 'fixed' );
    }

    function isBlackoutModal( el )
    {
        let style = window.getComputedStyle( el );
        let position = style.getPropertyValue( 'position' );
        let top = parseInt( style.getPropertyValue( 'top' ) );
        let left = parseInt( style.getPropertyValue( 'left' ) );
        let right = parseInt( style.getPropertyValue( 'right' ) );
        let bottom = parseInt( style.getPropertyValue( 'bottom' ) );
        let zindex = style.getPropertyValue( 'z-index' );
        if ( isNaN( zindex ) ) zindex = 0;
        return parseInt( zindex ) > 1 && position == 'fixed' && ( ( el.offsetHeight > window.innerHeight - 50 && el.offsetWidth > window.innerWidth - 20 ) || (top == 0 && left == 0 && right == 0 && bottom == 0) );
    }

    // Main Functions
    function removeBlackout( el )
    {

        document.querySelectorAll( 'div,span,section,p' ).forEach( ( el ) => {
            if ( isBlackoutModal( el ) )
            {
                debug( 'Blackout Removed! ' + el.className );
                removeModal( el );
            }
            if ( isElementBlur( el ) )
            {
                var className = addRandomClass( el );
                classes.push( className );
                addStyle( '.' + className + '{ -webkit-filter: blur(0px) !important; filter: blur(0px) !important; }' );
            }
        });
    }

    function removeCurrentModal()
    {
        document.querySelectorAll( 'div,span,section,p' ).forEach( ( el ) => {
           if ( el.innerText.length < 1 ) return;
           if ( adblock_pattern.test( el.innerText ) && disable_pattern.test( el.innerText ) )
           {
               removeModal( el );
               debug( 'CurrentModal: ' + el.innerText );
               return true;
           }
        });
    }

    function removeModal( el )
    {
        var className = '';
        var modalFound = false;

        // Find the main Holder of the Modal message
        for (;;) {
            if ( isElementFixed ( el ) )
            {
                modalFound = true;
                break;
            }
            el = el.parentNode;
        }

        if ( modalFound )
        {
            if ( (new RegExp(classes.join('|'))).test( el.className ) ) {
                debug( 'Modal Included: ' + el.className );
                return;
            }

            debug( 'AntiAdBlocker Found!');

            className = addRandomClass( el );
            classes.push( className );

            // Hide Anti-AdBlocker Modal Elements
            addStyle( '.' + className + '{ display: none !important; }' );

            debug( 'Modal Removed!: ' + el.className );

            removeBlackout();
        }
    }

    classes.push( getRandomName() );

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
                        if ( !tagNames_pattern.test ( addedNode.tagName ) ) return;
                        // skip nodes without text
                        if ( addedNode.innerText.length < 1 ) return;
                        // search texts that ask to deactivate the AdBlock
                        if ( adblock_pattern.test( addedNode.innerText ) && disable_pattern.test( addedNode.innerText ) )
                        {
                            debug( 'addedNode: ' + addedNode.innerText );
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

        removeCurrentModal();

        protectCore();

        // Remove Scroll Lock
        addStyle( 'body { overflow: overlay !important; }' );

        // enable context menu again
        enableContextMenu();

    },false);


})();
