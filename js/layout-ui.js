document.addEventListener('DOMContentLoaded', () => {

  // --- START: NAV ICON ACTIVE STATE ---
  const gridIcon = document.getElementById('grid-icon');
  const listIcon = document.getElementById('list-icon');
  const navIcons = [gridIcon, listIcon];

  // Set grid icon as active by default, check if it exists first
  if (gridIcon) {
    gridIcon.classList.add('active');
  }

  function handleNavIconClick(event) {
    event.preventDefault();
    navIcons.forEach(icon => {
        if (icon) icon.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
  }

  navIcons.forEach(icon => {
    if (icon) {
      icon.addEventListener('click', handleNavIconClick);
    }
  });
  // --- END: NAV ICON ACTIVE STATE ---


  // --- GLOBAL VARIABLES ---
  let itemsData = [];
  const circlesContainer = document.getElementById('circles');
  const panelOverlay = document.getElementById('panel-overlay');
  const closeBtn = document.getElementById('close-panel-btn');
  const productContent = document.querySelector('.product-content');


  // --- CORE FUNCTIONS ---

  async function initializeApp() {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      itemsData = await response.json();

      generateCircles();
      setupPanelListeners();
      setupCategoryNavListeners();

    } catch (error) {
      console.error("Could not initialize the application:", error);
      circlesContainer.innerHTML = '<p>Error loading content.</p>';
    }
  }

  function setupCategoryNavListeners() {
    const links = document.querySelectorAll('#circle-nav a');

    if (links.length > 0) {
      links[0].classList.add('active');
    }

    function handleLinkClick(e) {
      links.forEach(link => link.classList.remove('active'));
      e.target.classList.add('active');
    }

    links.forEach(link => link.addEventListener('click', handleLinkClick));
  }

  function generateCircles() {
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
          circlesContainer.appendChild(document.createElement('hr'));
        }

        const catAnchor = document.createElement('span');
        catAnchor.id = category;
        circlesContainer.appendChild(catAnchor);

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
          circle.addEventListener('click', handleCircleClick);
          groupContainer.appendChild(circle);
        });
        circlesContainer.appendChild(groupContainer);
      }
    });
  }

  function renderPanelContent(exhibitNum) {
    const item = itemsData.find(i => i['exhibit-num'] === exhibitNum);
    if (!item) return;

    productContent.querySelector('h1').textContent = item.title;
    productContent.querySelector('.company').textContent = item.company;
    productContent.querySelector('.social').textContent = item.social;
    productContent.querySelector('.description-text').innerHTML = item.description;

    const illustrationImg = productContent.querySelector('.product-illustration img');
    if (item.img_illustration) {
        illustrationImg.src = item.img_illustration;
        illustrationImg.alt = item.title;
    } else {
        illustrationImg.src = ''; // Clear if no image
    }

    const photoContainer = productContent.querySelector('.product-photo');
    if (item.img_product) {
      photoContainer.style.display = '';
      photoContainer.querySelector('img').src = item.img_product;
      photoContainer.querySelector('img').alt = item.title;
    } else {
      photoContainer.style.display = 'none';
    }
  }


  // --- EVENT HANDLERS & LISTENERS ---

  function handleCircleClick(event) {
    event.preventDefault();
    const exhibitNum = event.target.dataset.exhibit;
    renderPanelContent(exhibitNum);
    openPanel();
  }

  const openPanel = () => {
    panelOverlay.classList.add('is-visible');
    document.body.classList.add('no-scroll');
  };

  const closePanel = () => {
    panelOverlay.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
  };

  function setupPanelListeners() {
    const slidingPanel = document.getElementById('sliding-panel');
    let touchStartY = 0;

    closeBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', (event) => {
      if (event.target === panelOverlay) {
        closePanel();
      }
    });

    slidingPanel.addEventListener('touchstart', (e) => {
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    slidingPanel.addEventListener('touchend', (e) => {
      const touchEndY = e.changedTouches[0].screenY;
      if (touchEndY > touchStartY + 100) {
        closePanel();
      }
    });
  }

  // --- START THE APP ---
  initializeApp();

});