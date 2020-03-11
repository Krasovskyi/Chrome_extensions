# Google_extension
Extension load itself into every page (including iframes) and handle actions on:
1. Input elements (type: “text”).
1. Contenteditable elements (including divs)

**Example handling:**
You type word “test” and press space → Nothing happens → Then you type word “foo” in text-input element (on any page) → Finish typing word (e.g. by pressing “space” button) → Popup is shown with several replacement options → User chooses “bar” option -> “foo” is replaced with “bar”


## Manifest 

1) Open the Extension Management page by navigating to chrome://extensions.
The Extension Management page can also be opened by clicking on the Chrome menu, hovering over More Tools then selecting Extensions.

2) Enable Developer Mode by clicking the toggle switch next to Developer mode.

3) Click the LOAD UNPACKED button and select the **input_handler** folder.

## Notes:
* Work properly when you add text inside existing text.
* Be possible to continue typing in same location.
* Work on all pages, with such elements (including e.g. iframes). 

## Dictionary (replacement options) for replacing:

1. Cat > Dog; Rat; bat
1. Helo > hello; Help, Hell
1. heldp > help; held; hello
