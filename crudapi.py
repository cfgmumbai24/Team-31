from flask import Flask, request, jsonify
import mysql.connector
import hashlib
import logging

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Configuration for connecting to MySQL
db_config = {
    'user': 'root',
    'password': 'root',
    'host': 'localhost',  # Change if necessary
    'database': 'MargShala',
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


if __name__ == '__main__':
    app.run(debug=True)
