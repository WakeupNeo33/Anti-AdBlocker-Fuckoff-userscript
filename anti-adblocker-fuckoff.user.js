// ==UserScript==
// @name            Anti-AdBlocker Fuckoff
// @name:es         Anti-AdBlocker Fuckoff
// @namespace       Anti-AdBlocker-Fuckoff
// @version         1.6.1
// @description     Protects & Remove Anti-AdBlockers modal windows from web sites
// @description:es  Protege y elimina las ventanas modales de Anti-AdBlockers de los sitios web
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
// @exclude         https://*binance.com/*
// @exclude         https://*binance.us/*
// @exclude         https://*bing.com/*
// @exclude         https://*bitfinex.com/*
// @exclude         https://*bitflyer.com/*
// @exclude         https://*bitstamp.net/*
// @exclude         https://*blockchain.com/*
// @exclude         https://*blockchair.com/*
// @exclude         https://*blockcypher.com/*
// @exclude         https://*bscscan.com/*
// @exclude         https://*buffer.com/*
// @exclude         https://*bufferapp.com/*
// @exclude         https://*calm.com/*
// @exclude         https://*chatango.com/*
// @exclude         https://*coinbase.com/*
// @exclude         https://*coinmarketcap.com/*
// @exclude         https://*doctor-groups.com/*
// @exclude         https://*duckduckgo.com/*
// @exclude         https://*ebay.com/*
// @exclude         https://*etherscan.io/*
// @exclude         https://*facebook.com/*
// @exclude         https://*firefaucet.win/*
// @exclude         https://*flattr.com/*
// @exclude         https://*flickr.com/*
// @exclude         https://*fsf.org/*
// @exclude         https://*ftx.com/*
// @exclude         https://*ftx.us/*
// @exclude         https://*gate.io/*
// @exclude         https://*geeksforgeeks.org/*
// @exclude         https://*gemini.com/*
// @exclude         https://*github.com/*
// @exclude         https://*gitlab.com/*
// @exclude         https://*google.*
// @exclude         https://*greasyfork.org/*
// @exclude         https://*huobi.com/*
// @exclude         https://*imdb.com/*
// @exclude         https://*imgbox.com/*
// @exclude         https://*imgur.com/*
// @exclude         https://*instagram.com/*
// @exclude         https://*jsbin.com/*
// @exclude         https://*jsfiddle.net/*
// @exclude         https://*kucoin.com/*
// @exclude         https://*kraken.com/*
// @exclude         https://*linkedin.com/*
// @exclude         https://*liquid.com/*
// @exclude         https://*live.com/*
// @exclude         https://*mail.ru/*
// @exclude         https://*minds.com/*
// @exclude         https://*microsoft.com/*
// @exclude         https://*msn.com/*
// @exclude         https://*netflix.com/*
// @exclude         https://*odysee.com/*
// @exclude         https://*openuserjs.org/*
// @exclude         https://*paypal.com/*
// @exclude         https://*pinterest.com/*
// @exclude         http*://*plnkr.co/*
// @exclude         http*://*poloniex.com/*
// @exclude         https://*primevideo.com/*
// @exclude         https://*protonmail.com/*
// @exclude         https://*qq.com/*
// @exclude         https://*reddit.com/*
// @exclude         https://*stackoverflow.com/*
// @exclude         https://*tampermonkey.net/*
// @exclude         https://*trello.com/*
// @exclude         https://*twitch.tv/*
// @exclude         https://*twitter.com/*
// @exclude         https://*userstyles.org/*
// @exclude         https://*viawallet.com/*
// @exclude         https://*vimeo.com/*
// @exclude         https://*whatsapp.com/*
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

    // Anti-AdBlocker Pattern to Search
    var adblock_pattern = /ad-block|adblock|ad block|bloqueur|bloqueador|Werbeblocker|&#1570;&#1583;&#1576;&#1604;&#1608;&#1603; &#1576;&#1604;&#1587;|блокировщиком/i;
    var disable_pattern = /kapat|disabl|désactiv|desactiv|desativ|deaktiv|detect|enabled|turned off|turn off|&#945;&#960;&#949;&#957;&#949;&#961;&#947;&#959;&#960;&#959;&#943;&#951;&#963;&#951;|&#1079;&#1072;&#1087;&#1088;&#1077;&#1097;&#1072;&#1090;&#1100;|állítsd le|publicités|рекламе|verhindert|advert|kapatınız/i;

    var tagNames_pattern = /div|section|iframe/i;

    var is_core_protected = false;

    var classes = [];

    // HELPER Functions
    //-----------------
    function debug( msg, val ) {
        if ( !enable_debug ) return;
        console.log( '%c ANTI-ADBLOCKER ','color: white; background-color: red', msg );
        if ( val === undefined ) return;
        if ( val.nodeType === Node.ELEMENT_NODE )
        {
            console.log ( 'TagName: ' + val.nodeName + ' | Id: ' + val.id + ' | Class: ' + val.classList );
            console.log ( val );
        } else {
            console.log ( val );
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
        let name = getRandomName();
        el.classList.add( name );
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

        var $_removeChild = unsafeWindow.Node.prototype.removeChild;
        unsafeWindow.Node.prototype.removeChild = function( node ) {
            if ( node.nodeName == 'HEAD' || node.parentNode.nodeName == 'HEAD'){
                return debug( 'An attempt to DELETE the element ' + node.nodeName + ' was blocked', node );
            }
            else if ( node.nodeName == 'BODY' ){
                if ( node.parentNode == document.body.firstElementChild ) {
                    return debug( 'An attempt to DELETE the element ' + node.nodeName + ' from ' + node.parentNode.nodeName + ' was blocked', node );
                }
                return debug( 'An attempt to DELETE the element ' + node.nodeName + ' was blocked', node );
            }
            $_removeChild.apply( this, arguments );
        };

        // Protect innerHTML

        var $_innerHTML = unsafeWindow.Node.prototype.innerHTML;
        unsafeWindow.Node.prototype.innerHTML = function( node ) {
            if ( node.nodeName == 'BODY' ) {
                return debug( 'An attempt to CHANGE the content of the element ' + node.nodeName + ' was blocked\n"' + node.textContent+'"' );
            }
            $_innerHTML.apply( this, arguments );
        };

        var $_innerHTML_set = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML').set;

        Object.defineProperty(Element.prototype, 'innerHTML', {
            set: function (value) {
                if ( this.nodeName == 'BODY' ){
                    return debug( 'An attempt to CHANGE the content of the element ' + this.nodeName + ' was blocked\n"' + this.textContent+'"\n"' + value + '"' );
                }
                //Call the original setter
                return $_innerHTML_set.call(this, value);
            }
        });

        debug( 'Core Protected');
    }

    function isElementBlur( el )
    {
        var style = window.getComputedStyle( el );
        var filter = style.getPropertyValue( 'filter' );
        return ( (/blur/i).test( filter ) );
    }

    function isElementFixed( el )
    {
        var style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'position' ) == 'fixed' );
    }

    function isOverflowHidden( el )
    {
        var style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'overflow' ) == 'hidden' );
    }
    function isNotHidden( el )
    {
        var style = window.getComputedStyle( el );
        return ( style.getPropertyValue( 'display' ) != 'none' );
    }

    function isBlackoutModal( el )
    {
        var style = window.getComputedStyle( el );
        var position = style.getPropertyValue( 'position' );
        var top = parseInt( style.getPropertyValue( 'top' ) );
        var left = parseInt( style.getPropertyValue( 'left' ) );
        var right = parseInt( style.getPropertyValue( 'right' ) );
        var bottom = parseInt( style.getPropertyValue( 'bottom' ) );
        var zindex = style.getPropertyValue( 'z-index' );
        if ( isNaN( zindex ) ) zindex = 0;
        return parseInt( zindex ) > 1 && position == 'fixed' && ( ( el.offsetHeight > window.innerHeight - 50 && el.offsetWidth > window.innerWidth - 20 ) || (top == 0 && left == 0 && right == 0 && bottom == 0) );
    }

    function isModalWindows( el )
    {
        return isElementFixed ( el ) && ( (adblock_pattern.test( el.textContent ) && disable_pattern.test( el.textContent )) || el.tagName == 'IFRAME' );
    }

    function unblockScroll()
    {
        if ( isOverflowHidden( document.body ) )
        {
            document.body.setAttribute('style', (document.body.getAttribute('style')||'').replace('overflow: visible !important;','') + 'overflow: visible !important;');
            document.body.classList.add( 'scroll_on' );
            debug( 'Scroll Unblocked from BODY tag');
        }
        if ( isOverflowHidden( document.htmllTag ) )
        {
            document.html.setAttribute('style', (document.html.getAttribute('style')||'').replace('overflow: visible !important;','') + 'overflow: visible !important;');
            document.html.classList.add( 'scroll_on' );
            debug( 'Scroll Unblocked from HTML tag ');
        }
    }

    // Main Functions
    function removeBackStuff()
    {
        document.querySelectorAll( 'div,section' ).forEach( ( el ) => {
            if ( isBlackoutModal( el ) )
            {
                debug( 'Blackout Modal Detected & Removed: ', el);
                el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');
                el.classList.add( 'hide_modal' );
            }
            else if ( isElementBlur( el ) )
            {
                debug( 'Blur Element Detected & Deblurred: ', el);
                el.classList.add( 'un_blur' );
            }
        });
        setTimeout( unblockScroll, 500);
    }

    function checkModals()
    {
        debug( 'Checking Modals' );
        var modalFound = false;
        // Only check common used html tag names
        document.querySelectorAll( 'div,section,iframe' ).forEach( ( el ) => {
            if ( isModalWindows( el ) && isNotHidden( el ) )
            {
                modalFound = true;
                removeModal( el );
            }
        });

        if ( modalFound )
        {
            setTimeout( removeBackStuff, 150);
        }
    }

    function removeModal( el, isNew )
    {
        // Skip the already processed elements
        if ( (new RegExp(classes.join('|'))).test( el.classList ) ) {
            //debug( 'Modal already added : ', el );
            return;
        }

        // Definde a random class name to hide the element
        // ( so that it is not so easy to detect the class name )
        var class_name = '';
        class_name = addRandomClass( el );
        classes.push( class_name );

        // Hide the element through a high priority incorporating the sentence in the style parameter
        el.setAttribute('style', (el.getAttribute('style')||'') + ';display: none !important;');

        // Also, add the random class name to the element
        // (in case there is a script that eliminates the previous statement)
        addStyle( '.' + class_name + '{ display: none !important; }' );

        debug( 'Modal Detected & Removed: ', el);

        if ( isNew )
        {
            setTimeout( removeBackStuff, 150);
        }
    }

    window.addEventListener('DOMContentLoaded', (event) => {

        classes.push( getRandomName() );

        document.html = document.getElementsByTagName('html')[0];

        // Mutation Observer
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

        // Create an observer instance
        var observer = new MutationObserver( (mutations) => {
            mutations.forEach( (mutation) => {
                if ( mutation.addedNodes.length ) {
                    Array.prototype.forEach.call( mutation.addedNodes, ( el ) => {
                        // skip unusual html tag names
                        if ( !tagNames_pattern.test ( el.tagName ) ) return;

                        // Check if element is an Anti-Adblock Modal Windows
                        if ( isModalWindows( el ) && isNotHidden( el ) )
                        {
                            debug( 'OnMutationObserver: ', el );
                            removeModal( el, true );
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

        // enable context menu again
        enableContextMenu();

        // First check with a little delay
        setTimeout( function() {
            checkModals();
        }, 50 );

        addStyle( 'body.scroll_on, html.scroll_on { overflow: visible !important; } .hide_modal { display: none !important; } .un_blur { -webkit-filter: blur(0px) !important; filter: blur(0px) !important; }' );

    });

    window.addEventListener('load', (event) => {
        // Second check, when page is complete loaded ( just in case )
        checkModals();
    });

    // Protect Core Functions
    protectCore();

})();
