(function(){
    // Back to Top - by CodyHouse.co
    let backTop = document.getElementsByClassName('js-cd-top')[0],
        offset = 300, // browser window scroll (in pixels) after which the "back to top" link is shown
        offsetOpacity = 1200, //browser window scroll (in pixels) after which the "back to top" link opacity is reduced
        scrollDuration = 700,
        scrolling = false;

    if( backTop ) {
        //update back to top visibility on scrolling
        window.addEventListener("scroll", function(event) {
            if( !scrolling ) {
                scrolling = true;
                (!window.requestAnimationFrame) ? setTimeout(checkBackToTop, 250) : window.requestAnimationFrame(checkBackToTop);
            }
        });

        //smooth scroll to top
        backTop.addEventListener('click', function(event) {
            event.preventDefault();
            (!window.requestAnimationFrame) ? window.scrollTo(0, 0) : Util.scrollTo(0, scrollDuration);
        });
    }

    function checkBackToTop() {
        let windowTop = window.scrollY || document.documentElement.scrollTop;
        ( windowTop > offset ) ? Util.addClass(backTop, 'cd-top--is-visible') : Util.removeClass(backTop, 'cd-top--is-visible cd-top--fade-out');
        ( windowTop > offsetOpacity ) && Util.addClass(backTop, 'cd-top--fade-out');
        scrolling = false;
    }
})();
function Util () {}

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
    if (el.classList) return el.classList.contains(className);
    else return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
    let classList = className.split(' ');
    if (el.classList) el.classList.add(classList[0]);
    else if (!Util.hasClass(el, classList[0])) el.className += " " + classList[0];
    if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
    let classList = className.split(' ');
    if (el.classList) el.classList.remove(classList[0]);
    else if(Util.hasClass(el, classList[0])) {
        let reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
        el.className=el.className.replace(reg, ' ');
    }
    if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
    if(bool) Util.addClass(el, className);
    else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
    for(let key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
    let children = el.children,
        childrenByClass = [];
    for (let i = 0; i < el.children.length; i++) {
        if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
    }
    return childrenByClass;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
    let change = to - start,
        currentTime = null;

    let animateHeight = function(timestamp){
        if (!currentTime) currentTime = timestamp;
        let progress = timestamp - currentTime;
        let val = parseInt((progress/duration)*change + start);
        element.setAttribute("style", "height:"+val+"px;");
        if(progress < duration) {
            window.requestAnimationFrame(animateHeight);
        } else {
            cb();
        }
    };

    //set the height of the element before starting animation -> fix bug on Safari
    element.setAttribute("style", "height:"+start+"px;");
    window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb) {
    let start = window.scrollY || document.documentElement.scrollTop,
        currentTime = null;

    let animateScroll = function(timestamp){
        if (!currentTime) currentTime = timestamp;
        let progress = timestamp - currentTime;
        if(progress > duration) progress = duration;
        let val = Math.easeInOutQuad(progress, start, final-start, duration);
        window.scrollTo(0, val);
        if(progress < duration) {
            window.requestAnimationFrame(animateScroll);
        } else {
            cb && cb();
        }
    };

    window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
    if( !element ) element = document.getElementsByTagName("body")[0];
    element.focus();
    if (document.activeElement !== element) {
        element.setAttribute('tabindex','-1');
        element.focus();
    }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
    return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
    if('CSS' in window) {
        return CSS.supports(property, value);
    } else {
        let jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
        return jsProperty in document.body.style;
    }
};

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        if (!document.documentElement.contains(el)) return null;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        let evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
};