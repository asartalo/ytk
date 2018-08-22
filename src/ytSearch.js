import youtubeSearch from 'youtube-api-v3-search';

export default function ytSearch(query) {
  const options = {
    q: query,
    part: 'snippet',
    type: 'video',
  };

  return youtubeSearch(process.env.REACT_APP_YOUTUBE_API_KEY, options).then(
    result => {
      return result.items.map(({ etag, id, snippet }) => ({
        etag,
        videoId: id.videoId,
        title: snippet.title,
        publishedAt: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        thumbnails: snippet.thumbnails,
      }));
    }
  );
}
