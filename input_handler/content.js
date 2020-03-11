const dictionary = {
    "Cat": ["Dog", "Rat", "bat"],
    "Helo": ["hello", "Help", "Hell"],
    "heldp": ["help", "held", "hello"]
}

let text = '',
    caretPosition,
    caretYPosition

document.addEventListener('input', inputHandler)


/*Функция обработки input элемента*/

function inputHandler(event) {
    console.log(text)
    if (event.data === ' ') {

        searchMatches(text, event)

    } else if (event.inputType === "deleteContentBackward") {

        text = text.slice(0, -1)
        console.log("text is " + text)

    } else if (event.data !== undefined && event.data !== null) {

        text += event.data
        console.log(event)


        /*для элементов , у которых есть свойство value*/
        if (event.target.value || event.target.value === '') {
            caretPosition = event.target.selectionStart

            caretYPosition = getCaretXYCoordinates(event.target, caretPosition).leftPosition
            console.log(caretYPosition);
            console.log("caret left position of input element is " + caretYPosition);
            console.log("caret position of input element is " + caretPosition)

        } else {
            caretPosition = getCaretCharOffset(event.target)

            console.log('caret position of not input element is ' + getCaretCharOffset(event.target))
        }
        console.log("text is " + text)
    }
}

/*Функция проверки совпадения слова в словаре*/

function searchMatches(word, event) {
    for (let key in dictionary) {
        if (word === key) {
            console.log(dictionary[key])
            createPopup(dictionary[key], event)
            return
        }
    }
    text = ''
}

/*Функция вызывается в случае нахождения слова в словаре. Создаёт окошко с опциями по замене слова.*/

function createPopup(array, event) {
    let userValueSelected = ''
    let element = event.target
    const popup = document.createElement('select')
    popup.className = 'extensionPopup'
    popup.setAttribute('size', array.length)


    array.forEach(item => {
        popup.insertAdjacentHTML("beforeend", `<option value="${item}">${item}</option>`)
    })

    element.before(popup)

    // let popupHeight = popup.offsetHeight
    // popup.style.top = `-${popupHeight}px`


    popup.onchange = e => {
        userValueSelected = e.target.value
    }
    popup.onclick = e => {
        replaceText(event, userValueSelected)
        popup.onblur = null
        popup.onkeypress = null
        popup.remove()
        focus(element)
        text = ''
    }
    popup.onkeypress = e => {
        if (e.key === 'Enter' || e.key === ' ') {
            replaceText(event, userValueSelected)
            popup.onblur = null
            popup.onclick = null
            popup.remove()
            focus(element)
            text = ''
        }
    }
    popup.onblur = e => {
        popup.onkeypress = null
        popup.onclick = null
        popup.remove()
        focus(element)
        text = ''
    }

    popup.style.left = caretYPosition === undefined ? `50%` : `${caretYPosition}px`

    popup.options[0].selected = true
    popup.options[0].selected = true
    popup.focus()
}

function replaceText(event, replacementText) {
    let elementText = ''

    const replaceAndConcat = () => {
        let firstPartTextSlice = elementText.slice(0, caretPosition - text.length)
        let secondPartTextSlice = elementText.slice(caretPosition - text.length)

        secondPartTextSlice = secondPartTextSlice.replace(text, replacementText)

        return firstPartTextSlice + secondPartTextSlice
    }

    if (event.target.value || event.target.value === '') {
        elementText = event.target.value
        event.target.value = replaceAndConcat()

    } else {
        elementText = event.target.textContent
        event.target.textContent = replaceAndConcat()
    }
}

/*Функция получения текущего положения каретки.
Так как у contenteditable элментов нету возможнсти получить текущее положение каретки,
то нужно создать такую возможность самому. Позиция каретки нужна для замены слова в поле ввода
для другой функции.*/

function getCaretCharOffset(element) {
    let caretOffset = 0;

    if (window.getSelection) {
        let range = window.getSelection().getRangeAt(0)
        let preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        caretOffset = preCaretRange.toString().length
    } else if (document.selection && (document.selection.type != "Control")) {
        let textRange = document.selection.createRange()
        let preCaretTextRange = document.body.createTextRange()
        preCaretTextRange.moveToElementText(element)
        preCaretTextRange.setEndPoint("EndToEnd", textRange)
        caretOffset = preCaretTextRange.text.length
    }

    return caretOffset
}


/*возврат фокуса в том месте, где закончили писать
            Не работает у Contenteditable elements: у таких элементов фокус происходит в конец/начало
            строки, в зависимости от браузера. Есть возможность решить эту проблему, написав
            свой собственный функционал для таких элементов, но для данного задания
            это лишний код.*/
function focus(element) {
    if (element.selectionStart || element.selectionStart == '0') {
        // Firefox/Chrome
        element.selectionStart = caretPosition;
        element.selectionEnd = caretPosition;
        element.focus();
    } else {
        element.focus()
    }
}

