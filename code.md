```python
import os
import datetime
from faster_whisper import WhisperModel

model_size = "large-v3"

# Run on GPU with FP16
model = WhisperModel(model_size, device="cuda", compute_type="float16")

file_path = input("Enter your file path: ")

segments, info = model.transcribe(file_path, beam_size=5, language='hi')

print("Detected language '%s' with probability %f" % (info.language, info.language_probability))

output_file_path = os.path.splitext(file_path)[0] + "-" + info.language + ".srt"

def convert_seconds_to_time_str(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds_int = int(seconds % 60)
    milliseconds_int = int((seconds * 1000) % 1000)
    return '{:02}:{:02}:{:02},{:03}'.format(hours, minutes, seconds_int, milliseconds_int)

with open(output_file_path, 'w') as f:
    for i, segment in enumerate(segments):
        f.write(str(i+1) + "\n")
        start_time_str = convert_seconds_to_time_str(segment.start)
        end_time_str = convert_seconds_to_time_str(segment.end)
        f.write(start_time_str.replace(".", ",") + " --> " + end_time_str.replace(".", ",") + "\n")
        print(segment.text)
        f.write(segment.text + "\n\n")
        
print("Subtitle file saved as: ", output_file_path)
```


This gives error when trying to write hindi letters


```
Detected language 'hi' with probability 1.000000
 आ रे ना आ ना रे
Traceback (most recent call last):
  File "C:\workstation\decon\pydecon\fasterwhisper.py", line 32, in <module>
    f.write(segment.text + "\n\n")
  File "C:\Users\Munk\.conda\envs\py310\lib\encodings\cp1252.py", line 19, in encode
    return codecs.charmap_encode(input,self.errors,encoding_table)[0]
UnicodeEncodeError: 'charmap' codec can't encode character '\u0906' in position 1: character maps to <undefined>
```




The error you're getting is because your python script is trying to write unicode characters (Hindi letters in this case) to a file using a character encoding (cp1252) that does not support those characters. 

To fix this, you should specify the encoding when opening the file for writing. The 'utf-8' encoding should work for Hindi:

```python
with open(output_file_path, 'w', encoding='utf-8') as f:
```

This line of code tells Python to use utf-8 encoding when writing to the file, which supports a much wider range of characters including Hindi letters.