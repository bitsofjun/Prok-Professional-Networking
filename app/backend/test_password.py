#!/usr/bin/env python3
"""
Test different MySQL passwords to find the correct one
"""
import os
import sys
import subprocess

def test_mysql_password(password):
    """Test if a MySQL password works"""
    try:
        result = subprocess.run(
            ['mysql', '-u', 'root', f'-p{password}', '-e', 'SELECT 1'],
            capture_output=True,
            text=True,
            timeout=5
        )
        return result.returncode == 0
    except:
        return False

def main():
    print("🔍 Testing MySQL passwords...")
    print("=" * 40)
    
    # Common passwords to test
    passwords_to_test = [
        'arjun*0347',
        'KK@123',
        '',  # No password
        'root',
        'password',
        '123456',
        'mysql'
    ]
    
    print("Testing common passwords:")
    for password in passwords_to_test:
        if password == '':
            display_password = '(empty)'
        else:
            display_password = password
            
        print(f"  Testing: {display_password}")
        
        if test_mysql_password(password):
            print(f"  ✅ SUCCESS! Password is: {display_password}")
            print(f"\n💡 Update your config files with this password:")
            print(f"   DB_PASSWORD = '{password}'")
            return password
        else:
            print(f"  ❌ Failed")
    
    print("\n❌ None of the common passwords worked.")
    print("\n🔧 Manual steps:")
    print("1. Connect to MySQL manually:")
    print("   mysql -u root -p")
    print("2. Note the password you use")
    print("3. Update the config files with that password")
    
    return None

if __name__ == '__main__':
    main() 