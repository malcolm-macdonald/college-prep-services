# PowerShell script to build and start the production server

# Build the TypeScript code
Write-Host "Building TypeScript code..." -ForegroundColor Green
npm run build

# Check if build succeeded
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed with exit code $LASTEXITCODE. Please fix the errors and try again." -ForegroundColor Red
    exit $LASTEXITCODE
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Green
npm start 