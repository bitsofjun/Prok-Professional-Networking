# User Stories

This document outlines the core user stories that students will implement in this tutorial-based project. Each story focuses on teaching specific development concepts and practical implementation skills.

## Table of Contents

1. [Authentication & Profile Management](#1-authentication--profile-management)
2. [Feed & Content Management](#2-feed--content-management)
3. [Networking & Connections](#3-networking--connections)
4. [Job Board & Applications](#4-job-board--applications)
5. [Messaging System](#5-messaging-system)
6. [Company Pages](#6-company-pages)
7. [Mobile Experience](#7-mobile-experience)

## 1. Authentication & Profile Management

### Learning Focus: Basic Authentication and Data Management

#### Registration & Login

- As a new user, I want to register with email and password so that I can create my account
- As a user, I want to log in with my credentials so that I can access my profile
- As a user, I want to see validation errors so that I can correct my input

#### Profile Management

- As a user, I want to create a basic profile so that others can learn about me
- As a user, I want to upload a profile picture so that others can recognize me
- As a user, I want to edit my profile information so that it stays current
- As a user, I want to view my profile so that I can verify my information

## 2. Content Management

### Learning Focus: CRUD Operations and Data Relationships

#### Post Creation

- As a user, I want to create a new post so that I can share my thoughts
- As a user, I want to add text to my post so that I can express my ideas
- As a user, I want to see my post after creation so that I can verify it

#### Feed Interaction

- As a user, I want to view posts in my feed so that I can see updates
- As a user, I want to like posts so that I can show appreciation
- As a user, I want to comment on posts so that I can engage in discussion

## 3. Job Board

### Learning Focus: Search and Filter Implementation

#### Job Search

- As a user, I want to search for jobs so that I can find opportunities
- As a user, I want to filter jobs by location so that I can find nearby positions
- As a user, I want to view job details so that I can learn more about the position

#### Job Application

- As a user, I want to apply for a job so that I can pursue opportunities
- As a user, I want to see my applications so that I can track my progress
- As a user, I want to receive confirmation so that I know my application was received

## 4. Messaging System

### Learning Focus: Basic Communication Features

#### Direct Messaging

- As a user, I want to send a message so that I can communicate with others
- As a user, I want to view my messages so that I can read conversations
- As a user, I want to see when messages are sent so that I know they were delivered

## 5. Responsive Design

### Learning Focus: Responsive Layout Implementation

#### Mobile Experience

- As a mobile user, I want to access the site so that I can use it on my phone
- As a mobile user, I want to navigate easily so that I can find features
- As a mobile user, I want to view content clearly so that I can read it comfortably

#### Desktop Experience

- As a desktop user, I want to use the full interface so that I can access all features
- As a desktop user, I want to see more content at once so that I can browse efficiently
- As a desktop user, I want to use keyboard shortcuts so that I can navigate quickly

## Learning Outcomes

By implementing these user stories, students will learn to:

- Build and manage user authentication
- Create and manipulate data relationships
- Implement responsive layouts
- Handle form submissions and validation
- Practice API integration
- Manage state and data flow
- Implement basic error handling
- Use Git for version control

## Implementation Guidelines

1. **Start Simple**

   - Begin with basic functionality
   - Add features incrementally
   - Focus on core concepts first

2. **Progressive Enhancement**

   - Build mobile-first
   - Add tablet support
   - Enhance for desktop

3. **Code Organization**

   - Follow component structure
   - Practice clean code principles
   - Document your code

4. **Testing & Debugging**
   - Test on different devices
   - Handle common errors
   - Practice debugging skills

---

This document focuses on the core user stories that students will implement as part of their learning experience. Each story is designed to teach specific development concepts while building a functional professional networking platform.

## 6. Company Pages

### Company Profile

- As a company admin, I want to create a company page so that I can establish our presence.
- As a company admin, I want to update company information so that it stays current.
- As a company admin, I want to post company updates so that I can share news.
- As a company admin, I want to manage employee profiles so that I can verify team members.

### Company Engagement

- As a user, I want to follow companies so that I can stay updated on their news.
- As a user, I want to see company updates so that I can learn about their activities.
- As a user, I want to view company employees so that I can find contacts.
- As a user, I want to see company statistics so that I can understand their growth.

## 7. Mobile Experience

### Mobile Features

- As a mobile user, I want to receive push notifications so that I can stay updated.
- As a mobile user, I want to access offline content so that I can view information without internet.
- As a mobile user, I want to use the camera to take profile pictures so that I can update my profile.
- As a mobile user, I want to use location services so that I can find nearby connections.

### Mobile Optimization

- As a mobile user, I want to have a responsive interface so that I can use the app comfortably.
- As a mobile user, I want to have quick access to key features so that I can be efficient.
- As a mobile user, I want to have data-saving options so that I can manage my usage.
- As a mobile user, I want to have touch-friendly controls so that I can navigate easily.

## Success Metrics

- User registration and profile completion rates
- Content engagement metrics (likes, comments, shares)
- Connection growth rate
- Job application success rate
- Message response time
- Company page engagement
- Mobile app usage statistics

---

Thank you for sharing your logs, but these are still **build and startup logs**—they do not show any requests to `/api/auth/signup` or any errors related to your 500 Internal Server Error.

**If you are not seeing any error in the backend logs when you POST to `/api/auth/signup`, it means:**
- Your backend is not logging exceptions properly, or
- The error is being swallowed silently, or
- The request is not reaching your backend at all (unlikely, since you get a 500).

---

## How to Debug and Fix

### 1. **Add Explicit Error Logging to Signup Endpoint**

You need to ensure that any exception in your signup route is logged.  
**Edit your signup route to log all exceptions:**

#### Example (Flask):
```python
from flask import Blueprint, request, jsonify
import traceback

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    print("Signup endpoint hit!")  # <--- Add this
    try:
        # ... your signup logic ...
        pass
    except Exception as e:
        import traceback
        print("Exception in /signup:", e)
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
```

**Deploy this change, then try signing up again.**  
Check your logs for the traceback and error message.

---

### 2. **Check for Database Issues**

A very common cause for 500 errors on signup in production is a database problem:
- **Migrations not run** (tables/columns missing)
- **Wrong database URL** or credentials
- **Database not accessible** from Render

**Check:**
- Is your production database URL set in Render's environment variables?
- Did you run all migrations on the production database?

---

### 3. **Check Flask Error Logging Settings**

If you are running Flask in production mode, it may not show detailed errors by default.  
Make sure you are not suppressing logs. You can also set the log level to DEBUG for more info.

---

### 4. **Check Gunicorn Logs**

Sometimes, Gunicorn logs errors to stderr, not stdout.  
Make sure you are viewing **all** logs in the Render dashboard.

---

## Summary

- **You must add explicit error logging to your signup endpoint** to see what is going wrong.
- **Check your database connection and migrations.**
- **After adding logging, trigger the error and check the logs for the traceback.**
- **Paste the traceback here for a precise fix.**

---

**You cannot fix a 500 error without seeing the actual error message or traceback.  
Please add the logging as shown above, redeploy, and share the resulting error log.  
That will allow me to give you the exact fix!**

---

## **What This Means**

- Your backend is running and reachable.
- Your frontend is calling the backend (since you see a 500 error in the browser).
- **But:** The backend logs are not showing the request or any error for `/api/auth/signup`.

---

## **What You MUST Do Next**

### 1. **Check Backend Logs for the Error**

- Go to your Render backend service dashboard.
- Trigger the signup request again.
- **Immediately check the logs** for a Python error/traceback.
- Look for lines containing `Exception`, `Traceback`, or any error message.

---

### 2. **If You See No Error in Logs**

- Your backend may not be logging exceptions.
- **Add explicit error logging** to your signup endpoint.  
  In `app/backend/api/auth.py`, wrap your signup logic in a try/except and print the exception:

```python
from flask import Blueprint, request, jsonify
import traceback

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        # ... your signup logic ...
        pass
    except Exception as e:
        import traceback
        print("Exception in /signup:", e)
        traceback.print_exc()
        return jsonify({"error": "Internal server error"}), 500
```

- **Redeploy your backend** after making this change.
- Try signing up again and check the logs for the error.

---

### 3. **Share the Error Message**

- Copy the full error/traceback from the backend logs.
- Paste it here.  
  *This is the only way to diagnose and fix the root cause!*

---

## **Summary**

- The 500 error is a backend bug or misconfiguration.
- You must check the backend logs for the actual error message.
- If you don’t see an error, add logging as shown above.
- Share the error/traceback here for a precise fix.

---

**Please check your backend logs after triggering the error and share the traceback here. That will allow me to give you the exact solution!**

---

Here’s a comprehensive check of **all the connections** in your stack, based on your setup and the steps you’ve taken so far:

---

## 1. **Frontend → Backend Connection**

- **Frontend Environment Variable:**  
  You have set  
  ```
  VITE_API_URL=https://prok-backend-a1im.onrender.com
  ```
  in your frontend deployment.  
  **This is correct.**

- **Frontend Code:**  
  Your frontend uses `import.meta.env.VITE_API_URL` for all API calls.  
  **This is correct.**

- **Test:**  
  - Open your deployed frontend.
  - Open browser dev tools → Network tab.
  - Trigger a signup.
  - Confirm the request URL is `https://prok-backend-a1im.onrender.com/api/auth/signup`.
  - If you see a 500 error, the request is reaching the backend.

---

## 2. **Backend CORS Configuration**

- **Backend Environment Variable:**  
  ```
  ALLOWED_ORIGINS=https://prok-frontend-h1wa.onrender.com
  ```
  - This allows your frontend to make requests to your backend.
  - **This is correct.**

---

## 3. **Backend → Database Connection**

- **Backend Environment Variable:**  
  ```
  SQLALCHEMY_DATABASE_URI=postgresql://prok_db_bbj3_user:LptVbmIzX3Vwopv2LegWsuCAlaOH5Esx@dpg-d1rs9rer433s73ank6p0-a.oregon-postgres.render.com/prok_db_bbj3
  ```
  - This is a valid PostgreSQL URI.
  - **This is correct.**

- **Test:**  
  - You can run the connection test scripts (`setup_and_run.py`, `test_db.py`, etc.) locally with this URI to verify.
  - In production, if the backend starts and you see no DB errors in logs, the connection is likely working.
  - If there is a DB connection issue, you will see errors like `could not connect to server` or `authentication failed` in the logs.

---

## 4. **Backend Logging and Request Handling**

- You have added a print statement at the top of your `/signup` route:
  ```python
  print("Signup endpoint hit!")
  ```
- **Test:**  
  - Trigger a signup from the frontend.
  - Check backend logs for this message.
  - If you see it, the request is reaching the backend.
  - If you do not see it, the request is not reaching the backend (possible routing or deployment issue).

---

## 5. **What to Do If You Still Get a 500 Error**

- If you see `"Signup endpoint hit!"` in the logs, but still get a 500 error:
  - The error is in your signup logic.
  - The try/except block should print the exception and traceback.
  - **Share the traceback here for a precise fix.**

- If you **do not see** `"Signup endpoint hit!"`:
  - The request is not reaching your backend.
  - Double-check your frontend API URL, deployment, and CORS settings.
  - Make sure your backend is running and accessible.

---

## 6. **Summary Table**

| Connection                | Status/Check                                                                 |
|---------------------------|------------------------------------------------------------------------------|
| Frontend → Backend        | VITE_API_URL set, check Network tab, 500 means request is reaching backend   |
| Backend CORS              | ALLOWED_ORIGINS set, should allow frontend domain                            |
| Backend → Database        | SQLALCHEMY_DATABASE_URI set, check for DB errors in logs                     |
| Backend Request Logging   | print("Signup endpoint hit!") in /signup, check logs for this message        |

---

## **Next Steps**

1. **Trigger a signup from the frontend.**
2. **Check backend logs for "Signup endpoint hit!" and any traceback.**
3. **Share the traceback here if you see one.**
4. If you do **not** see "Signup endpoint hit!", let me know—this means the request is not reaching your backend.

---

**Once you provide the output from the backend logs after a signup attempt, I can give you the exact fix for your 500 error!**

---

Your `/signup` route in `app/backend/api/auth.py` is **correctly defined** to accept `POST` requests:

```python
from flask import Blueprint, request, jsonify
import traceback

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    ...
```

**This means:**
- If you are getting "Method Not Allowed" for `/api/auth/signup`, the problem is likely with how the blueprint is registered or with the request method being used.

---

## **Checklist to Fix "Method Not Allowed"**

### 1. **Blueprint Registration**
In your `app/backend/app.py`, you should have:
```python
from api import auth_bp
app.register_blueprint(auth_bp, url_prefix='/api/auth')
```
- This makes the full route `/api/auth/signup`.

### 2. **Frontend Request**
- Your frontend should be making a `POST` request to `https://prok-backend-a1im.onrender.com/api/auth/signup`.
- Double-check in the browser dev tools → Network tab that the request method is `POST`.

### 3. **No Route Overlap**
- Make sure there is no other route or blueprint that could be shadowing `/api/auth/signup`.

### 4. **No Trailing Slash Issue**
- Flask treats `/signup` and `/signup/` as different routes if you don't set `strict_slashes=False`.
- Try both `/api/auth/signup` and `/api/auth/signup/` in your frontend and see if one works.

---

## **What To Do Next**

1. **Check your blueprint registration in `app.py`.**
2. **Try both `/api/auth/signup` and `/api/auth/signup/` in your frontend.**
3. **Confirm the request method is `POST`.**
4. **If you still get "Method Not Allowed", paste your `app.py` blueprint registration code here.**

---

**Your backend route is correct. The issue is likely with blueprint registration, request method, or a trailing slash.  
Check these and let me know what you find!**

---

Here’s how to fix the **"Method Not Allowed"** error for `/api/auth/signup`:

---

## 1. **Double-Check Your Frontend Request**

- Make sure your frontend is making a `POST` request to:
  ```
  https://prok-backend-a1im.onrender.com/api/auth/signup
  ```
- In your frontend code, the signup call should look like:
  ```js
  fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  })
  ```

---

## 2. **Check for Trailing Slash Issues**

- Flask treats `/api/auth/signup` and `/api/auth/signup/` as different routes if `strict_slashes` is not set.
- Try both URLs in your frontend:
  - `/api/auth/signup`
  - `/api/auth/signup/`

---

## 3. **Check the Request in Browser Dev Tools**

- Open the **Network** tab in your browser’s developer tools.
- Trigger the signup.
- Click on the request to `/api/auth/signup`.
- Confirm:
  - **Request Method:** `POST`
  - **Request URL:** `https://prok-backend-a1im.onrender.com/api/auth/signup`
  - **Response:** If it says "Method Not Allowed", note the exact URL and method.

---

## 4. **Check for Typos or Double Slashes**

- Make sure there are no typos or double slashes in the URL (e.g., `/api/auth//signup`).

---

## 5. **Backend is Correct**

- Your backend route and blueprint registration are correct.
- If you still get "Method Not Allowed", the issue is almost always:
  - The frontend is making a `GET` request instead of `POST`.
  - The URL is wrong (typo, double slash, etc.).
  - The frontend is calling the wrong endpoint.

---

## 6. **If You Still Get the Error**

- **Paste here:**
  - The exact request details from the Network tab (method, URL, headers).
  - The full error message from the backend logs (if any).

---

## **Summary Table**

| Step                        | What to Check/Do                                      |
|-----------------------------|------------------------------------------------------|
| Frontend request method      | Must be `POST`                                       |
| Frontend request URL         | Must be `/api/auth/signup` (try with/without slash)  |
| Network tab                 | Confirm method and URL                               |
| Typos/double slashes         | None in the URL                                      |
| Backend logs                 | Any error messages                                   |

---

**If you follow these steps and still get "Method Not Allowed", share the request details and I’ll give you the exact fix!**

---

This error means your frontend (likely running on a different port or domain) is trying to access your backend at `http://localhost:5001/api/posts`, but the browser is blocking the request due to **CORS (Cross-Origin Resource Sharing)** policy.

---

## **Why This Happens**

- **CORS** is a browser security feature that blocks requests from one origin (domain/port) to another unless the server explicitly allows it.
- Your frontend is running on one origin (e.g., `http://localhost:5173` or your deployed frontend URL).
- Your backend is running on another (e.g., `http://localhost:5001` or your deployed backend URL).
- If the backend does not send the correct CORS headers, the browser blocks the request.

---

## **How to Fix**

### 1. **For Local Development**

- Make sure your backend is running and accessible at `http://localhost:5001`.
- In your backend Flask app, you should have something like:

  ```python
  from flask_cors import CORS
  CORS(app, origins=["http://localhost:5173"], supports_credentials=True)
  ```

- If you want to allow all origins (for development only!):

  ```python
  CORS(app, supports_credentials=True)
  ```

### 2. **For Production**

- Your frontend should call the deployed backend URL (not localhost).
- Set the `VITE_API_URL` in your frontend to your deployed backend (e.g., `https://prok-backend-a1im.onrender.com`).
- In your backend, set the `ALLOWED_ORIGINS` environment variable to your deployed frontend URL (e.g., `https://prok-frontend-h1wa.onrender.com`).

### 3. **Check Your API URL**

- If your frontend is deployed, but still trying to call `http://localhost:5001`, you need to set the correct `VITE_API_URL` and redeploy your frontend.

---

## **Summary Table**

| Environment   | Frontend API URL should be...                  | Backend CORS should allow...                |
|---------------|------------------------------------------------|---------------------------------------------|
| Local         | http://localhost:5001                          | http://localhost:5173                       |
| Production    | https://prok-backend-a1im.onrender.com         | https://prok-frontend-h1wa.onrender.com     |

---

## **What To Do Next**

1. **For local dev:**  
   - Make sure both frontend and backend are running.
   - Make sure CORS is enabled in Flask for your frontend origin.

2. **For production:**  
   - Set `VITE_API_URL` in your frontend to your deployed backend URL.
   - Set `ALLOWED_ORIGINS` in your backend to your deployed frontend URL.
   - Redeploy both frontend and backend.

3. **If you still get CORS errors:**  
   - Paste your Flask CORS setup and your frontend API URL config here for review.

---

Let me know if you want me to check your Flask CORS setup or your frontend API config!
