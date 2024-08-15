import Image from "next/image";
import { getVideos } from "./firebase/functions";
import Link from "next/link";
import styles from "./page.module.css"
import { Suspense } from "react";

export default async function Home() {
  const videos = await getVideos();


  /*
**
** This is a simple code for downloading an object from Google Cloud Storage in NodeJS.
** Before downloading, remember to set up a GOOGLE_APPLICATION_CREDENTIALS environment variable that points to your service-account.json key.
**
*/

// import the Google Cloud Storage client library
const {Storage} = require('@google-cloud/storage');

// define the Google Cloud Storage bucket name
const bucketName = 'asm-thumbnail-bucket';



// create a client
const storage = new Storage();

// define the function for file download
async function downloadFile(video_name: string) {
  // define the path and name of Google Cloud Storage object to download
  const srcFilename = `${video_name}.png`;

// define the destination folder of downloaded object
  const destFilename = `./public/${video_name}.png`;

    // passing the options
    const options = {
        destination: destFilename,
    };

    // download object from Google Cloud Storage bucket
    await storage.bucket(bucketName).file(srcFilename).download(options);

    // [optional] a good log can help you in debugging
    console.log(
        "The object " + srcFilename +
        " coming from bucket " +  bucketName +
        " has been downloaded to " + destFilename
    );
}

// call the download function and be ready to catch errors


  videos.forEach(async video => {
    await downloadFile(video.id).catch(console.error);
  });

  return (
    <main className={styles.pageMain}>
      {
        videos.map((video) => (

            <div className={styles.pageDiv} key={video.id}>
              <Link href={`/watch?v=${video.filename}`} key={video.id}>
            <Image src={`/${video.id}.png`} alt='video' width={240} height={160}
              className={styles.thumbnail} />
              <h3 className={styles.title}>{video.title}</h3>
          </Link>

          </div>

        ))
      }
    </main>
  )
}

export const revalidate = 30;
