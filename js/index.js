document.addEventListener('DOMContentLoaded', () => {
    // Remove the counter display if it exists
    const counterDisplay = document.querySelector('#counterDisplay');
    if (counterDisplay) {
        counterDisplay.remove();
    }

    // Remove the increment button if it exists
    const incrementButton = document.querySelector('#incrementButton');
    if (incrementButton) {
        incrementButton.remove();
    }
});
