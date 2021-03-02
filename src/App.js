import React, { useEffect, useState } from 'react';
import './App.css';

// Render each post
function renderPost(post){
  const { data: { title, url, id } } = post

  return (
    <div className="stupid_widget__post" key={id}>
      <a href={url} className="stupid_widget__title" target="_blank" rel="noopener noreferrer">
        <img src={url} alt={title} className="stupid_widget__img" />
      </a>
    </div>
  )
}

// Filter, since reddit always returns stickied posts up top
function nonStickiedOnly(post){
  return !post.data.stickied
}

function App({ domElement }) {
  const subreddit = domElement.getAttribute("data-subreddit")
  const [loading, setLoading] = useState();
  const [error, setError] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from reddit
    setLoading(true)
    fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setData(data.data.children.slice(0, 10));
      })
      .catch((e) => {
        console.log(e)
        setLoading(false);
        setError('error fetching from reddit');
      });
  }, [ subreddit ])

  return (
    <div className="stupid_widget__app">
      <h1 className="stupid_widget__header">
        CUTE DOG PICTURES
      </h1>
      <div className="stupid_widget__inner">
        {loading && "Loading..."}
        {error && error}
        {!!data.length && data.filter(nonStickiedOnly).map(renderPost)}
      </div>
    </div>
  );
}

export default App;
