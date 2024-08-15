from gtts import gTTS
from openai import OpenAI
from datetime import datetime
import requests
import os
import textwrap
from moviepy import *
from moviepy.editor import *
from datetime import datetime
from google.cloud import storage
from my_file import my_api_key

# from gcloud import storage
# from oauth2client.service_account import ServiceAccountCredentials

# VIDEO TITLE PROMPT: generate one boring youtube video idea title

# VIDEO SCRIPT PROMPT: generate a script for a video titled: "[NAME]".
# write in complete sentences without scenes or
# "[script]" or the video title in the response or any scene descriptions.



client = OpenAI(api_key=my_api_key)

now = datetime.now()
date_time = now.strftime("%m%d%Y%H%M%S")

video_files = []
image_paths = []

BUCKET_NAME = "asm-cht-raw-videos"
SOURCE_FILE_PATH = "./final_video.mp4"

CREDENTIALS_FILE = "./credentials.json"


def upload_to_gcs(bucket_name, source_file_path, destination_blob_name, credentials_file):
    # Initialize the Google Cloud Storage client with the credentials
    storage_client = storage.Client.from_service_account_json(credentials_file)

    # Get the target bucket
    bucket = storage_client.bucket(bucket_name)

    # Upload the file to the bucket
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(source_file_path)

    print(f"File {source_file_path} uploaded to gs://{bucket_name}/{destination_blob_name}")

def generate_sentences_to_audio(sentence, index):
    audio_files = []
    if not os.path.exists("./generated_audio"):
        os.mkdir("./generated_audio")

    tts = gTTS(sentence, lang='en')
    audio_path = f"./generated_audio/audio_{index}.mp3"
    tts.save(audio_path)
    audio_files.append(audio_path)

def generate_image(client, sentence, name):
    print(sentence)
    while(True):
        try:
            response = client.images.generate(
                model="dall-e-3",
                prompt=sentence,
                size="1024x1024",
                quality="standard",
                n=1,
            )
        except:
           print("Exception occured.")
           continue

        break

    image_url = response.data[0].url

    if not os.path.exists("./generated_images"):
        os.mkdir("./generated_images")

    image_data = requests.get(image_url).content
    image_path = f"./generated_images/image_{name}.jpg"

    if(name == 3):
        if not os.path.exists("./thumbnail"):
            os.mkdir("./thumbnail")

        print("HERE")
        with open("./thumbnail/thumbnail.png", "wb") as image_file:
            image_file.write(image_data)
        print("HERE2")



    with open(image_path, "wb") as image_file:
        image_file.write(image_data)

    return image_path

def generate_video_idea(client):
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": f"generate one boring youtube video idea title without quotes"}
        ]
    )

    video_title = (completion.choices[0].message.content)
    return video_title


def generate_video_script(client, idea):
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": f"generate a script for a video titled: \"{idea}\".write in complete sentences without scenes or any scene descriptions, only spoken words. Every sentence is allowed as a prompt for dalle-3"}
        ]
    )

    video_script = (completion.choices[0].message.content)

    return video_script

def generate_many_images_and_audio(client, script):
    sentences = textwrap.wrap(script, width=100)
    print(len(sentences))

    for i, sentence in enumerate(sentences):
        path = generate_image(client, sentence, i)
        generate_sentences_to_audio(sentence, i)
        image_paths.append(path)

        # print("Waiting 1 minute now (1 image has been generated)")
        # time.sleep(60)


def create_video(script):
    pass

def delete_files(directory_path_video, directory_path_audio):
    try:
     files = os.listdir(directory_path_video)
     for file in files:
       file_path = os.path.join(directory_path_video, file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All files deleted successfully.")
    except OSError:
        print("Error occurred while deleting video files.")

    try:
     files = os.listdir(directory_path_audio)
     for file in files:
       file_path = os.path.join(directory_path_audio, file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All files deleted successfully.")
    except OSError:
        print("Error occurred while deleting audio files.")

    try:
     files = os.listdir("./generated_videos")
     for file in files:
       file_path = os.path.join("./generated_videos", file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All audio files deleted successfully.")
    except OSError:
        print("Error occurred while deleting audio files.")

    try:
     files = os.listdir("./thumbnail")
     for file in files:
       file_path = os.path.join("./thumbnail", file)
       if os.path.isfile(file_path):
         os.remove(file_path)
     print("All thumbnail files deleted successfully.")
    except OSError:
        print("Error occurred while deleting thumbnail files.")

video_paths = []
def overlay_audio_and_image(image_paths):
   for i, path in enumerate(image_paths):
    image_path = path
    audio_path = f"./generated_audio/audio_{i}.mp3"


    if not os.path.exists("./generated_videos"):
        os.mkdir("./generated_videos")

    video_path = f"./generated_videos/video_{i}.mp4"

    video_paths.append(video_path)

    audio = AudioFileClip(audio_path)
    image = ImageClip(image_path, duration=audio.duration)
    video = image.set_audio(audio)

    video.write_videofile(video_path, fps=24)


    video_files.append(video)

def merge_videos():
   merge_array = []
   for path in video_paths:
      merge_array.append(VideoFileClip(path))

   final_clip = concatenate(merge_array)
   final_clip.write_videofile("./final_video.mp4")


video_idea = generate_video_idea(client) #

delete_files("./generated_images", "./generated_audio")

print(video_idea)

video_script = generate_video_script(client, video_idea)
print(video_script)

generate_many_images_and_audio(client, video_script)

print(image_paths)

overlay_audio_and_image(image_paths)

print(video_files)

merge_videos()

DESTINATION_BLOB_NAME = f"{date_time}-{video_idea}.mp4"

upload_to_gcs(BUCKET_NAME, SOURCE_FILE_PATH, DESTINATION_BLOB_NAME, CREDENTIALS_FILE)

BUCKET_NAME = "asm-thumbnail-bucket"
SOURCE_FILE_PATH = "./thumbnail/thumbnail.png"
DESTINATION_BLOB_NAME = f"{date_time}-{video_idea}.png"
CREDENTIALS_FILE = "./credentials.json"

upload_to_gcs(BUCKET_NAME, SOURCE_FILE_PATH, DESTINATION_BLOB_NAME, CREDENTIALS_FILE)


