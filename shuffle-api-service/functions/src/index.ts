import * as logger from "firebase-functions/logger";
import {initializeApp} from "firebase-admin/app";
import * as functions from "firebase-functions";
import {Firestore} from "firebase-admin/firestore";
import {Storage} from "@google-cloud/storage";
import {onCall} from "firebase-functions/v2/https";

initializeApp();

const firestore = new Firestore();
const storage = new Storage();

const rawGCSBucketName = "asm-cht-raw-videos";

const videoCollectionId = "videos";


export interface Video {
  id?: string,
  uid?: string,
  filename?: string,
  status?: "processing" | "processed",
  title?: string,
  description?: string,
  thumbnail?: string
}

export interface Thumbnail {
  id?: string,
  uid?: string,
  filename?: string,
}

export const createUser = functions.auth.user().onCreate((user) => {
  const userInfo = {
    uid: user.uid,
    email: user.email,
    photoUrl: user.photoURL,

  };

  firestore.collection("users").doc(user.uid).set(userInfo);

  logger.info(`A user was created: ${JSON.stringify(userInfo)}`);

  return;
});

export const generateUploadUrl = onCall({maxInstances: 1}, async (request) => {
  // check if user is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated",
    );
  }

  const auth = request.auth;
  const data = request.data;
  const bucket = storage.bucket(rawGCSBucketName);

  // Generate a unique filename for upload
  const fileName = `${auth.uid}-${Date.now()}.${data.fileExtension}`;

  // Get a v4 signed URL for uploading file
  const [url] = await bucket.file(fileName).getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
  return {url, fileName};
});

export const getVideos = onCall({maxInstances: 1}, async () => {
  const querySnapshot =
    await firestore.collection(videoCollectionId).limit(10).get();
  return querySnapshot.docs.map((doc) => doc.data());
});



