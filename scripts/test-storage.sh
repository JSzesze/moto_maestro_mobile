#!/bin/bash

# Load environment variables
source .env.local

SUPABASE_URL="https://wrseqotrwvwbytsljdps.supabase.co"
USER_ID="080fb3fd-6e2c-4e7c-aedc-9085a6e924a5"

echo "=== Testing Supabase Storage & Database ==="
echo ""

# 1. Test public URL access
echo "1. Testing public URL access for recent file..."
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" \
  "$SUPABASE_URL/storage/v1/object/public/documents/$USER_ID/insurance-1765833929388-pending_uploads.json"
echo ""

# 2. List files in user's storage folder
echo "2. Listing files in storage bucket for user..."
curl -s "$SUPABASE_URL/storage/v1/object/list/documents" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"prefix\": \"$USER_ID/\"}" | python3 -m json.tool 2>/dev/null || echo "Could not parse JSON or no files found"
echo ""

# 3. Query documents table
echo "3. Querying documents table..."
curl -s "$SUPABASE_URL/rest/v1/documents?select=id,document_type,file_name,file_url,created_at&profile=eq.$USER_ID" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | python3 -m json.tool 2>/dev/null || echo "Could not query documents"
echo ""

# 4. Check bucket info
echo "4. Checking bucket configuration..."
curl -s "$SUPABASE_URL/storage/v1/bucket/documents" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" | python3 -m json.tool 2>/dev/null || echo "Could not get bucket info"
echo ""

echo "=== Done ==="

