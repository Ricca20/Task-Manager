#!/bin/bash

# Login to get token
echo "1. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "taskuser@example.com", "password": "password123"}')
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Login failed."
  exit 1
fi
echo "Token received."
echo -e "\n"

# Create multiple tasks for pagination
echo "2. Creating Tasks for Pagination..."
for i in {1..5}; do
  curl -s -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{\"title\": \"Task $i\", \"status\": \"pending\"}" > /dev/null
done
echo "Created 5 tasks."
echo -e "\n"

# Test Pagination
echo "3. Testing Pagination (Page 1, Limit 2)..."
curl -s -X GET "http://localhost:3000/api/tasks?page=1&limit=2" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

echo "4. Testing Pagination (Page 2, Limit 2)..."
curl -s -X GET "http://localhost:3000/api/tasks?page=2&limit=2" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Test Filtering
echo "5. Testing Filtering (status=pending)..."
curl -s -X GET "http://localhost:3000/api/tasks?status=pending&limit=2" \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Test Validation Error
echo "6. Testing Validation Error (Missing Title)..."
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"description": "No title provided"}'
echo -e "\n"

# Test Invalid Status
echo "7. Testing Validation Error (Invalid Status)..."
curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Invalid Status Task", "status": "invalid_status"}'
echo -e "\n"
