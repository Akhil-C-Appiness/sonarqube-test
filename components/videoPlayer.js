import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { ExitFullScreenIcon, EnterFullScreenIcon, ZoomInIcon, SpeakerLoudIcon, ZoomOutIcon, SpeakerQuietIcon } from '@radix-ui/react-icons'

function VideoPlayer(props) {
  const playerWrapperRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mute,setMute] = useState(true)
  useEffect(() => {
    const handleFullscreenChange = () => {
        if(!props.gridFullScreen){
            setIsFullscreen(!!document.fullscreenElement);
        }
      
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleMaximizeMinimize = () => {
    if (playerWrapperRef.current) {
      const playerWrapper = playerWrapperRef.current;
      if (!document.fullscreenElement) {
        if (playerWrapper.requestFullscreen) {
          playerWrapper.requestFullscreen();
        } else if (playerWrapper.mozRequestFullScreen) { /* Firefox */
          playerWrapper.mozRequestFullScreen();
        } else if (playerWrapper.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          playerWrapper.webkitRequestFullscreen();
        } else if (playerWrapper.msRequestFullscreen) { /* IE/Edge */
          playerWrapper.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) { /* Firefox */
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari & Opera */
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
          document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    }
  };
  const handleZoomIn = () => {
    setZoomLevel(prevZoom => prevZoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel(prevZoom => Math.max(prevZoom - 0.1, 0.1)); 
  };
  return (
    <div ref={playerWrapperRef} className='relative h-full w-full'>
      <ReactPlayer
        url={`${props.url}`}
        muted={mute}
        playing={true}
        width="100%"
        height="100%"
        className="h-fit"
        onProgress={props.onProgress}
        onPlay={props.onPlay}
        onPause={props.onPause}
        onEnded={props.onEnded}
        style={{ transform: `scale(${zoomLevel})` }}
      />
      <div className='absolute top-0 left-0 w-full h-full flex items-end  gap-4 justify-end p-4'>
        <button onClick={()=>setMute(false)} className={`z-30  text-white opacity-50 rounded-xl transition-all p-1 ${isFullscreen&&!props.gridFullScreen?'w-8 h-8':'w-5 h-5'} `} disabled={mute ? false : true}>
          <SpeakerLoudIcon/>
        </button>
        <button onClick={()=>setMute(true)} className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${isFullscreen&&!props.gridFullScreen?'w-8 h-8':'w-5 h-5'} `} disabled={mute ? true : false}>
        <SpeakerQuietIcon/>
        </button>
        {/* <button onClick={handleZoomIn} className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${isFullscreen&&!props.gridFullScreen?'w-8 h-8':'w-5 h-5'} `}>
          <ZoomInIcon/>
        </button>
        <button onClick={handleZoomOut} className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${isFullscreen&&!props.gridFullScreen?'w-8 h-8':'w-5 h-5'} `}>
          <ZoomOutIcon/>
        </button> */}
        <button onClick={handleMaximizeMinimize} className={`z-30  text-white  opacity-50 rounded-xl transition-all p-1 ${isFullscreen&&!props.gridFullScreen?'w-8 h-8':'w-5 h-5'} `}>
            {isFullscreen && !props.gridFullScreen ?  <ExitFullScreenIcon className='w-full h-full' /> :  <EnterFullScreenIcon className='w-full h-full' /> }
        </button>
      </div>
    </div>
  );
}

export default VideoPlayer;
