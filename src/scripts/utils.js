/**
 * Updates button text during loading states
 * @param {boolean} isLoading - Whether the operation is in loading state
 * @param {HTMLElement} button - The button element to modify
 * @param {string} buttonText - Default button text
 * @param {string} loadingText - Text to display during loading
 */
export function renderLoading(isLoading, button, buttonText = 'Save', loadingText = 'Saving...') {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

/**
 * Universal form submission handler
 * @param {Function} request - Function that returns a promise for the API request
 * @param {Event} evt - The form submission event
 * @param {string} loadingText - Text to display during loading
 */
export function handleSubmit(request, evt, loadingText = 'Saving...') {
  // Prevent default form submission
  evt.preventDefault();

  // Get submit button from the event
  const submitButton = evt.submitter;
  // Store the initial button text
  const initialText = submitButton.textContent;

  // Show loading state
  renderLoading(true, submitButton, initialText, loadingText);

  // Execute the request
  request()
    .then(() => {
      // Reset the form on success
      evt.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      // Restore button text when done
      renderLoading(false, submitButton, initialText);
    });
}
