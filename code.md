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



`agents/image2text.py`
This code takes an image location as input and performs OCR on it. It supports most languages including English, Arabic and Chinese


```



It seems that you are providing details about a Python script that performs Optical Character Recognition (OCR) on images. However, you have not provided the actual code for it. If you would like to implement OCR in Python, one popular library for this task is `pytesseract`, which is a Python wrapper for Google's Tesseract-OCR Engine.

Below is an example of how you might write a simple Python script to perform OCR on an image using `pytesseract`. Before running the code, make sure to install the `pytesseract` package and Tesseract-OCR itself.

You can install `pytesseract` using pip:

```bash
pip install pytesseract
```

For Tesseract-OCR, follow the installation instructions specific to your operating system: https://github.com/tesseract-ocr/tesseract

Once installed, here's an example script that uses `pytesseract`:

```python
import pytesseract
from PIL import Image

# Define the path to your tesseract executable if it's not in your PATH already.
# Only needed if pytesseract doesn't find your tesseract installation.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def perform_ocr(image_path):
    # Open an image using PIL
    image = Image.open(image_path)
    
    # Perform OCR on the opened image
    text = pytesseract.image_to_string(image, lang='eng')  # Use 'chi_sim' for Chinese or 'ara' for Arabic
    
    return text

# Input image path from user
image_location = input("Enter your image location: ")

# Perform OCR and print results
extracted_text = perform_ocr(image_location)
print(extracted_text)
```

In this script, we use the `image_to_string` function provided by `pytesseract`, passing in our image and specifying the language of the text we expect to be on the image. The language codes such as 'eng' for English, 'chi_sim' for Simplified Chinese, and 'ara' for Arabic must be used accordingly.

Remember that Tesseract-OCR works best with high-resolution images with clear text. The accuracy of OCR can vary based on the quality of the input image and the complexity of its content.


Is it possible to autodetect the language and not need to specify?

 Yes, Tesseract-OCR has the ability to auto-detect the language in an image when performing OCR. To use this feature, you can pass the `lang` parameter with the value 'script/Latin' (for Latin script languages) or 'script/Hangul' (for Korean), etc., depending on which script you want Tesseract to recognize and then from that it will try to auto-detect the specific language.

However, for more accurate results, especially when dealing with images containing multiple languages or less common languages, it is often better to specify the language explicitly if you know what it is in advance.

Tesseract can also be used with multiple languages at once by passing a plus-separated string of ISO 639-2/T language codes to the `lang` parameter. For example, `lang='eng+spa'` would tell Tesseract to consider both English and Spanish while doing OCR.

Here's an example of how you might use Tesseract's automatic language detection:

```python
import pytesseract
from PIL import Image

# Define the path to your tesseract executable if it's not in your PATH already.
# Only needed if pytesseract doesn't find your tesseract installation.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def perform_ocr(image_path):
    # Open an image using PIL
    image = Image.open(image_path)
    
    # Use 'osd' (Orientation and script detection)
    osd = pytesseract.image_to_osd(image)
    print("OSD output:", osd)

    # Perform OCR on the opened image without specifying a language for auto-detection
    text = pytesseract.image_to_string(image)  # Auto-detection
    
    return text

# Input image path from user
image_location = input("Enter your image location: ")

# Perform OCR and print results
extracted_text = perform_ocr(image_location)
print(extracted_text)
```

The `image_to_osd` function returns information about orientation and script detection. This can give you hints about what script has been detected in your image but does not specifically tell you which language was recognized for OCR purposes.

For handling more complex cases or improving accuracy, consider training Tesseract with custom data or using dedicated services that are optimized for automatic language detection and OCR.


Create code that accepts language (or a set of languages) as optional fields, while using auto language detection if language(s) is not supplied.

 Certainly! Below is an example Python script that uses `pytesseract` and allows the user to either specify a language or a set of languages for OCR or rely on automatic language detection if none is provided. This script uses the `image_to_osd` function to perform orientation and script detection which can be helpful in cases where you want to get information about the detected script.

```python
import pytesseract
from PIL import Image

# Define the path to your tesseract executable if it's not in your PATH already.
# Only needed if pytesseract doesn't find your tesseract installation.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def perform_ocr(image_path, languages=None):
    # Open an image using PIL
    image = Image.open(image_path)

    # Perform orientation and script detection if no language was specified
    if not languages:
        osd = pytesseract.image_to_osd(image)
        print("OSD output:", osd)

    # Perform OCR on the opened image using specified languages or auto-detection
    text = pytesseract.image_to_string(image, lang=languages)  # Use provided languages or auto-detect
    
    return text

# Input image path from user
image_location = input("Enter your image location: ")

# Optionally input a language or set of languages separated by plus signs (e.g., 'eng+spa')
language_input = input("Enter OCR language(s) (optional, press Enter for auto-detection): ").strip()

if language_input:
    extracted_text = perform_ocr(image_location, languages=language_input)
else:
    extracted_text = perform_ocr(image_location)

print(extracted_text)
```

In this code:

- The `perform_ocr` function takes two parameters: `image_path`, which is the path to the image file; and an optional `languages`, which can be a string representing one language code (e.g., 'eng') or multiple codes separated by plus signs (e.g., 'eng+spa').
  
- If the user inputs a specific language(s), it will be passed to the `lang` parameter of `pytesseract.image_to_string`.
  
- If no language is provided by the user, automatic orientation and script detection will be performed using `pytesseract.image_to_osd`. Note that this does not specify the actual language for OCR but provides information about detected scripts. The actual text recognition will default to Tesseract's automatic language detection.

Remember that while Tesseract has auto-detection capabilities, specifying the correct language(s) can greatly improve accuracy. Moreover, automatic detection might not always work as expected with complex images containing multiple languages or non-standard scripts.

Error
```
Enter OCR language(s) (optional, press Enter for auto-detection):
Traceback (most recent call last):
  File "C:\workstation\decon\pydecon\agents\image2text.py", line 31, in <module>
    extracted_text = perform_ocr(image_location)
  File "C:\workstation\decon\pydecon\agents\image2text.py", line 14, in perform_ocr
    osd = pytesseract.image_to_osd(image)
  File "C:\Users\Munk\.conda\envs\py310\lib\site-packages\pytesseract\pytesseract.py", line 552, in image_to_osd
    return {
  File "C:\Users\Munk\.conda\envs\py310\lib\site-packages\pytesseract\pytesseract.py", line 555, in <lambda>
    Output.STRING: lambda: run_and_get_output(*args),
  File "C:\Users\Munk\.conda\envs\py310\lib\site-packages\pytesseract\pytesseract.py", line 288, in run_and_get_output
    run_tesseract(**kwargs)
  File "C:\Users\Munk\.conda\envs\py310\lib\site-packages\pytesseract\pytesseract.py", line 264, in run_tesseract
    raise TesseractError(proc.returncode, get_errors(error_string))
pytesseract.pytesseract.TesseractError: (2, 'Usage: pytesseract [-l lang] input_file')
```



The error you're encountering suggests that Tesseract had trouble processing the image with the orientation and script detection (OSD) mode. This might be due to a variety of factors, such as an unsupported image format, an issue with the installation of Tesseract, or something else entirely.

Here are a few steps to troubleshoot and resolve this issue:

1. **Ensure Tesseract is Installed Correctly**: Make sure that you have Tesseract OCR installed on your system and that it's accessible from the command line. You can test this by running `tesseract --version` in your command line or terminal.

2. **Tesseract Path**: If you installed Tesseract in a custom location, ensure the path to the `tesseract` executable is correctly set in your script by uncommenting and updating this line:
   ```python
   pytesseract.pytesseract.tesseract_cmd = r'path_to_your_tesseract_executable'
   ```
   Replace `path_to_your_tesseract_executable` with the actual path where your Tesseract OCR is installed.

3. **Image Format**: Confirm that the image format you're using is supported by Tesseract. Generally, formats like JPG, PNG, BMP, and TIFF should work without issues.

4. **Pytesseract Version**: Check if you have the latest version of `pytesseract`. You can update it using `pip install --upgrade pytesseract`.

5. **Alternative OSD Usage**: Instead of using `image_to_osd`, which may not always provide useful results for auto-detection purposes, consider skipping it and allowing Tesseract to automatically detect the language during OCR if no language is specified.

Here's an updated version of your script that comments out the OSD part and goes straight to performing OCR:

```python
import pytesseract
from PIL import Image

# Define the path to your tesseract executable if it's not in your PATH already.
# Only needed if pytesseract doesn't find your tesseract installation.
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tessera

ct.exe'

def perform_ocr(image_path, languages=None):
    # Open an image using PIL
    image = Image.open(image_path)

    # Perform OCR on the opened image using specified languages or auto-detection
    text = pytesseract.image_to_string(image, lang=languages or 'eng+osd')  # Use provided languages or auto-detect
    
    return text

# Input image path from user
image_location = input("Enter your image location: ")

# Optionally input a language or set of languages separated by plus signs (e.g., 'eng+spa')
language_input = input("Enter OCR language(s) (optional, press Enter for auto-detection): ").strip()

if language_input:
    extracted_text = perform_ocr(image_location, languages=language_input)
else:
    extracted_text = perform_ocr(image_location)

print(extracted_text)
```

This modified script skips OSD output and attempts OCR with automatic language detection (`'eng+osd'`) when no language is provided by the user. If you specify one or more languages separated by plus signs when prompted, those will be used instead.

If you still encounter issues after trying these steps, please provide additional details about your setup (such as OS version, Python version, Tesseract version) so I can assist you further.


What language should i input for english+arabic


If you have an image that contains both English and Arabic text and you want to perform OCR using Tesseract, you should specify both language codes separated by a plus sign. The language code for English is 'eng', and for Arabic, it is 'ara'. Here's how you would input the languages:

```
eng+ara
```

When prompted by the script to enter OCR language(s), type `eng+ara` and press Enter. This tells Tesseract to consider both English and Arabic languages while performing OCR on the image.

Here's the part of your Python script where you should input this:

```python
# Optionally input a language or set of languages separated by plus signs (e.g., 'eng+spa')
language_input = input("Enter OCR language(s) (optional, press Enter for auto-detection): ").strip()

if language_input:
    extracted_text = perform_ocr(image_location, languages=language_input)
else:
    extracted_text = perform_ocr(image_location)

print(extracted_text)
```

After running the script, when it asks "Enter OCR language(s) (optional, press Enter for auto-detection):", you would type `eng+ara` if your image contains text in both English and Arabic.