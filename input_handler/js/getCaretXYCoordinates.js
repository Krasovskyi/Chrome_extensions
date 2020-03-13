/* Main Function
    ----------------------------------------------- */
function getCaretXYCoordinates(element, caretPosition) {
    let coordinates = getCaretCoordinates(element, caretPosition);
    let elementCoordinates = getElementCoords(element);
    let topPosition = coordinates.top + elementCoordinates.top;
    let leftPosition = coordinates.left + elementCoordinates.left;

    return {leftPosition, topPosition}
}

/* Get Caret XY Coordinate
----------------------------------------------- */
/* jshint browser: true */
(function () {

    // The properties that we copy into a mirrored div.
    let properties = [
        'direction',
        'boxSizing',
        'width',
        'height',
        'overflowX',
        'overflowY',
        'borderTopWidth',
        'borderRightWidth',
        'borderBottomWidth',
        'borderLeftWidth',
        'borderStyle',

        'paddingTop',
        'paddingRight',
        'paddingBottom',
        'paddingLeft',


        'fontStyle',
        'fontletiant',
        'fontWeight',
        'fontStretch',
        'fontSize',
        'fontSizeAdjust',
        'lineHeight',
        'fontFamily',

        'textAlign',
        'textTransform',
        'textIndent',
        'textDecoration',

        'letterSpacing',
        'wordSpacing',

        'tabSize'

    ];


    function getCaretCoordinates(element, position, options) {

        let debug = options && options.debug || false;
        if (debug) {
            let el = document.querySelector('#input-textarea-caret-position-mirror-div');
            if (el) {
                el.parentNode.removeChild(el);
            }
        }

        // mirrored div
        let div = document.createElement('div');
        div.id = 'input-textarea-caret-position-mirror-div';
        document.body.appendChild(div);

        let style = div.style;
        let computed = getComputedStyle(element)

        // default textarea styles
        style.whiteSpace = 'pre-wrap';
        if (element.nodeName !== 'INPUT')
            style.wordWrap = 'break-word';  // only for textarea-s

        // position off-screen
        style.position = 'absolute';  // required to return coordinates properly
        if (!debug)
            style.visibility = 'hidden';  // not 'display: none' because we want rendering

        // transfer the element's properties to the div
        properties.forEach(prop => {
            style[prop] = computed[prop];
        });

        style.overflow = 'hidden';

        div.textContent = element.value.substring(0, position);
        if (element.nodeName === 'INPUT')
            div.textContent = div.textContent.replace(/\s/g, '\u00a0');

        let span = document.createElement('span');
        // Wrapping must be replicated *exactly*, including when a long word gets
        // onto the next line, with whitespace at the end of the line before (#7).
        // The  *only* reliable way to do that is to copy the *entire* rest of the
        // textarea's content into the <span> created at the caret position.
        // for inputs, just '.' would be enough, but why bother?
        span.textContent = element.value.substring(position) || '.';  // || because a completely empty faux span doesn't render at all
        div.appendChild(span);

        let coordinates = {
            top: span.offsetTop + parseInt(computed['borderTopWidth']),
            left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
        };

        if (debug) {
            span.style.backgroundColor = '#aaa';
        } else {
            document.body.removeChild(div);
        }

        return coordinates;
    }

    window.getCaretCoordinates = getCaretCoordinates;

}());

/* Get Element XY Coordinate
----------------------------------------------- */
function getElementCoords(elem) { 
    let box = elem.getBoundingClientRect();

    let body = document.body;
    let docEl = document.documentElement;

    let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    let clientTop = docEl.clientTop || body.clientTop || 0;
    let clientLeft = docEl.clientLeft || body.clientLeft || 0;

    let top = box.top + scrollTop - clientTop;
    let left = box.left + scrollLeft - clientLeft;

    return {top: Math.round(top), left: Math.round(left)};
}