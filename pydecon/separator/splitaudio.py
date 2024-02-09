import os
from spleeter.separator import Separator

def separate_audio(input_file, num_stems=None, output_path=None):
    # Using embedded configuration.
    if num_stems:
        separator = Separator(f'spleeter:{num_stems}stems')
    else:
        separator = Separator('spleeter:2stems')

    if output_path:
        if not os.path.exists(output_path):
            os.makedirs(output_path)
            
        # Separate audio to specified output path.
        separator.separate_to_file(input_file, output_path)
    else:
        # Separate audio to default output directory.
        separator.separate_to_file(input_file)

# Example usage:
input_file = r'C:\workstation\decon\resources\hindighazal\ghazal.mp3'
num_stems = 4
output_path = r'C:\workstation\decon\resources\Tarari Tarari'

separate_audio(input_file, num_stems, output_path)