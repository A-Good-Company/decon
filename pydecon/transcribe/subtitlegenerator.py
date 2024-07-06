import os
import datetime
from faster_whisper import WhisperModel

class SubtitleGenerator:
    def __init__(self, model_size="large-v3"):
        # Run on GPU with FP16
        self.model = WhisperModel(model_size, device="cuda", compute_type="float16")

    def convert_seconds_to_time_str(self, seconds):
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds_int = int(seconds % 60)
        milliseconds_int = int((seconds * 1000) % 1000)
        return '{:02}:{:02}:{:02},{:03}'.format(hours, minutes, seconds_int, milliseconds_int)

    def transcribe_audio(self, file_path):
        segments, info = self.model.transcribe(file_path, language='hi', word_timestamps=True)
        return segments, info

    def generate_subtitle_file(self, segments, info, file_path):
        output_file_path = os.path.splitext(file_path)[0] + "-" + info.language + ".srt"

        with open(output_file_path, 'w', encoding='utf-8') as f:
            for i, segment in enumerate(segments):
                f.write(str(i+1) + "\n")
                start_time_str = self.convert_seconds_to_time_str(segment.start)
                end_time_str = self.convert_seconds_to_time_str(segment.end)
                f.write(start_time_str.replace(".", ",") + " --> " + end_time_str.replace(".", ",") + "\n")
                f.write(segment.text + "\n\n")
                print(segment.text)

        return output_file_path

if __name__ == "__main__":
    subtitle_generator = SubtitleGenerator()
    file_path = input("Enter your file path: ")
    segments, info = subtitle_generator.transcribe_audio(file_path)
    print("Detected language '%s' with probability %f" % (info.language, info.language_probability))
    output_file_path = subtitle_generator.generate_subtitle_file(segments, info, file_path)
    print("Subtitle file saved as: ", output_file_path)

