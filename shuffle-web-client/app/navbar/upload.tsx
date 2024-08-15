'use client';

import { Fragment } from "react";
import { uploadVideo } from "../firebase/functions";

import styles from "./upload.module.css";

// export async function getThumbnails(){
//   // The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// // The ID of your GCS file
// const fileName = 'your-file-name';

// // The path to which the file should be downloaded
// const destFileName = '/local/path/to/file.txt';

// // Imports the Google Cloud client library
// const {Storage} = require('@google-cloud/storage');

// // Creates a client
// const storage = new Storage();

// async function downloadFile() {
// const options = {
//   destination: destFileName,
// };

// // Downloads the file to the destination file path
// await storage.bucket(bucketName).file(fileName).download(options);

// console.log(
//   `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
// );
// }

//   downloadFile().catch(console.error);
// }

export default function Upload() {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.item(0);
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const response = await uploadVideo(file);
      alert(`File uploaded successfully. Server responded with: ${JSON.stringify(response)}`);
    } catch (error) {
      alert(`Failed to upload file: ${error}`);
    }
  };

  return (
    <Fragment>
      <input id="upload" className={styles.uploadInput} type="file" accept="video/*" onChange={handleFileChange} />
      <label htmlFor="upload" className={styles.uploadButton}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </label>
    </Fragment>
  );
}
