import React, { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../Context';
import ImageStack from './ui/ImageStack';
import { Typography } from '@mui/material';
import { StyledButton } from './ui/StyledComponents';
import { uploadImageToCloudinary } from '../lib/ImageApi';
import AR from './AR';

const ClientVIdeo = () => {
  const {
    currentUser,
    answerCall,
    localVideo,
    remoteVideo,
    call,
    leaveCall,
    stream,
  } = useContext(Context);
  const [screenshots, setScreenshots] = useState<any[]>([]);

  const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined);

  let videoWidth = window.innerWidth;
  let videoHeight = window.innerHeight;

  useEffect(() => {
    if (call && call.accepted) {
    if (localVideo && localVideo.current) localVideo.current.srcObject = stream as MediaProvider;
      console.log({ localVideo });
      console.log({ remoteVideo });
    }
    console.log(call);
  }, [call]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
    }
  }, []);

  const handleScreenshot = async () => {
    const canvas = canvasRef.current;
    const video = remoteVideo?.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && video && canvas) {

      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      // toDataUrl param was originally { format: 'png' }
      const dataUrl = canvas.toDataURL('png');
      canvas.remove();

      const screenshotUrl = await uploadImageToCloudinary(
        dataUrl,
        currentUser!.username
        );
        setScreenshots((prevUrls) => [...prevUrls, screenshotUrl]);
      }
  };

  if (call)
  return (
    <div>
      <div className="center">
        {!call.incoming && (
          <Typography variant="h4">
            Despair not, <br />
            <span className="orange">help</span> is on the way!
          </Typography>
        )}

        {call.incoming && !call.accepted && (
          <>
            <Typography variant="h4">
              <span className="orange">Help</span> is here!
            </Typography>
            <StyledButton
              onClick={answerCall}
              variant="contained"
              style={{
                margin: '0.5rem',
                zIndex: 1000,
              }}
            >
              Accept help
            </StyledButton>
          </>
        )}
      </div>

      {call.accepted && !call.ended && (
        <div className="video-container">
          {screenshots.length > 0 && <ImageStack screenshots={screenshots} />}

          <button onClick={handleScreenshot} className="button save-step">
            Screenshot
          </button>
          <button onClick={leaveCall} className="button end-call">
            End Call
          </button>

          <video
            className="small-video"
            playsInline
            muted
            ref={remoteVideo}
            autoPlay
          />
          {/* @ts-ignore */}
          <AR ref={canvasRef} />
          <video
            className="big-video"
            playsInline
            muted
            ref={localVideo}
            autoPlay
          />
        </div>
      )}
    </div>
  );
};

export default ClientVIdeo;
