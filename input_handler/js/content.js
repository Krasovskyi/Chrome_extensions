const dictionary = {
    "Cat": ["Dogasdfasdfa", "Rat", "bat"],
    "Helo": ["hello", "Help", "Hell"],
    "heldp": ["help", "held", "hello"],
    "foo": ["boo", "boo", "boo"],
    "boo": ["foo", "foo", "foo"],
    "bar": ["help", "boo", "foo", "boo", "foo", "boo", "foo"]
}

const style = document.createElement('link');
style.rel = 'stylesheet';
style.type = 'text/css';
style.href = chrome.extension.getURL('css/content.css');
(document.head||document.documentElement).appendChild(style);

let text = '',
    caretPosition = 0

document.addEventListener('input', inputHandler)

/*Функция обработки input элемента*/

function inputHandler(event) {
    if (event.data === ' ') {
        searchMatches(text, event)
    } else if (event.inputType === "deleteContentBackward") {
        text = text.slice(0, -1)
    } else if (event.data !== undefined && event.data !== null) {
        text += event.data
        if (event.target.value || event.target.value === '') {
            caretPosition = event.target.selectionStart
        } else {
            caretPosition = getCaretCharOffset(event.target)
        }
    }
}

/*Функция проверки совпадения слова в словаре*/

function searchMatches(word, event) {
    for (let key in dictionary) {
        if (word === key) {
            createPopup(dictionary[key], event)
            return
        }
    }
    text = ''
}

/*Функция вызывается в случае нахождения слова в словаре. Создаёт окошко с опциями по замене слова.*/

function createPopup(array, event) {
    let userValueSelected
    let element = event.target

    const popup = document.createElement('select')
    popup.id = 'extensionPopup'
    popup.setAttribute('size', array.length)

    array.forEach(item => {
        popup.insertAdjacentHTML("beforeend", `<option value="${item}">${item}</option>`)
    })
    //Для Contenteditable elements
    if (element.firstChild) {
        let firstChild = element.firstChild
        let rng = document.createRange()
        rng.setStart(firstChild, caretPosition)
        rng.setEnd(firstChild, caretPosition)
        rng.insertNode(popup)
    } else {
        let caretXYCoordinates = getCaretXYCoordinates(element, caretPosition)
        popup.style.left = caretXYCoordinates.leftPosition + 'px'
        popup.style.top = caretXYCoordinates.topPosition + 'px'
        document.body.appendChild(popup)
    }

    popup.options[0].selected = true
    popup.focus()


    popup.onclick = e => {
        userValueSelected = e.target.value
        popup.onblur = null
        popup.onkeypress = null
        popup.remove()
        replaceText(event, userValueSelected)
        focusOnElement(element, userValueSelected)
        text = ''
    }
    popup.onkeypress = e => {
        userValueSelected = e.target.value
        if (e.key === 'Enter' || e.key === ' ') {
            popup.onblur = null
            popup.onclick = null
            popup.remove()
            replaceText(event, userValueSelected)
            focusOnElement(element, userValueSelected)
            text = ''
        }
    }
    popup.onblur = e => {
        popup.onkeypress = null
        popup.onclick = null
        popup.remove()
        text = ''
    }
}

function replaceText(event, replacementText) {
    let elementText = ''
    const replaceAndConcat = () => {
        let firstPartTextSlice = elementText.slice(0, caretPosition - text.length)
        let secondPartTextSlice = elementText.slice(caretPosition - text.length)
        secondPartTextSlice = secondPartTextSlice.replace(text, replacementText)
        return firstPartTextSlice + secondPartTextSlice
    }

    if (event.target.value) {
        elementText = event.target.value
        event.target.value = replaceAndConcat()
    } else {
        elementText = event.target.textContent
        event.target.textContent = replaceAndConcat()
    }
}

/*Функция получения текущего положения каретки.*/

function getCaretCharOffset(element) {
    const selection = window.getSelection()
    return selection.anchorOffset
}

function focusOnElement(element, userValueSelected) {
    let offset = userValueSelected.length - text.length

    // Для input и textarea элементов.
    if (element.selectionStart || element.selectionStart == '0') {
        element.selectionStart = caretPosition + offset + 1
        element.selectionEnd = caretPosition + offset + 1
        element.focus()
    } else {
        let textNode = element.firstChild
        let caret = caretPosition
        let range = document.createRange()
        range.setStart(textNode, caret + offset + 1)
        range.setEnd(textNode, caret + offset + 1)
        let sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
    }
}

