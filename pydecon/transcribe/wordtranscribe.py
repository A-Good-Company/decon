import whisper_timestamped as whisper

file_path = input("Enter your file path: ")
audio = whisper.load_audio(file_path)

model = whisper.load_model("large-v3", device="cpu")

result = whisper.transcribe(model, audio, language="hi",  vad="auditok")

import json
print(json.dumps(result, indent = 2, ensure_ascii = False))


