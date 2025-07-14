from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['http://localhost:5173'], supports_credentials=True)

@app.route('/feed', methods=['GET', 'OPTIONS'])
def feed():
    if request.method == 'OPTIONS':
        return '', 200
    return {'feed': []} 