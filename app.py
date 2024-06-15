from flask import Flask, request, jsonify, send_file, url_for
from deep_translator import GoogleTranslator
import openai
from gtts import gTTS
import os
import uuid
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

# Set up OpenAI API key
openai.api_key = ''

# Hardcoded transcriptions for demo purposes
transcriptions = {
    "output.mp3": "જો હું 10મું નાપાસ થયો હોઉં અને મારે ટુરીઝમમાં જવું હોય તો ત્યાં કઈ નોકરીઓ છે અને મારે તે કેવી રીતે કરવું જોઈએ?"
}

def text_to_speech(text, lang='gu', filename='output.mp3'):
    tts = gTTS(text=text, lang=lang)
    tts.save(filename)
    return filename


@app.route('/speech_to_text', methods=['POST'])
def speech_to_text(*args, **kwargs):
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected for uploading"}), 400
        
        # Save the uploaded file
        file_path = os.path.join(os.getcwd(), file.filename)
        file.save(file_path)

        # Simulate transcription using hardcoded values
        transcribed_text = transcriptions.get('output.mp3', "Transcription not available")

        # Translate input text from the transcribed text to English
        translated_text_to_english = GoogleTranslator(source='auto', target='en').translate(transcribed_text)

        # Send translated text to OpenAI API
        response = openai.ChatCompletion.create(
            model="ft:gpt-3.5-turbo-1106:personal::9aNePXSl",
            messages=[
                {
                    "role": "user",
                    "content": translated_text_to_english
                }
            ],
            temperature=1,
            max_tokens=989,
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )

        # Extract the message content from the response
        if response.choices:
            message_content = response.choices[0].message['content']
        else:
            return jsonify({"error": "No response from OpenAI API"}), 500

        # Translate the response from English back to Gujarati
        translated_text_to_gujarati = GoogleTranslator(source='auto', target='gu').translate(message_content)

        # Convert the final translated text to speech
        audio_filename = 'output.mp3'
        text_to_speech(translated_text_to_gujarati, lang='gu', filename=audio_filename)

        # Create URL for downloading the audio file
        audio_url = url_for('download_audio', filename=audio_filename, _external=True)

        return jsonify({
            "transcribed_text": transcribed_text,
            "message": translated_text_to_gujarati,
            "audio_url": audio_url
        }), 200

    except Exception as e:
        app.logger.error(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/download/<filename>', methods=['GET'])
def download_audio(filename):
    try:
        return send_file(filename, as_attachment=True, mimetype='audio/mpeg')
    except Exception as e:
        app.logger.error(f"Error occurred while sending file: {str(e)}")
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(filename):
            os.remove(filename)

if __name__ == '__main__':
    app.run(debug=True)
