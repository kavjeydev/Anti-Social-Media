import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express();
app.use(express.json());

app.post("/process-video", (req, res) => {
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    console.log(`${inputFilePath} and ${outputFilePath}`)

    if(!inputFilePath || !outputFilePath){
        res.status(400).send("Bad request, input or output file are null.")
    }
    ffmpeg(inputFilePath)
    .outputOptions("-vf", "scale:-1:360") // convert input to 360p
    .on("end", () => {
        res.status(200).send("Video processed successfully finished.");
    })
    .on("error", (err) => {
        console.log("Error occurred converting video to 360p");
        res.status(500).send(`Internal error ${err}`);
    })
    .save(outputFilePath);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port localhost:${port}`)
})