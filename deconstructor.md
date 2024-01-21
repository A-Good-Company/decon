Basic idea:
- Accept audio or video file
- Use whisper model to transcribe the audio
- Save the file as ai-en-ar.srt if english and arabic are detected languages
- tr-en.srt has the translation of the original language, line by line, to a different language (here english)


P0:
- Lyrics
- Translation

P1: 
- UI to modify lyrics while the audio/plays



# readme.md


# Transcription and Translation Application

This application accepts audio or video files, transcribes the content using OpenAI's Whisper ASR system, and saves the transcription as a subtitle (SRT) file. If both English and Arabic languages are detected in the content, the output file is named `ai-en-ar.srt`. The application also generates a translated version of the original transcription to another language (here English) and saves it as `tr-en.srt`.

In addition to transcription and translation, the application also provides an interactive user interface (UI) to modify the transcribed lyrics while the audio or video is playing. This allows for real-time editing and correction of the transcription and translation as needed.

## Features
- Audio/Video Transcription: Transcribe audio/video files into textual format.
- Multi-language Support: The application supports both English and Arabic languages.
- Real-time Editing: Modify the transcribed lyrics in real-time while the audio/video is playing.
- Translation: Translate the original

 transcription to another language.

## Usage
To use this application, follow the steps below:

1. Upload your audio or video file.
2. Wait for the application to transcribe the content using OpenAI's Whisper ASR system.
3. Once transcribed, the application will automatically save the transcription as a subtitle (SRT) file named `ai-en-ar.srt`.
4. The translation of the original transcription to English (or any other chosen language) will also be automatically generated and saved as `tr-en.srt`.
5. Use the interactive UI to modify and correct any errors in the transcription while listening/watching your audio/video file.

## Requirements
- Python 3.x
- OpenAI API Key for Whisper ASR system

## Installation
Clone this repository and navigate to its directory, then install dependencies by running:

```bash
pip install -r requirements.txt
```

## License
This project is licensed under MIT license.

Please note: This application uses OpenAI's Whisper ASR system, which is a separate service provided by OpenAI with its own costs and terms of service.
