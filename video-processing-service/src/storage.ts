import { Storage } from '@google-cloud/storage'
import fs from 'fs'
import ffmpeg from 'fluent-ffmpeg'

const storage = new Storage();

const rawGCSBucketName = 'asm-cht-raw-videos';
const processedGCSBucketName = 'asm-cht-processed-videos';

const localRawPath = './raw-videos';
const localProcessedPath = './processed-videos';


// download original files in a raw folder and processed in another folder
export function setupDirectories(){
    ensureDirectoryExistance(localProcessedPath);
    ensureDirectoryExistance(localRawPath);
}

export function convertVideo( rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve, reject) => {
        ffmpeg(`${localRawPath}/${rawVideoName}`)
        .outputOptions("-vf", "scale=-1:360") // convert input to 360p
        .on("end", () => {
            console.log("Video processed successfully finished.");
            resolve();
        })
        .on("error", (err) => {
            console.log("Error occurred converting video to 360p");
            reject(err);
        })
        .save(`${localProcessedPath}/${processedVideoName}`);
    })

}

export async function downloadRawVideo(rawName: string){
    await storage.bucket(rawGCSBucketName)
        .file(rawName)
        .download({destination: `${localRawPath}/${rawName}`});

    console.log(
        `gs://${rawGCSBucketName}/${rawName} downloaded to ${localRawPath}/${rawName}`
    );
}

export async function uploadProcessedVideo(processedName: string){
    const bucket = storage.bucket(processedGCSBucketName);

    await bucket.upload(`${localProcessedPath}/${processedName}`, {
        destination: processedName
    });

    console.log(
        `gs://${processedGCSBucketName}/${processedName} downloaded to ${localProcessedPath}/${processedName}`
    );

    await bucket.file(processedName).makePublic();
}

function deleteFile(filePath: string): Promise<void>{
    return new Promise((resolve, reject) => {
        if(fs.existsSync(filePath)){
            fs.unlink(filePath, (err) => {
                if(err){
                    console.log(`Failed to delete file at ${filePath}`);
                    reject(err);
                }
                else{
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            })
        }
        else{
            console.log(`File ${filePath} does not exist, skipping delete.`);
            resolve();
        }
    })
}

export function deleteRawVideo(fileName: string){
    deleteFile(`${localRawPath}/${fileName}`);
}

export function deleteProcessedVideo(fileName: string){
    deleteFile(`${localProcessedPath}/${fileName}`);
}

function ensureDirectoryExistance(path: string){
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true }); // recursive: true enables creating nested directories
        console.log(`Directory created at ${path}`);
      }
}
