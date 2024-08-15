import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from "./storage";
import { isVideoNew, setVideo } from "./firestore";

setupDirectories();

const app = express();
app.use(express.json());


app.post("/process-video", async (req, res) => {
    let data;
  try {
    const message = Buffer.from(req.body.message.data, 'base64').toString('utf8');
    data = JSON.parse(message);
    console.log(data)
    if (!data.name) {
      throw new Error('Invalid message payload received.');
    }
  } catch (error) {
    console.error(error);
    return res.status(400).send('Bad Request: missing filename.');
  }

  const inputFileName = data.name;
  const outputFileName = `processed-${inputFileName}`;
  const videoName = inputFileName.split('.')[0]; // video format is <video_name>.<type>

  console.log("POST")
  if (!isVideoNew(videoName)){
    return res.status(400).send("Bad Request: Video already exists and is processing.")
  }
  else{
    setVideo(videoName, {
      id: videoName,
      uid: videoName.split('-')[0],
      status: "processing",
      title: videoName.split('-').slice(1),
      thumbnail: videoName.split('-').slice(1) + ".png",
    })
  }

  //Downloading raw video
  await downloadRawVideo(inputFileName);

  await setVideo(videoName, {
    status: "processed",
    filename: outputFileName,
  })

  try{
    await convertVideo(inputFileName, outputFileName);
  }
  catch(err){
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    console.log(err)
    return res.status(500).send("Internal Server Error: video processing failed.")
  }

  //Upload processed video
  await uploadProcessedVideo(outputFileName);

  await Promise.all([
    deleteRawVideo(inputFileName),
    deleteProcessedVideo(outputFileName)
  ]);

  return res.status(200).send("Video Processed Successfully")

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port localhost:${port}`)
})