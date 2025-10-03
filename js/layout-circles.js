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
/**
   * Creates the circle links dynamically from the fetched data, grouped by category.
   */
  function generateCircles() {
    circlesContainer.innerHTML = ''; // Clear existing content

    // Group items by category
    const groupedData = itemsData.reduce((acc, item) => {
      const category = item.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    // Define the desired order of categories for display
    const categoryOrder = ['adaptive', 'on-demand', 'equilibrium'];

    // Generate HTML for each group in the specified order
    categoryOrder.forEach(category => {
      if (groupedData[category]) {

        // --- START: ADDED LOGIC ---
        // If the category is on-demand or equilibrium, add an <hr>
        if (category === 'on-demand' || category === 'equilibrium') {
          const hr = document.createElement('hr');
          circlesContainer.appendChild(hr);
        }
        // --- END: ADDED LOGIC ---

        // Create a header for the category
        /*
        const header = document.createElement('h2');
        header.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        header.className = 'category-header';
        circlesContainer.appendChild(header);
        */

        const description = document.createElement('p');
        if (category === 'adaptive') {
          description.textContent = 'Four key trends are driving the development of highly configurable homes, which use customizable solutions to adapt to the flexible demands of urban lifestyles.';
        } else if (category === 'on-demand') {
            description.textContent = 'Products available whenever you need them.';
        } else if (category === 'equilibrium') {
            description.textContent = 'Products designed for balance and harmony.';
        }
        description.className = 'category-description';
        circlesContainer.appendChild(description);

        // Create a container to hold the circles for this group
        const groupContainer = document.createElement('div');
        groupContainer.className = 'circle-group';

        // Create circles for each item in the current category
        groupedData[category].forEach(item => {
          const circle = document.createElement('a');
          circle.className = 'circle';
          circle.href = '#';
          circle.textContent = item['exhibit-num'].toUpperCase();
          circle.dataset.exhibit = item['exhibit-num'];

          circle.addEventListener('click', handleCircleClick);
          groupContainer.appendChild(circle);
        });

        circlesContainer.appendChild(groupContainer);
      }
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