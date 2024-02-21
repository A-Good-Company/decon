import os
import datetime
from faster_whisper import WhisperModel

model_size = "large-v3"

# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")
while(True) :
    file_path = input("Enter your file path: ")

    segments, info = model.transcribe(file_path)
    # segments, info = model.transcribe(file_path, language='hi')

    print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

    output_file_path = os.path.splitext(file_path)[0] + "-" + info.language + ".srt"

    def convert_seconds_to_time_str(seconds):
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds_int = int(seconds % 60)
        milliseconds_int = int((seconds * 1000) % 1000)
        return '{:02}:{:02}:{:02},{:03}'.format(hours, minutes, seconds_int, milliseconds_int)

    with open(output_file_path, 'w', encoding='utf-8') as f:
        for i, segment in enumerate(segments):
            f.write(str(i+1) + "\n")
            start_time_str = convert_seconds_to_time_str(segment.start)
            end_time_str = convert_seconds_to_time_str(segment.end)
            f.write(start_time_str.replace(".", ",") + " --> " + end_time_str.replace(".", ",") + "\n")
            print(segment.text)
            f.write(segment.text + "\n\n")
            
    print("Subtitle file saved as: ", output_file_path)


