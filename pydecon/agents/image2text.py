
import pytesseract
from PIL import Image

# Define the path to your tesseract executable if it's not in your PATH already.
# Only needed if pytesseract doesn't find your tesseract installation.
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

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