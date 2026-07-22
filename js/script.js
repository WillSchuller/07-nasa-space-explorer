// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('button');
const loadingMessage = document.getElementById('loadingMessage');
const modal = document.getElementById('modal');
const closeModalButton = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const apiKey = window.NASA_API_KEY || 'mVFpLqukKXZZixLcgZztvoctsFGlGjCiT70Tj9O6'; // Use the API key from config.js, or fallback to DEMO_KEY

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// When the user clicks the button, request the APOD images
// for the selected date range from the NASA API.
// If a real key is added to a local config file, it will be used here.
getImagesButton.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    return;
  }

  gallery.innerHTML = '';
  loadingMessage.classList.remove('hidden');

  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      gallery.innerHTML = '';

      if (!Array.isArray(data) || data.length === 0) {
        loadingMessage.classList.add('hidden');
        gallery.innerHTML = '<p>No space images were found for that date range.</p>';
        return;
      }

      data.forEach((item) => {
        // Only show images, since the task asks for the image, title, and date.
        if (item.media_type !== 'image') {
          return;
        }

        const card = document.createElement('article');
        card.className = 'space-card';
        card.dataset.image = item.url;
        card.dataset.title = item.title;
        card.dataset.date = item.date;
        card.dataset.explanation = item.explanation;

        const image = document.createElement('img');
        image.src = item.url;
        image.alt = item.title;
        image.className = 'space-image';

        const title = document.createElement('h2');
        title.textContent = item.title;

        const date = document.createElement('p');
        date.textContent = item.date;

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(date);
        gallery.appendChild(card);
      });

      loadingMessage.classList.add('hidden');
    })
    .catch(() => {
      loadingMessage.classList.add('hidden');
      gallery.innerHTML = '<p>There was a problem loading the space images.</p>';
    });
});

// Open a modal when a gallery article is clicked.
gallery.addEventListener('click', (event) => {
  const card = event.target.closest('.space-card');

  if (!card) {
    return;
  }

  modalImage.src = card.dataset.image;
  modalImage.alt = card.dataset.title;
  modalTitle.textContent = card.dataset.title;
  modalDate.textContent = card.dataset.date;
  modalExplanation.textContent = card.dataset.explanation;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
});

// Close the modal when the close button is clicked.
closeModalButton.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
});

// Close the modal when the user clicks outside the modal content.
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  }
});
