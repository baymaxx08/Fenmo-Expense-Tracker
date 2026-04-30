#!/bin/bash
# Build script for backend deployment
cd backend
npm install
npm run build 2>/dev/null || true
