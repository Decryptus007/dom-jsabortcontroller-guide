const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
let currentRequest = null; // Stores the current request

searchInput.addEventListener('input', () => {
  // Cancel the previous request if it exists
  if (currentRequest) {
    currentRequest.abort();
  }

  const searchTerm = searchInput.value.trim();

  // Don't send an empty request
  if (searchTerm === '') {
    searchResults.innerHTML = '';
    return;
  }

  // Create a new AbortController and signal
  const controller = new AbortController();
  const signal = controller.signal;

  // Create a new request and attach the signal
  const request = fetch(
    `https://dummyjson.com/products/search?q=${searchTerm}`,
    { signal }
  );

  // Update the current request
  currentRequest = controller;

  request
    .then((response) => response.json())
    .then((data) => {
      // Process and display search results
      searchResults.innerHTML = data.products
        .map((item) => `<li>${item.title}</li>`)
        .join('');
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        // Request was canceled, ignore this error
      } else {
        console.error('Error:', error);
      }
    })
    .finally(() => {
      // Reset the current request when done
      currentRequest = null;
    });
});
