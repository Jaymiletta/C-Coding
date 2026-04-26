import React from 'react';
import {Composition} from 'remotion';
import {HeatPumpVideo, TOTAL_FRAMES} from './Composition';
import {GDGCommercial, GDG_TOTAL_FRAMES} from './GDGCommercial';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeatPumpVideo"
        component={HeatPumpVideo}
        durationInFrames={TOTAL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="GDGCommercial"
        component={GDGCommercial}
        durationInFrames={GDG_TOTAL_FRAMES}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
