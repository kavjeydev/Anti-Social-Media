import {getFunctions, httpsCallable} from "firebase/functions";
import { functions } from "./firebase";
import {Storage} from "@google-cloud/storage";

const generateUploadUrl = httpsCallable(functions, 'generateUploadUrl');
const getVideosFunction = httpsCallable(functions, 'getVideos');

export interface Video {
  id: string,
  uid?: string,
  filename?: string,
  status?: 'processing' | 'processed',
  title: string,
  description?: string,
  thumbnail: string
}

export interface Thumbnail {
    id?: string,
    uid?: string,
    filename?: string,
}

export async function getVideos() {
    const response: any = await getVideosFunction();
    console.log("RESPONSE", response)
    return response.data as Video[];
  }




// export async function getThumbnails(){
//     // The ID of your GCS bucket
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
//   const options = {
//     destination: destFileName,
//   };

//   // Downloads the file to the destination file path
//   await storage.bucket(bucketName).file(fileName).download(options);

//   console.log(
//     `gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
//   );
// }

//     downloadFile().catch(console.error);
// }


export async function uploadVideo(file: File){
    const response: any = await generateUploadUrl({
        fileExtension: file.name.split('.').pop(),
    });

    // upload video via signed url
    await fetch(response?.data?.url, {
        method: 'PUT',
        body: file,
        headers:{
            'Content-Type': file.type
        }
    });

    return;
}



