from app import app
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == '__main__':
    # Run the app
    app.run(debug=True)
