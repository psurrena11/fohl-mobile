// This function fetches, parses, and renders the data
async function loadItems() {
  const container = document.getElementById('items-container');
  
  try {
    // Fetch the JSON file. The path is simple because it's in the 'public' folder.
    const response = await fetch('/data.json');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Parse the JSON data into a JavaScript array
    const items = await response.json();
    
    // Clear any existing content (like a 'Loading...' message)
    container.innerHTML = '';
    
    // Loop through the array and create HTML for each item 🎨
    items.forEach(item => {
      // Create a new div element for the item
      const itemElement = document.createElement('div');
      itemElement.classList.add('item'); // Optional: for styling
      
      // Use template literals to create the inner HTML
      itemElement.innerHTML = `
        <h1>${item.title}</h1>
        <p>${item.description}</p>
      `;
      
      // Append the new element to the container
      container.appendChild(itemElement);
    });
    
  } catch (error) {
    // If something goes wrong (e.g., file not found, invalid JSON)
    console.error("Could not load items:", error);
    container.innerHTML = '<p>Sorry, we could not load the items.</p>';
  }
}

// Call the function to run everything when the script loads
loadItems();