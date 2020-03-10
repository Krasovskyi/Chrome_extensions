const dictionary = {
    "Cat": ["Dog", "Rat", "bat"],
    "Helo": ["hello", "Help", "Hell"],
    "heldp": ["help", "held", "hello"]
}

let text = ''
let caretPosition = 0

document.addEventListener('input', inputHandler)


// Функция обработки input элемента

function inputHandler(event) {

    if (event.data === ' ') {

        searchMatches(text, event)

    } else if (event.inputType === "deleteContentBackward") {

        text = text.slice(0, -1)
        console.log("text is " + text)

    } else if (event.data !== undefined) {

        text += event.data
        console.log(event)

        if (event.target.tagName === 'INPUT') {

            caretPosition = event.target.selectionStart
            console.log(caretPosition)

        } else {

            caretPosition = getCaretCharOffset(event.target)
            console.log(caretPosition)

        }
        console.log("text is " + text)
        console.log(event.data)
    }
}

// Функция проверки совпадения слова в словаре

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

// Функция вызывается в случае нахождения слова в словаре. Создаёт окошко с опциями по замене слова.

function createPopup(array, event) {
    let userValueSelected = ''

    const popup = document.createElement('select')
    popup.className = 'extensionPopup'
    popup.setAttribute('size', array.length)


    array.forEach(item => {
        popup.insertAdjacentHTML("beforeend", `<option value="${item}">${item}</option>`)
    })
    event.target.before(popup)

    popup.addEventListener('change', e => {
        userValueSelected = e.target.value
    })
    popup.addEventListener('keypress', e => {
        if (e.key === 'Enter' || e.key === ' ') {
            replaceText(event, userValueSelected)
            text = ''
            popup.remove()
            event.target.focus()
        }
    })

    popup.options[0].selected = true;
    popup.focus()
}

function replaceText(event, replacmentText) {
    let elementText = ''

    const replaceAndConcat =  () => {
        let firstPartTextSlice = elementText.slice(0, caretPosition - text.length)
        let secondPartTextSlice = elementText.slice(caretPosition - text.length)

        secondPartTextSlice = secondPartTextSlice.replace(text, replacmentText)

        return firstPartTextSlice + secondPartTextSlice
    }

    if (event.target.localName === 'input') {
        elementText = event.target.value

        event.target.value = replaceAndConcat()

    } else {
        elementText = event.target.textContent

        event.target.textContent = replaceAndConcat()
    }


}

// Функция получения текущего положения каретки.
// Так как у contenteditable элментов нету возможнсти получить текущее положение каретки,
// то нужно создать такую возможность самому.

function getCaretCharOffset(element) {
    let caretOffset = 0;

    if (window.getSelection) {
        let range = window.getSelection().getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    } else if (document.selection && (document.selection.type != "Control")) {
        let textRange = document.selection.createRange();
        let preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }

    return caretOffset;
}
