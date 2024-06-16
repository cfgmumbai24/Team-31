from flask import Flask, request, jsonify, send_file, url_for
from deep_translator import GoogleTranslator
import mysql.connector
import hashlib
import openai
from gtts import gTTS
import os
import uuid
import logging
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

# Set up OpenAI API key
openai.api_key = OPENAI_API_KEY

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

cors = CORS(app)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Configuration for connecting to MySQL
db_config = {
    'user': 'root',
    'password': 'Manaswani@423',
    'host': 'localhost',  # Change if necessary
    'database': 'margshala',
    'raise_on_warnings': True
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        app.logger.debug("Database connection successful")
        return connection
    except mysql.connector.Error as err:
        app.logger.error(f"Database connection error: {err}")
        raise

def execute_query(query, params=None, fetchone=False, commit=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    result = None
    try:
        cursor.execute(query, params)
        if fetchone:
            result = cursor.fetchone()
        else:
            result = cursor.fetchall()
        if commit:
            conn.commit()
    except mysql.connector.Error as err:
        app.logger.error(f"Query error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
    return result

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/users', methods=['POST'])
def create_user():
    data = request.json
    
    app.logger.debug(f"Received data: {data}")
    
    # Validate the incoming data
    required_fields = ['name', 'age', 'education', 'state', 'pincode', 'phone_number', 'password', 'interests']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in the request data'}), 400

    if len(data['phone_number']) != 10 or not data['phone_number'].isdigit():
        return jsonify({'error': 'Invalid phone number. It must be exactly 10 digits.'}), 400

    # Check for duplicate phone number
    duplicate_query = "SELECT * FROM Users WHERE phone_number = %s"
    duplicate_user = execute_query(duplicate_query, (data['phone_number'],), fetchone=True)

    if duplicate_user:
        return jsonify({'error': 'Phone number already exists. Please use a different phone number.'}), 409
    
    password_hash = hash_password(data['password'])
    interests = ','.join(data['interests'])

    query = """
        INSERT INTO Users (name, age, education, state, pincode, phone_number, password_hash, interests)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (data['name'], data['age'], data['education'], data['state'], data['pincode'], data['phone_number'], password_hash, interests)
    
    execute_query(query, params, commit=True)
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/users/<int:id>/<int:phone_number>', methods=['GET'])
def read_user(id, phone_number):
    query = "SELECT * FROM Users WHERE id = %s AND phone_number = %s"
    user = execute_query(query, (id, phone_number), fetchone=True)

    if user:
        return jsonify({
            'id': user[0],
            'name': user[1],
            'age': user[2],
            'education': user[3],
            'state': user[4],
            'pincode': user[5],
            'phone_number': user[6],
            'password_hash': user[7],
            'interests': user[8].split(',')
        })
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<int:id>/<int:phone_number>', methods=['PUT'])
def update_user(id, phone_number):
    data = request.json
    new_phone_number = data['phone_number']

    # Validate the new phone number
    if len(new_phone_number) != 10 or not new_phone_number.isdigit():
        return jsonify({'error': 'Invalid phone number. It must be exactly 10 digits.'}), 400

    # Check for duplicate phone number
    duplicate_query = """
        SELECT * FROM Users
        WHERE phone_number = %s AND NOT (id = %s AND phone_number = %s)
    """
    duplicate_user = execute_query(duplicate_query, (new_phone_number, id, phone_number), fetchone=True)

    if duplicate_user:
        return jsonify({'error': 'Phone number already exists. Please use a different phone number.'}), 409

    interests = ','.join(data['interests'])

    user_query = "SELECT * FROM Users WHERE id = %s AND phone_number = %s"
    user = execute_query(user_query, (id, phone_number), fetchone=True)

    if user:
        password_hash = hash_password(data['password']) if 'password' in data else user[7]
        update_query = """
            UPDATE Users
            SET name = %s, age = %s, education = %s, state = %s, pincode = %s, phone_number = %s, password_hash = %s, interests = %s
            WHERE id = %s AND phone_number = %s
        """
        params = (data['name'], data['age'], data['education'], data['state'], data['pincode'], new_phone_number, password_hash, interests, id, phone_number)
        
        execute_query(update_query, params, commit=True)
        return jsonify({'message': 'User updated successfully'})
    else:
        return jsonify({'error': 'User not found'}), 404

@app.route('/users/<int:id>/<int:phone_number>', methods=['DELETE'])
def delete_user(id, phone_number):
    user_query = "SELECT * FROM Users WHERE id = %s AND phone_number = %s"
    user = execute_query(user_query, (id, phone_number), fetchone=True)

    if user:
        delete_query = "DELETE FROM Users WHERE id = %s AND phone_number = %s"
        execute_query(delete_query, (id, phone_number), commit=True)
        return jsonify({'message': 'User deleted successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        app.logger.debug("Database connection successful")
        return connection
    except mysql.connector.Error as err:
        app.logger.error(f"Database connection error: {err}")
        raise

def execute_query(query, params=None, fetchone=False, commit=False):
    conn = get_db_connection()
    cursor = conn.cursor()
    result = None
    try:
        cursor.execute(query, params)
        if fetchone:
            result = cursor.fetchone()
        else:
            result = cursor.fetchall()
        if commit:
            conn.commit()
    except mysql.connector.Error as err:
        app.logger.error(f"Query error: {err}")
        conn.rollback()
    finally:
        cursor.close()
        conn.close()
    return result

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json

    app.logger.debug(f"Received data: {data}")

    # Validate the incoming data
    required_fields = ['phone_number', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in the request data'}), 400

    if len(data['phone_number']) != 10 or not data['phone_number'].isdigit():
        return jsonify({'error': 'Invalid phone number. It must be exactly 10 digits.'}), 400

    # Fetch user by phone number
    query = "SELECT * FROM users WHERE phone_number = %s"
    user = execute_query(query, (data['phone_number'],), fetchone=True)

    if user:
        # Compare the hashed password
        hashed_password = hash_password(data['password'])
        if hashed_password == user[6]:
            return jsonify({'message': 'Login successful'}), 200
        else:
            return jsonify({'error': 'Incorrect password'}), 401
    else:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/mentors', methods=['POST'])
def create_mentor():
    data = request.json
    
    app.logger.debug(f"Received mentor data: {data}")
    
    # Validate the incoming data
    required_fields = ['phone_number', 'password']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing fields in the request data'}), 400

    if len(data['phone_number']) != 10 or not data['phone_number'].isdigit():
        return jsonify({'error': 'Invalid phone number. It must be exactly 10 digits.'}), 400

    # Check for duplicate phone number
    duplicate_query = "SELECT * FROM Mentors WHERE phone_number = %s"
    duplicate_mentor = execute_query(duplicate_query, (data['phone_number'],), fetchone=True)

    if duplicate_mentor:
        return jsonify({'error': 'Phone number already exists. Please use a different phone number.'}), 409
    
    password_hash = hash_password(data['password'])

    query = """
        INSERT INTO Mentors (phone_number, password_hash)
        VALUES (%s, %s)
    """
    params = (data['phone_number'], password_hash)
    
    execute_query(query, params, commit=True)
    return jsonify({'message': 'Mentor created successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True)
