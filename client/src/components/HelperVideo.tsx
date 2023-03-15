import React, { useContext, useEffect, useRef } from 'react';
import { Context } from '../Context';
// @ts-ignore
import { Atrament } from 'atrament';

const HelperVideo = () => {
  const {
    setStream,
    call,
    localVideo,
    remoteVideo,
    leaveCall,
    setStroke,
    stream,
  } = useContext(Context);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let videoWidth = window.innerWidth;
  let videoHeight = window.innerHeight;

  useEffect(() => {
    if (call?.accepted && localVideo?.current) {
      localVideo.current.srcObject = stream as MediaStream;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }

    const sketchpad = new Atrament(canvasRef.current, {
      color: 'orange',
    });

    sketchpad.recordStrokes = true;
    sketchpad.smoothing = 1.3;
    // @ts-ignore
    sketchpad.addEventListener('strokerecorded', ({ stroke }) =>
      setStroke!(stroke)
    );
  }, [call]);

  if (call)
  return (
    // @ts-ignore
    <div className="video-container" style={{ videoWidth }}>
      {call.accepted && !call.ended && (
        <button className="button end-call" onClick={leaveCall}>
          End Call
        </button>
      )}

      <video className="small-video" playsInline ref={localVideo} autoPlay />

      <canvas ref={canvasRef} id="sketchpad" className="sketchpad" />
      <video
        className="big-video"
        playsInline
        muted
        ref={remoteVideo}
        autoPlay
      />
    </div>
  );
};

export default HelperVideo;
