#!/bin/bash

echo "=== Testing API ==="

# Register a new user
echo "1. Registering a new user..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Password123!"}')
echo "Register response: $REGISTER_RESPONSE"

# Login to get token
echo "2. Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Password123!"}')
echo "Login response: $LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"

# Test creating a list
echo "3. Creating a list..."
LIST_RESPONSE=$(curl -s -X POST http://localhost:3001/lists \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test List"}')
echo "List creation response: $LIST_RESPONSE"

echo "=== Test completed ==="