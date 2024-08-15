'use client';

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react';
import styles from "./page.module.css"

export default function Watch() {
  const videoPrefix = 'https://storage.googleapis.com/asm-cht-processed-videos/';
  const videoSrc = useSearchParams().get('v');

  return (

    <div>
      { <video className={styles.video} controls src={videoPrefix + videoSrc}/> }
    </div>
  );
}
