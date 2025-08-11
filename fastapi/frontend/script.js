const grid = document.getElementById("videoGrid");
const player = document.getElementById("playerContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const API_BASE = "http://localhost:8000";  // Adjust if deployed somewhere else

async function searchVideos(query) {
  const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
  return await res.json();
}

async function fetchVideoDetails(videoIds) {
  if (videoIds.length === 0) return [];
  const res = await fetch(`${API_BASE}/videos?ids=${videoIds.join(",")}`);
  return await res.json();
}

async function fetchChannelAvatars(channelIds) {
  if (channelIds.length === 0) return {};
  const res = await fetch(`${API_BASE}/channels?ids=${channelIds.join(",")}`);
  return await res.json();
}

async function render(query) {
  const results = await searchVideos(query);
  const ids = results.map((v) => v.id.videoId).filter(Boolean);
  const channelIds = results.map((v) => v.snippet.channelId).filter(Boolean);

  if (ids.length === 0) {
    grid.innerHTML = "<p>No videos found.</p>";
    player.innerHTML = "";
    return;
  }

  const [details, avatars] = await Promise.all([
    fetchVideoDetails(ids),
    fetchChannelAvatars(channelIds),
  ]);

  grid.innerHTML = "";
  player.innerHTML = "";

  details.forEach((v) => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <img class="thumbnail" src="${v.snippet.thumbnails.medium.url}" alt="${v.snippet.title}" />
      <div class="video-info">
        <img class="channel-avatar" src="${avatars[v.snippet.channelId] || ""}" alt="${v.snippet.channelTitle}" />
        <div class="text-info">
          <p class="video-title">${v.snippet.title}</p>
          <p class="video-channel">${v.snippet.channelTitle}</p>
          <p class="video-stats">${parseInt(v.statistics.viewCount).toLocaleString()} views</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => {
      player.innerHTML = `
        <iframe width="900" height="506"
          src="https://www.youtube.com/embed/${v.id}?autoplay=1&rel=0"
          allow="autoplay; encrypted-media" allowfullscreen>
        </iframe>
      `;
      window.scrollTo({ top: player.offsetTop - 20, behavior: "smooth" });
    });

    grid.appendChild(card);
  });
}

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && searchInput.value.trim()) {
    render(searchInput.value.trim());
  }
});

searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim()) {
    render(searchInput.value.trim());
  }
});

// Initial render
render("latest music videos");
