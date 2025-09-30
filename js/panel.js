// Wait for the document to be ready
document.addEventListener('DOMContentLoaded', () => {

  // Get all the elements we need
  const openBtn = document.getElementById('open-panel-btn');
  const closeBtn = document.getElementById('close-panel-btn');
  const panelOverlay = document.getElementById('panel-overlay');

  // Function to open the panel
  const openPanel = () => {
    panelOverlay.classList.add('is-visible');
  };

  // Function to close the panel
  const closePanel = () => {
    panelOverlay.classList.remove('is-visible');
  };

  // --- EVENT LISTENERS ---

  // Click the 'Open' button
  openBtn.addEventListener('click', (event) => {
    event.preventDefault(); // Prevents the link from jumping to the top of the page
    openPanel();
  });

  // Click the 'X' button inside the panel
  closeBtn.addEventListener('click', closePanel);

  // Click on the overlay area (the space above the panel)
  panelOverlay.addEventListener('click', (event) => {
    // We check if the click was directly on the overlay itself,
    // and not on the panel or its contents.
    if (event.target === panelOverlay) {
      closePanel();
    }
  });

});