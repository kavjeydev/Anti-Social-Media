'use client';

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/asm-cht-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  return (

    <div>
      <h1>Watch Page</h1>
      { <video controls src={videoPrefix + videoSrc}/> }
    </div>
  );
}
