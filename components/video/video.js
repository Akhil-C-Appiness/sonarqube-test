"use client"
import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';

function VideoPlayer(props) {
  const videoRef = useRef();

  useEffect(() => {
    const player = videojs(videoRef.current, props.options, () => {
      console.log('Player ready!');
    });

    return () => {
      if (player) {
        player.dispose();
      }
    };
  }, [props.options]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js" />
    </div>
  );
}

export default VideoPlayer;
