from moviepy.editor import AudioFileClip, ImageClip

def create_video_from_image_and_audio(image_path, audio_path, output_path):
    audio_clip = AudioFileClip(audio_path)
    image_clip = ImageClip(image_path)
    video_clip = image_clip.set_audio(audio_clip)
    video_clip.duration = audio_clip.duration
    video_clip.write_videofile(output_path, fps=15)  # You can adjust the fps as needed

# Example usage
create_video_from_image_and_audio(r"C:\workstation\decon\resources\Zen and The Art of Saving the Planet\9780062954824_1120.jpg", 
                                  r"C:\workstation\decon\resources\Zen and The Art of Saving the Planet\CD 1\concat.mp3", 
                                  r'C:\workstation\decon\resources\Zen and The Art of Saving the Planet\CD 1\output_video.mp4')