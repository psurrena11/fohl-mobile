document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL VARIABLES ---
    let itemsData = [];
    const circlesWrapper = document.querySelector('.circles_wrapper');
    const circlesContainer = document.getElementById('circles');
    const listViewContainer = document.getElementById('list-view');
    const panelOverlay = document.getElementById('panel-overlay');
    const closeBtn = document.getElementById('close-panel-btn');
    const productContent = document.querySelector('.product-content');
    const gridIcon = document.querySelector('.toggle_circles');
    const hamburgerIcon = document.querySelector('.toggle_list');
    const categoryLinks = document.querySelectorAll('#circle-nav a');

    // --- CORE FUNCTIONS ---

    async function initializeApp() {
        try {
            const response = await fetch('/data.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            itemsData = await response.json();

            generateCircles();
            generateListView(); // Create the list view elements
            setupPanelListeners();
            setupViewToggleListeners(); // Set up the icon click handlers
            setupCategoryNavListeners(); // Set up the category link handlers

        } catch (error) {
            console.error("Could not initialize the application:", error);
            circlesContainer.innerHTML = '<p>Error loading content.</p>';
        }
    }

    /**
     * Sets up the active class logic for the main category navigation.
     */
    function setupCategoryNavListeners() {
        if (categoryLinks.length > 0) {
            categoryLinks[0].classList.add('active');
        }

        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                categoryLinks.forEach(l => l.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }
    
    /**
     * Creates the list view items from the fetched data.
     */
    function generateListView() {
        listViewContainer.innerHTML = '';
        itemsData.forEach(item => {
            const listItem = document.createElement('a');
            listItem.href = '#';
            listItem.className = 'list-item';
            listItem.dataset.exhibit = item['exhibit-num'];

            const illustration = document.createElement('img');
            // Provide a fallback placeholder for items without an illustration
            illustration.src = item.img_illustration || 'https://placehold.co/100x100/dddddd/999999?text=?';
            illustration.alt = item.title;
            illustration.className = 'list-item-illustration';

            const title = document.createElement('span');
            title.textContent = item.title;
            title.className = 'list-item-title';

            const arrow = document.createElement('span');
            arrow.className = 'list-item-arrow';
            arrow.innerHTML = '&#8250;';

            listItem.appendChild(illustration);
            listItem.appendChild(title);
            listItem.appendChild(arrow);
            
            listItem.addEventListener('click', handleItemClick);
            listViewContainer.appendChild(listItem);
        });
    }
    
    /**
     * Sets up the listeners to toggle between the circle and list views.
     */
    function setupViewToggleListeners() {
        gridIcon.addEventListener('click', (e) => {
            e.preventDefault();
            circlesWrapper.classList.remove('hidden');
            listViewContainer.classList.add('hidden');
        });

        hamburgerIcon.addEventListener('click', (e) => {
            e.preventDefault();
            circlesWrapper.classList.add('hidden');
            listViewContainer.classList.remove('hidden');
        });
    }

    /**
     * Creates the circle links dynamically from the fetched data.
     */
    function generateCircles() {
        // ... (This function remains unchanged)
        circlesContainer.innerHTML = ''; 
        const groupedData = itemsData.reduce((acc, item) => {
          const category = item.category || 'uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});

        const categoryOrder = ['adaptive', 'on-demand', 'equilibrium'];

        categoryOrder.forEach(category => {
          if (groupedData[category]) {
            if (category === 'on-demand' || category === 'equilibrium') {
              const hr = document.createElement('hr');
              circlesContainer.appendChild(hr);
            }
            const catanchor = document.createElement('span');
            catanchor.id=category;
            circlesContainer.appendChild(catanchor);
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
            const groupContainer = document.createElement('div');
            groupContainer.className = 'circle-group';
            groupedData[category].forEach(item => {
              const circle = document.createElement('a');
              circle.className = 'circle';
              circle.href = '#';
              circle.textContent = item['exhibit-num'].toUpperCase();
              circle.dataset.exhibit = item['exhibit-num'];
              circle.addEventListener('click', handleItemClick);
              groupContainer.appendChild(circle);
            });
            circlesContainer.appendChild(groupContainer);
          }
        });
    }

    /**
     * Renders the content of the slide-up panel.
     */
    function renderPanelContent(exhibitNum) {
        const item = itemsData.find(i => i['exhibit-num'] === exhibitNum);
        if (!item) {
            console.error(`No item found for exhibit number: ${exhibitNum}`);
            return;
        }

        productContent.querySelector('h1').textContent = item.title;
        productContent.querySelector('.company').textContent = item.company;
        productContent.querySelector('.social').textContent = item.social;
        productContent.querySelector('.description-text').innerHTML = item.description;
        
        const illustrationImg = productContent.querySelector('.product-illustration img');
        if (item.img_illustration) {
            illustrationImg.src = item.img_illustration;
            illustrationImg.alt = item.title;
            illustrationImg.style.display = '';
        } else {
            illustrationImg.style.display = 'none';
        }

        const photoContainer = productContent.querySelector('.product-photo');
        if (item.img_product) {
            photoContainer.style.display = '';
            const photoImg = photoContainer.querySelector('img');
            photoImg.src = item.img_product;
            photoImg.alt = item.title;
        } else {
            photoContainer.style.display = 'none';
        }
    }

    // --- EVENT HANDLERS & LISTENERS ---

    function handleItemClick(event) {
        event.preventDefault();
        const exhibitNum = event.currentTarget.dataset.exhibit;
        renderPanelContent(exhibitNum);
        openPanel();
    }
    
    const openPanel = () => panelOverlay.classList.add('is-visible');
    const closePanel = () => panelOverlay.classList.remove('is-visible');
    
    function setupPanelListeners() {
        closeBtn.addEventListener('click', closePanel);
        panelOverlay.addEventListener('click', (event) => {
            if (event.target === panelOverlay) {
                closePanel();
            }
        });
    }

    // --- START THE APP ---
    initializeApp();
});