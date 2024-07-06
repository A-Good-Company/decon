# Code to take a folder as input and combine all mp3s in the folder into one long mp3
import os
from pydub import AudioSegment

# Function to combine all mp3 files in a folder into one long mp3 file
def combine_mp3s(folder_path, output_file):
    # Create an empty AudioSegment object
    combined_audio = AudioSegment.empty()

    # Loop through all files in the folder
    for filename in os.listdir(folder_path):
        if filename.endswith('.mp3'):
            # Load the mp3 file using AudioSegment
            audio = AudioSegment.from_file(os.path.join(folder_path, filename), format="mp3")
            
            # Append the loaded mp3 to the combined_audio
            combined_audio += audio

    # Export the combined audio as an mp3 file
    combined_audio.export(output_file, format="mp3")

# Usage example
folder_path = r"C:\workstation\decon\resources\Zen and The Art of Saving the Planet\CD 1"  # Update with the actual folder path
output_file = r"C:\workstation\decon\resources\Zen and The Art of Saving the Planet\CD 1\concat.mp3"  # Update with the desired output file path

combine_mp3s(folder_path, output_file)
