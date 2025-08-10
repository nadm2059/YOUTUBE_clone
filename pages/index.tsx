// Import React hooks useState and useEffect from React library
import { useState, useEffect } from 'react';

// Import CSS module styles for this component
import styles from '../styles/Home.module.scss';

// YouTube Data API key for authentication
const API_KEY = //replace with your api key;

// TypeScript interface describing the shape of a video snippet object
interface VideoSnippet {
  title: string;                // Video title string
  channelId: string;            // Channel's unique ID string
  channelTitle: string;         // Channel's title string
  thumbnails: {                 // Thumbnails object containing multiple sizes
    medium: { url: string };    // Medium size thumbnail URL string
    default: { url: string };   // Default size thumbnail URL string
  };
}

// Interface describing video statistics shape
interface VideoStatistics {
  viewCount: string;            // View count as a string (from API)
}

// Interface describing the complete video item returned by API
interface VideoItem {
  id: string;                   // Video's unique ID string
  snippet: VideoSnippet;        // Video snippet details
  statistics: VideoStatistics;  // Video statistics details
}

// Interface describing each item returned by search API
interface SearchResultItem {
  id: { videoId: string };      // Object holding video ID string
  snippet: VideoSnippet;        // Video snippet details
}

// React functional component named Home exported as default
export default function Home() {
  // React state to hold current search query string, initially set
  const [query, setQuery] = useState('latest music videos');

  // State to hold an array of video items retrieved from API
  const [videos, setVideos] = useState<VideoItem[]>([]);

  // State holding a map from channel ID to avatar image URL
  const [avatars, setAvatars] = useState<Record<string, string>>({});

  // State for currently selected video ID or null if none selected
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  // Boolean state to track if videos are currently loading
  const [loading, setLoading] = useState(false);

  // State to hold any error message or null if no error
  const [error, setError] = useState<string | null>(null);

  // Async function to perform YouTube search API call given a query string
  async function searchVideos(searchQuery: string): Promise<SearchResultItem[]> {
    // Fetch search results JSON from YouTube API with encoded query and API key
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(
        searchQuery
      )}&key=${API_KEY}`
    );

    // Parse JSON response
    const data = await res.json();

    // Return items array or empty if none present
    return data.items || [];
  }

  // Async function to fetch detailed video info (snippet + statistics) by video IDs
  async function fetchVideoDetails(videoIds: string[]): Promise<VideoItem[]> {
    // Return empty array immediately if no IDs provided
    if (videoIds.length === 0) return [];

    // Fetch detailed video info from YouTube videos API for given IDs
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds.join(
        ','
      )}&key=${API_KEY}`
    );

    // Parse JSON response
    const data = await res.json();

    // Return array of detailed video items or empty if none present
    return data.items || [];
  }

  // Async function to fetch channel avatars by channel IDs
  async function fetchChannelAvatars(
    channelIds: string[]
  ): Promise<Record<string, string>> {
    // Return empty object immediately if no channel IDs provided
    if (channelIds.length === 0) return {};

    // Fetch channel info including thumbnails from YouTube channels API
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds.join(
        ','
      )}&key=${API_KEY}`
    );

    // Parse JSON response
    const data = await res.json();

    // Initialize an empty map from channel ID to avatar URL
    const map: Record<string, string> = {};

    // For each channel item, map the ID to its default thumbnail URL
    data.items.forEach((c: any) => {
      map[c.id] = c.snippet.thumbnails.default.url;
    });

    // Return the map of channel avatars
    return map;
  }

  // Async function to perform a full search flow and update states accordingly
  async function performSearch(searchQuery: string) {
    setLoading(true);          // Indicate loading started
    setError(null);            // Clear previous errors

    try {
      // Call searchVideos to get basic video search results
      const results = await searchVideos(searchQuery);

      // Extract array of video IDs from results
      const ids = results.map((v) => v.id.videoId);

      // Extract array of channel IDs from results
      const channelIds = results.map((v) => v.snippet.channelId);

      // If no videos found, update state accordingly and exit early
      if (ids.length === 0) {
        setVideos([]);
        setAvatars({});
        setError('No videos found.');
        setLoading(false);
        return;
      }

      // Fetch video details and avatars in parallel
      const [details, avatarsMap] = await Promise.all([
        fetchVideoDetails(ids),
        fetchChannelAvatars(channelIds),
      ]);

      // Update videos state with detailed video data
      setVideos(details);

      // Update avatars state with channel avatar URLs
      setAvatars(avatarsMap);

      // Clear any previously selected video
      setSelectedVideoId(null);
    } catch (e) {
      // On error, set a user-friendly error message
      setError('Failed to fetch videos. Please try again later.');
    } finally {
      // Loading is finished regardless of success or failure
      setLoading(false);
    }
  }

  // React useEffect hook to perform an initial search on component mount
  useEffect(() => {
    performSearch(query);
  }, []);

  // Event handler for form submission (search)
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();            // Prevent default form submission behavior

    // Only search if query is non-empty after trimming whitespace
    if (query.trim()) {
      performSearch(query.trim()); // Perform search with trimmed query
    }
  };

  // JSX returned by this component describing the UI
  return (
    // Main container div with styling class
    <div className={styles.container}>

      {/* Header section with logo and search form */}
      <header className={styles.header}>
        <div className={styles.logo}>🎬 YouTube</div>

        {/* Search form with submit handler */}
        <form onSubmit={onSubmit} className={styles.searchForm}>

          {/* Text input bound to query state, updating on change */}
          <input
            type="text"
            placeholder="Search YouTube videos"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />

          {/* Submit button */}
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>
      </header>

      {/* Main content area */}
      <main className={styles.main}>

        {/* Loading indicator shown conditionally */}
        {loading && <p className={styles.loading}>Loading videos...</p>}

        {/* Error message shown conditionally */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Grid container for video cards */}
        <section className={styles.videoGrid}>

          {/* Map over videos state to render each video card */}
          {videos.map((v) => (
            <div
              key={v.id}                         // React key for list item
              className={styles.videoCard}       // Styling class for video card
              onClick={() => setSelectedVideoId(v.id)} // Set selected video ID on click
            >
              {/* Video thumbnail image */}
              <img
                className={styles.thumbnail}
                src={v.snippet.thumbnails.medium.url}
                alt={v.snippet.title}
              />

              {/* Video info container */}
              <div className={styles.videoInfo}>

                {/* Channel avatar image */}
                <img
                  className={styles.channelAvatar}
                  src={avatars[v.snippet.channelId] || ''}
                  alt={v.snippet.channelTitle}
                />

                {/* Textual info about video */}
                <div className={styles.textInfo}>
                  <p className={styles.videoTitle}>{v.snippet.title}</p>
                  <p className={styles.videoChannel}>{v.snippet.channelTitle}</p>
                  <p className={styles.videoStats}>
                    {/* Format view count with locale separators */}
                    {parseInt(v.statistics.viewCount).toLocaleString()} views
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Video player container */}
        <div className={styles.playerContainer}>

          {/* Show iframe player only if a video is selected */}
          {selectedVideoId && (
            <iframe
              width={900}                        // Player width in pixels
              height={506}                       // Player height in pixels
              src={`https://www.youtube.com/embed/${selectedVideoId}?autoplay=1&rel=0`} // YouTube embed URL with autoplay
              allow="autoplay; encrypted-media" // Permissions for autoplay
              allowFullScreen                    // Allow fullscreen mode
              title="YouTube video player"      // Accessibility title
              className={styles.playerIframe}   // Styling class
            />
          )}
        </div>
      </main>
    </div>
  );
}
