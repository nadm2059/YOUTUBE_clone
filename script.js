// Your YouTube Data API key for authentication
const API_KEY = 'AIzaSyDSDL6zn5ax_H5t21_6aW-MbE_MHFzXwG0';

// Get the HTML element with id 'videoGrid' where videos will be displayed
const grid = document.getElementById('videoGrid');

// Get the HTML element with id 'playerContainer' where the video player iframe will be shown
const player = document.getElementById('playerContainer');

// Get the HTML input element where the user types their search query
const searchInput = document.getElementById('searchInput');

// Get the HTML button element that triggers the search
const searchBtn = document.getElementById('searchBtn');

// Async function to search videos based on the query string
async function searchVideos(query) {
  // Call YouTube Search API with encoded query and API key, limiting to 8 video results
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(query)}&key=${API_KEY}`);
  
  // Parse the JSON response from the API
  const data = await res.json();
  
  // Return the list of video items from the response or empty array if none found
  return data.items || [];
}

// Async function to fetch detailed video info (snippet + statistics) for a list of video IDs
async function fetchVideoDetails(videoIds) {
  // Call YouTube Videos API with list of video IDs and API key
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(',')}&key=${API_KEY}`);
  
  // Parse the JSON response
  const data = await res.json();
  
  // Return the list of video details or empty array if none found
  return data.items || [];
}

// Async function to fetch channel avatars for a list of channel IDs
async function fetchChannelAvatars(channelIds) {
  // Call YouTube Channels API to get snippet info including thumbnails for each channel ID
  const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(',')}&key=${API_KEY}`);
  
  // Parse the JSON response
  const data = await res.json();
  
  // Initialize an empty object to map channel IDs to their avatar URLs
  const map = {};
  
  // For each channel item in the response, map channel ID to the default thumbnail URL
  data.items.forEach(c => {
    map[c.id] = c.snippet.thumbnails.default.url;
  });
  
  // Return the map of channel IDs to avatar URLs
  return map;
}

// Async function to perform the whole search, fetch details, and render videos on page
async function render(query) {
  // Search for videos matching the query
  const results = await searchVideos(query);
  
  // Extract video IDs from search results
  const ids = results.map(v => v.id.videoId);
  
  // Extract channel IDs from search results
  const channelIds = results.map(v => v.snippet.channelId);

  // If no videos found, display a message and exit the function
  if (ids.length === 0) {
    grid.innerHTML = '<p>No videos found.</p>';
    return;
  }

  // Fetch video details and channel avatars in parallel
  const [details, avatars] = await Promise.all([
    fetchVideoDetails(ids),
    fetchChannelAvatars(channelIds)
  ]);

  // Clear any existing content inside the video grid
  grid.innerHTML = '';
  
  // For each detailed video info, create a video card and add it to the grid
  details.forEach(v => {
    // Create a new div element to serve as the video card
    const card = document.createElement('div');
    
    // Assign a CSS class for styling the video card
    card.className = 'video-card';
    
    // Set the inner HTML of the card with thumbnail, channel avatar, title, channel name, and view count
    card.innerHTML = `
      <img class="thumbnail" src="${v.snippet.thumbnails.medium.url}" alt="${v.snippet.title}">
      <div class="video-info">
        <img class="channel-avatar" src="${avatars[v.snippet.channelId] || ''}" alt="${v.snippet.channelTitle}">
        <div class="text-info">
          <p class="video-title">${v.snippet.title}</p>
          <p class="video-channel">${v.snippet.channelTitle}</p>
          <p class="video-stats">${parseInt(v.statistics.viewCount).toLocaleString()} views</p>
        </div>
      </div>
    `;

    // Add a click event listener to play the selected video in the player container
    card.addEventListener('click', () => {
      // Replace the player container's inner HTML with an iframe for the YouTube player, autoplay enabled
      player.innerHTML = `
        <iframe width="900" height="506"
          src="https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0"
          allow="autoplay; encrypted-media"
          allowfullscreen>
        </iframe>
      `;
      
      // Smoothly scroll the window so the player container is visible near the top
      window.scrollTo({ top: player.offsetTop - 20, behavior: 'smooth' });
    });

    // Add the constructed video card element to the video grid container
    grid.appendChild(card);
  });
}

// Add an event listener for the 'Enter' key on the search input to trigger search
searchInput.addEventListener('keydown', e => {
  // If the pressed key is Enter and input is not empty after trimming spaces
  if (e.key === 'Enter' && searchInput.value.trim()) {
    // Call the render function to search and display videos based on input
    render(searchInput.value.trim());
  }
});

// Add a click event listener to the search button to trigger search
searchBtn.addEventListener('click', () => {
  // If the input is not empty after trimming spaces
  if (searchInput.value.trim()) {
    // Call the render function to search and display videos based on input
    render(searchInput.value.trim());
  }
});

// Initial call to render the page with a default query of 'latest music videos'
render('latest music videos');
