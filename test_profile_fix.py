#!/usr/bin/env python3
"""
Test script to verify the profile API fix
"""
import requests
import json

def test_profile_api():
    """Test the profile API to ensure it returns empty data for new users"""
    
    # Test the profile API endpoint
    url = "http://localhost:5001/api/profile"
    
    try:
        print("Testing profile API...")
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Profile API response:")
            print(f"  - ID: {data.get('id')}")
            print(f"  - Name: '{data.get('name')}'")
            print(f"  - Title: '{data.get('title')}'")
            print(f"  - Location: '{data.get('location')}'")
            print(f"  - Bio: '{data.get('bio')}'")
            print(f"  - Skills: '{data.get('skills')}'")
            
            # Check if the response contains empty/default data
            if data.get('name') == '' or data.get('name') is None:
                print("✅ SUCCESS: Profile API returns empty name for new users")
            elif data.get('name') == 'Default User':
                print("❌ FAILED: Profile API still returns 'Default User'")
            else:
                print(f"⚠️  WARNING: Profile API returns name: '{data.get('name')}'")
                
        else:
            print(f"❌ FAILED: Profile API returned status code {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ FAILED: Could not connect to backend server")
        print("Make sure the backend is running on http://localhost:5001")
    except Exception as e:
        print(f"❌ ERROR: {e}")

if __name__ == "__main__":
    test_profile_api() 