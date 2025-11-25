#!/bin/bash

# Register and Login to get token
echo "1. Registering/Logging in..."
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "taskuser@example.com", "password": "password123"}' > /dev/null

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

# Create Task
echo "2. Creating Task..."
CREATE_RES=$(curl -s -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Task", "description": "This is a test task", "status": "pending", "due_date": "2023-12-31"}')
echo $CREATE_RES
TASK_ID=$(echo $CREATE_RES | grep -o '"id":[^,]*' | cut -d':' -f2)
echo "Task ID: $TASK_ID"
echo -e "\n"

# Get All Tasks
echo "3. Getting All Tasks..."
curl -s -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Get One Task
echo "4. Getting Task $TASK_ID..."
curl -s -X GET http://localhost:3000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Update Task
echo "5. Updating Task $TASK_ID..."
curl -s -X PUT http://localhost:3000/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "completed"}'
echo -e "\n"

# Delete Task
echo "6. Deleting Task $TASK_ID..."
curl -s -X DELETE http://localhost:3000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"

# Verify Deletion
echo "7. Verifying Deletion..."
curl -s -X GET http://localhost:3000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"
echo -e "\n"
