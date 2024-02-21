## [Decon]struct

## Problem Statement

 The modern digital era has brought forth an abundance of information and content across various media formats, including audio and text. With this surge in content, there arises a need for tools that can assist in deconstructing, analyzing, and reconstructing this media to make it more accessible, understandable, and customizable for different audiences. The problem we aim to address with Decon is the challenge faced by users in managing and interacting with media content efficiently. 

Specific challenges include:

1. Difficulty in isolating specific elements of audio tracks, such as vocals or instruments, which can be essential for music producers, educators, or enthusiasts wanting to create karaoke tracks, remixes or to simply focus on a particular aspect of the music.
2. The barrier language presents in understanding and enjoying content fully. This includes not just translating lyrics or dialogue but also transcribing audio into text for further analysis or accessibility purposes.
3. Enhancing textual content through correction, translation, transliteration, explanation, summarization, or even generating new content based on existing patterns.
4. The need for a unified platform that integrates various AI tools to address these challenges seamlessly without requiring users to navigate multiple applications or services.

## Proposed Solution

To tackle the aforementioned challenges effectively, we propose the development of Decon - a multimedia workbook application designed as a one-stop solution integrating various AI-powered tools tailored specifically for audio and textual content manipulation.

### Audio Features:

- **Stem Separation:** Utilizing Spleeter's capabilities to split audio files into individual stems (vocals, drums, bass etc.), enabling users to isolate specific elements of a track.
- **Voice to Text:** Incorporating Whisper ASR technology for accurate speech recognition and transcription services. This feature allows users to convert spoken words into written text efficiently.
- **Pitch Adjustment:** Offering functionality to adjust the pitch of audio files without significantly affecting their tempo or quality. This could be particularly useful for music practice or analysis.

### Text Features:

- **Correction & Translation:** Implementing advanced NLP models like GPT-4 for real-time correction of grammatical errors and translating text between multiple languages accurately.
- **Transliteration & Explanation:** Facilitating easy conversion from one script to another while maintaining phonetic accuracy (transliteration) and providing explanations for complex terms or phrases when needed.
- **Summarization & Content Generation**: Employing AI models capable of summarizing long pieces of text into concise versions without losing essential information and predicting next lines or generating new content based on prompts provided by the user.

### Frontend & Backend Technologies:

- **Frontend Development:** Leveraging Vue3 framework's capabilities for building a user-friendly interface that is responsive and intuitive across devices.
  
- **Backend Services:** Python will serve as the core programming language due to its extensive support for data manipulation and integration with AI models like Spleeter for stem separation and Whisper ASR for speech recognition.

## Use Cases

Decon aims to cater to a wide range of users including but not limited to:

- Music enthusiasts looking to create remixes or karaoke versions by isolating vocals/instruments from tracks.
- Language learners wanting translations/transcriptions of songs or dialogues in foreign languages.
- Content creators seeking tools for summarizing meetings/discussions quickly or generating lyrical ideas based on given prompts.
  


# Project planning:

So the project has a front end and a back end.


## Frontend (UI)

Front end is organized in **Nodes**:
- Text node [P0]
- Audio Node [P0]
- Video Node [P0]
- Image Node [P1]

Each node is can be processed in a particular way.

1. Text Node Process options:
	1. LLM Prompt: Shows a list of prompts to select further processing for. Includes prompts like translate, correct and describe corrections > Returns text node
	2. Text to Audio: Shows options for text generation, like Voice, Speed, Mood etc and sends parameters to backend > Returns Audio node
2. Audio Node process options:
	1. Split audio: Shows which stems to select and sends file to backend for processing. > Returns Audio node [P0]
	2. Transcribe: Transcribes text from audio, has option to mention language and select model size. > Returns Text node [P0]
	3. Separate speakers: Separates the different speakers using AI > Returns Audio node [P1]
	4. Audio to Audio: Use AI to change the Speaker and the mood, while keeping the timing > Returns Audio Node [P2]
	5. Change Pitch: Change the pitch of the audio > Return Audio node [P1]
3. Video Node process options: 
	1-5. All of the Audio process options
	6. Deep Mask: Enables replacing face , and gives option to decide Face Swap options > Return Video Node [P1] 
4. Image Node Process Options
	1. Deep Mask: Enables replacing face , and gives option to decide Face Swap options > Return Image Node [P1]


Apart from the nodes, **Settings** options will be available.

- OpenAI API Key
- Backend Details
- Other settings
- Share [p3]
- Print [p2]



## Backend


Backend, designed in python has the following components:

- Audio: Split
- Audio: Transcribe
- Audio: Separate Speakers
- Audio: Change Pitch
- Video: Deep Mask for Face Swap
- Image: Deep Mask for Face Swap

Repeating the items with priorities and description:

- Audio: Split > Accepts audio input , and parameters, to split input into multiple output [P0]
- Audio: Transcribe > Utilizes Whisper ASR to transcribe speech in audio files to text, offering various model sizes for different levels of accuracy and speed [P0]
- Audio: Separate Speakers > Employs advanced AI techniques to distinguish and separate multiple speakers within an audio file, facilitating clearer audio analysis or transcription [P1]
- Audio: Change Pitch > Allows users to adjust the pitch of audio files while aiming to preserve the original tempo and quality, useful for musical analysis or practice [P1]
- Video: Deep Mask for Face Swap > Integrates state-of-the-art deep learning models to replace faces in videos with selected alternatives, providing options for users to customize the output according to their needs [P1]
- Image: Deep Mask for Face Swap > Similar to the video face swap functionality but tailored for static images. This feature leverages cutting-edge AI techniques to seamlessly replace faces in photographs or any other image content [P1]

Here is how you should plan the roadmap:

Fields:
- Area: 
	- Backend
	- Server
	- UI: Text node
	- UI: Audio Media
	- UI: Video Media
	- UI: Image Media
	- UI:General
	- Planning
- Priority:
	- P0
	- P1
	- P2
	- P3+

| Project Item Title | Details | Area | Priority |
| ---- | ---- | ---- | ---- |
| Split Audio Implementation | Develop a function to take audio input and parameters to split the input into multiple outputs, leveraging the capabilities of tools like Spleeter. | Backend | P0 |
| Speech Transcription Service | Integrate Whisper ASR for converting speech in audio files to text, including options for model size selection based on required accuracy and speed. | Backend | P0 |
| Speaker Separation Feature | Implement advanced AI algorithms to identify and separate multiple speakers within an audio file, enhancing the clarity of transcriptions and analyses. | Backend | P1 |
| Pitch Adjustment Tool | Create a tool for adjusting the pitch of audio files that aims to maintain the original tempo and quality, utilizing digital signal processing techniques. | Backend | P1 |
| Video Face Swap with Deep Mask | Incorporate deep learning models to enable face swapping in videos, providing customization options for users to achieve desired outcomes. | Backend | P1 |
| Image Face Swap with Deep Mask | Leverage AI techniques similar to those used in video face swap but optimized for static images, allowing users to seamlessly replace faces in images. | Backend | P1 |
| Text Node UI Development | Design and implement the user interface for text node processing including features like LLM prompts, text-to-audio conversion, and others. | UI: Text Node | P0 |
| Audio Node UI Development | Develop the UI components for audio node processing such as split audio, transcribe text from audio, change pitch, etc. | UI: Audio Media | P0 |
| RFQ Video Node Processing Options | Design the UI for video node processing integrating both audio processing options and additional video-specific features like deep mask face swap. | UI: Video Media | P0 |
| RFQ Image Node Processing Options | Create the user interface for image node processing including features like deep mask face swap tailored specifically for images. | UI: Image Media | P1 |
| RFQ Settings Menu Implementation | Develop a comprehensive settings menu allowing users to configure API keys, backend details, and other application-wide settings. | UI:General | P2 |
| RFQ Sharing Feature Development | Implement functionality to enable users to share their projects directly from the application through various platforms. | UI:General | P3+ |
| RFQ Printing Option Integration | Integrate capabilities allowing users to print their projects or export them in printable formats directly from the application. | UI:General | P2 |
| RFQ Overall Project Planning and Coordination | Conduct detailed planning sessions focusing on project scope definition, timeline establishment, resource allocation, and milestone setting.  Planning | P0 |  |

Note: RFQ stands for "Request For Quotation", indicating areas where further specification or clarification might be needed during development planning stages.