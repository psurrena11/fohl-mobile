// Import main scss
import './scss/app.scss';

// Import JS files
//import '/js/loop.js';
//import '/js/panel.js';


document.addEventListener('DOMContentLoaded', () => {

  // --- GLOBAL VARIABLES ---
  let itemsData = []; // To store the fetched data
  const circlesContainer = document.getElementById('circles');
  const panelOverlay = document.getElementById('panel-overlay');
  const closeBtn = document.getElementById('close-panel-btn');
  const productContent = document.querySelector('.product-content');

  // --- CORE FUNCTIONS ---

  /**
   * Fetches data, then builds the UI and sets up event listeners.
   */
  async function initializeApp() {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      itemsData = await response.json();

      generateCircles();
      setupPanelListeners();

    } catch (error) {
      console.error("Could not initialize the application:", error);
      circlesContainer.innerHTML = '<p>Error loading content.</p>';
    }
  }

  /**
   * Creates the circle links dynamically from the fetched data. 
   */
  function generateCircles() {
    circlesContainer.innerHTML = ''; // Clear existing content
    itemsData.forEach(item => {
      const circle = document.createElement('a');
      circle.className = 'circle';
      circle.href = '#';
      // Use the exhibit-num for the display text, converted to uppercase
      circle.textContent = item['exhibit-num'].toUpperCase();
      // Store the exhibit number in a data attribute for easy access
      circle.dataset.exhibit = item['exhibit-num'];

      circle.addEventListener('click', handleCircleClick);
      circlesContainer.appendChild(circle);
    });
  }

  /**
   * Finds the correct data and populates the panel's content.
   */
  function renderPanelContent(exhibitNum) {
    // Find the item in our data array that matches the clicked exhibit number
    const item = itemsData.find(i => i['exhibit-num'] === exhibitNum);
    if (!item) {
      console.error(`No item found for exhibit number: ${exhibitNum}`);
      return;
    }

    // Update the panel's content with the item's data
    productContent.querySelector('h1').textContent = item.title;
    productContent.querySelector('content').innerHTML = item.description; // Use .innerHTML because description contains HTML
    productContent.querySelector('.company').textContent = item.company;
    productContent.querySelector('.social').textContent = item.social;
    
    // Example for updating the image - assumes your JSON has an image path
    if (item.img_illustration) {
        const imgElement = productContent.querySelector('.product-image img');
        imgElement.src = item.img_illustration;
        imgElement.alt = item.title;
    }
  }

  // --- EVENT HANDLERS & LISTENERS ---

  /**
   * Handles a click on any circle.
   */
  function handleCircleClick(event) {
    event.preventDefault(); // Stop the link from navigating
    const exhibitNum = event.target.dataset.exhibit;
    renderPanelContent(exhibitNum);
    openPanel();
  }
  
  const openPanel = () => panelOverlay.classList.add('is-visible');
  const closePanel = () => panelOverlay.classList.remove('is-visible');
  
  function setupPanelListeners() {
    closeBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', (event) => {
      // Close only if the click is on the overlay itself, not the panel
      if (event.target === panelOverlay) {
        closePanel();
      }
    });
  }

  // --- START THE APP ---
  initializeApp();

});

console.log("FoHL was LIT!");