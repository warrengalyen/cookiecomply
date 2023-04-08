import { el, setChildren, mount } from 'redom';


document.CookieConsent = document.CookieConsent || {};

document.CookieConsent.config = {
    cookieExists: false,
    language: 'en',
    categories: {
        necessary: {
            name: 'Strictly Necessary Cookies',
            needed: true,
            wanted: true,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu commodo est, nec gravida odio. Suspendisse scelerisque a ex nec semper.'
        },
        performance: {
            name: 'Performance Cookies',
            needed: false,
            wanted: false,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu commodo est, nec gravida odio. Suspendisse scelerisque a ex nec semper.'
        },
        social: {
            name: 'Social media',
            needed: false,
            wanted: false,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu commodo est, nec gravida odio. Suspendisse scelerisque a ex nec semper.'
        },
        targeting: {
            name: 'Targeting Cookies',
            needed: false,
            wanted: false,
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu commodo est, nec gravida odio. Suspendisse scelerisque a ex nec semper.'
        },
    },
    services: {
        facebook: {
            cookieName: 'fr',
            name: 'Facebook',
            category: 'social',
            type: 'script-tag',
            search: 'fbevents.js'
        },
        gtm: {
            cookieName: 'tw',
            name: 'Google Tag Manager',
            category: 'social',
            type: 'script-tag',
            search: 'gtm.js'
        },
        a2a: {
            cookieName: 'tw',
            name: 'Addtoany',
            category: 'social',
            type: 'script-tag',
            search: 'addtoany'
        },
        visualwebopt: {
            cookieName: 'tw',
            name: 'Visual website optimizer',
            category: 'social',
            type: 'script-tag',
            search: 'visualwebsiteoptimizer'
        },
        twitter: {
            cookieName: 'tw',
            name: 'Visual website optimizer',
            category: 'social',
            type: 'script-tag',
            search: 'twitter'
        },
        marketo: {
            cookieName: 'tw',
            name: 'Visual website optimizer',
            category: 'social',
            type: 'script-tag',
            search: 'marketo'
        },
        azalead: {
            cookieName: 'tw',
            name: 'Azalead',
            category: 'social',
            type: 'script-tag',
            search: 'azalead'
        },
        bizo: {
            cookieName: 'tw',
            name: 'Bizo',
            category: 'social',
            type: 'script-tag',
            search: 'bizographics'
        },
        linkedin: {
            cookieName: 'tw',
            name: 'Linkedin',
            category: 'social',
            type: 'script-tag',
            search: 'linkedin'
        }
    }
}

document.CookieConsent.buffer = {
    appendChild: [],
    insertBefore: []
}

    ; (function (Cookie) {

        // If consent cookie exists
        cookieToConfig();

        Element.prototype.appendChild = function (elem) {

            if (arguments[0].tagName === 'SCRIPT') {
                console.log('Appending:', arguments);
                for (let key in Cookie.config.services) {
                    // Did user opt-in?
                    if (Cookie.config.services[key].type === 'script-tag') {
                        if (arguments[0].outerHTML.includes(Cookie.config.services[key].search)) {
                            if (document.CookieConsent.config.categories[document.CookieConsent.config.services[key].category].wanted === false) {
                                Cookie.buffer.appendChild.push({ 'this': this, 'category': document.CookieConsent.config.services[key].category, arguments: arguments });
                                return undefined;
                            }
                        }
                    }
                }
            }

            return Node.prototype.appendChild.apply(this, arguments);
        }

        Element.prototype.insertBefore = function (elem) {

            if (arguments[0].tagName === 'SCRIPT') {
                console.log('Inserting:', arguments);
                for (let key in Cookie.config.services) {
                    // Did user opt-in?
                    if (Cookie.config.services[key].type === 'script-tag') {
                        if (arguments[0].outerHTML.includes(Cookie.config.services[key].search)) {
                            if (document.CookieConsent.config.categories[document.CookieConsent.config.services[key].category].wanted === false) {
                                Cookie.buffer.insertBefore.push({ 'this': this, 'category': document.CookieConsent.config.services[key].category, arguments: arguments });
                                return undefined;
                            }
                        }
                    }
                }
            }

            return Node.prototype.insertBefore.apply(this, arguments);
        }


        buildInterface(function (bar, modal) {

            // Show bar
            if (!document.CookieConsent.config.cookieExists) {
                setTimeout(() => {
                    bar.classList.remove('hidden');
                }, 3000);
            }

            refreshModal(modal);

            // If you click Accept all cookies
            document.getElementById('consent-give').addEventListener('click', function () {

                // We set config to full consent
                for (let key in Cookie.config.categories) {
                    Cookie.config.categories[key].wanted = true;
                }

                writeBufferToDOM();

                buildCookie((cookie) => {
                    setCookie(cookie);
                });

                bar.classList.add('hidden');

            });

            // If you click Cookie settings
            Array.prototype.forEach.call(document.getElementsByClassName('consent-edit'), (edit) => {
                edit.addEventListener('click', function () {
                    refreshModal(modal);
                    modal.classList.add('visible');
                });
            });

            // If you click trough the tabs on Cookie settings
            modal.querySelector('.left').addEventListener('click', function (event) {
                if (event.target.classList.contains('tab')) {
                    if (event.target.dataset.tab) {
                        let tabContents = modal.querySelectorAll('[class^=tab-content]');
                        let tabs = modal.querySelectorAll('.tab');

                        tabs.forEach((tab) => {
                            tab.classList.remove('active');
                        });

                        tabContents.forEach((tabContent) => {
                            tabContent.classList.remove('visible');
                        });

                        event.target.classList.add('active');
                        modal.querySelector(`[class=tab-content-${event.target.dataset.tab}]`).classList.add('visible');
                    }
                }
            });

            // If you switch on and off categories
            modal.querySelector('.right').addEventListener('click', function (event) {
                if (event.target.classList.contains('category-onoff')) {
                    let status = event.target.parentNode.previousSibling;
                    if (event.target.checked === false) {
                        status.textContent = 'OFF'
                    } else if (event.target.checked === true) {
                        status.textContent = 'ON'
                    }
                }
            });

            // If you click submit on cookie settings
            document.getElementById('cookie-modal-submit').addEventListener('click', function () {

                modal.querySelectorAll('.switch input').forEach(function (elem) {
                    Cookie.config.categories[elem.dataset.category].wanted = elem.checked;
                });

                buildCookie((cookie) => {
                    setCookie(cookie, () => {
                        modal.classList.remove('visible');
                        bar.classList.add('hidden');
                    });
                });

                writeBufferToDOM();

            });
        });
    })(document.CookieConsent);



function ready(fn) {
    if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function writeBufferToDOM() {

    document.CookieConsent.buffer.appendChild.forEach(function (action, index) {
        if (document.CookieConsent.config.categories[action.category].wanted === true) {
            Node.prototype.appendChild.apply(action.this, action.arguments);
        }
    });

    document.CookieConsent.buffer.insertBefore.forEach(function (action) {
        if (document.CookieConsent.config.categories[action.category].wanted === true) {
            Node.prototype.insertBefore.apply(action.this, action.arguments);
        }
    });
}

function buildCookie(callback) {
    let cookie = {};

    for (let key in document.CookieConsent.config.categories) {
        cookie[key] = document.CookieConsent.config.categories[key].wanted;
    }

    if (callback) callback(cookie);
    return cookie;
}

function setCookie(cookie, callback) {
    document.cookie = `cconsent=${JSON.stringify(cookie)}; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/;`;
    if (callback) callback();
}

function removeCookie(cookie) {
    document.cookie = `cconsent=; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/;`;
}

function cookieToConfig() {
    (document.cookie.split(';').filter((item) => {
        if (item.includes('cconsent')) {
            document.CookieConsent.config.cookieExists = true;
            var cookieData = JSON.parse(item.split('=')[1]);
            for (let key in cookieData) {
                document.CookieConsent.config.categories[key].wanted = cookieData[key];
            }
            return true;
        }
    }).length)

    return false;
}

function refreshModal(modal) {
    Array.prototype.forEach.call(modal.querySelectorAll('div[class^=tab-content]'), (tabContent) => {
        let category = tabContent.dataset.category;
        if (category) {
            if (tabContent.querySelector('.switch-group')) {
                tabContent.querySelector('.switch-group .status').textContent = (document.CookieConsent.config.categories[category].wanted === true) ? 'ON' : 'OFF';
                tabContent.querySelector('.switch-group .category-onoff').checked = (document.CookieConsent.config.categories[category].wanted === true) ? true : false;
            }
        }
    });
}

function buildInterface(callback) {

    ready(function () {
        var style = el('style',
            '#cookie-bar, #cookie-bar * {box-sizing:border-box}',
            '#cookie-bar {background-color:#63B3E3; color:#FFF; padding:20px 15px; text-align:right; font-family:sans-serif; font-size:14px; position:fixed; bottom:0; left:0; width:100%; z-index:998; transform: translateY(0); transition: transform .6s ease-in-out; transition-delay: .3s;}',
            '#cookie-bar.hidden {transform: translateY(100%)}',
            '#cookie-bar>div {display:inline-block}',
            '#cookie-bar a {text-decoration:underline; margin-right:20px}',
            '#cookie-bar button {border:none;padding:10px 10px;color:#63B3E3;background-color:#FFF;}',
            '#cookie-bar a:hover, #cookie-bar button:hover {cursor:pointer;}',
            '#cookie-modal {display:none; width: 100vw; height: 100vh; position:fixed; left:0; top:0; right:0; bottom:0; font-family:sans-serif; font-size:14px; background-color:rgba(0,0,0,0.3); z-index:999; align-items:center; justify-content:center;}',
            '#cookie-modal.visible {display:flex}',
            '#cookie-modal .content {max-width:600px; background-color:#FFF;}',
            '#cookie-modal .heading {text-align:center; border-bottom:1px solid #D8D8D8; padding:20px 0}',
            '#cookie-modal .heading h2 {margin:0}',
            '#cookie-modal h2, #cookie-modal h3 {margin-top:0}',
            '#cookie-modal .left, #cookie-modal .right {display:inline-block;vertical-align:top}',
            '#cookie-modal .left {width:30%}',
            '#cookie-modal .right {width:70%}',
            '#cookie-modal .tab {padding:10px; cursor:pointer; background-color:#EEE; border-bottom:1px solid #D8D8D8}',
            '#cookie-modal .tab:last-child {border-bottom:none}',
            '#cookie-modal .tab.active {background-color:#FFF;}',
            '#cookie-modal [class^=tab-content] {display:none; padding:10px 20px}',
            '#cookie-modal [class^=tab-content].visible {display:block}',
            '#cookie-modal [class^=tab-content] .head {position: relative}',
            '#cookie-modal [class^=tab-content] .status {position: absolute; top: 2px; right: 50px;}',
            '#cookie-modal [class^=tab-content] .switch {position: absolute; top:0; right:0; display: inline-block; width: 40px; height: 20px;}',
            '#cookie-modal [class^=tab-content] .switch input {display:none;}',
            '#cookie-modal [class^=tab-content] .switch .slider  {position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s;}',
            '#cookie-modal [class^=tab-content] .switch .slider:before  {position: absolute; content: ""; height: 12px; width: 12px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s;}',
            '#cookie-modal [class^=tab-content] .switch input:checked + .slider  {background-color: #2196F3;}',
            '#cookie-modal [class^=tab-content] .switch input:focus + .slider  {box-shadow: 0 0 1px #2196F3;}',
            '#cookie-modal [class^=tab-content] .switch input:checked + .slider:before  {-webkit-transform: translateX(20px); -ms-transform: translateX(20px); transform: translateX(20px);}',
            '#cookie-modal .footer {border-top:1px solid #D8D8D8; padding:10px; text-align:right;}',
            '#cookie-modal .footer button {border:none; background-color:#63B3E3; color:#FFF; padding:10px; cursor:pointer}',
        );

        var bar =
            el('div#cookie-bar.hidden',
                [el('div.link', el('a#consent-edit.consent-edit', 'Cookie settings')),
                el('div.button', el('button#consent-give', 'Accept all cookies'))]);


        // Modal tab list middleware
        var modalTabList = function (elem) {
            let listItems = [];

            listItems.push(el('div.tab.active', 'Your Privacy', { 'data-tab': 'first' }));
            for (let key in document.CookieConsent.config.categories) {
                listItems.push(el('div.tab', document.CookieConsent.config.categories[key].name, { 'data-tab': key }));
            }
            listItems.push(el('div.tab', 'More Information', { 'data-tab': 'last' }));

            setChildren(elem, listItems);
        }

        // Modal tab content middleware
        var modalTabContentList = function (elem) {
            let contentItems = [];

            contentItems.push(el('div.tab-content-first.visible', [el('h3', 'Your Privacy'), el('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu commodo est, nec gravida odio. Suspendisse scelerisque a ex nec semper. Nam eros sem, varius et vehicula sagittis, vulputate sed augue. Quisque id sem bibendum, convallis odio ac, egestas tellus. Duis rhoncus rutrum metus et maximus.')]));
            for (let key in document.CookieConsent.config.categories) {
                contentItems.push(el('div.tab-content-' + key, { 'data-category': key },
                    el('div.head',
                        el('h3', document.CookieConsent.config.categories[key].name),
                        (!document.CookieConsent.config.categories[key].needed) && el('div.switch-group',
                            el('span.status'),
                            el('label.switch',
                                el('input.category-onoff', { type: 'checkbox', 'data-category': key }), el('span.slider'))),
                    ),
                    el('div.body',
                        [el('p', document.CookieConsent.config.categories[key].text)])));
            }
            contentItems.push(el('div.tab-content-last', [el('h3', 'More Information'), el('p', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu commodo est, nec gravida odio. Suspendisse scelerisque a ex nec semper. Nam eros sem, varius et vehicula sagittis, vulputate sed augue. Quisque id sem bibendum, convallis odio ac, egestas tellus. Duis rhoncus rutrum metus et maximus.')]));

            setChildren(elem, contentItems);
        }

        var modal =
            el('div#cookie-modal',
                el('div.content',
                    el('div.heading',
                        el('h2', 'Cookie settings')),
                    el('div.left', modalTabList),
                    el('div.right', modalTabContentList),
                    el('div.footer',
                        el('button#cookie-modal-submit', 'Submit',))));

        mount(document.body, bar);
        mount(document.body, modal);
        mount(document.body, style);

        callback(bar, modal);
    });

}


