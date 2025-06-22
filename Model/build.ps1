# PowerShell script to build the Model Docker image with proper caching

# Set environment variables for Docker BuildKit to improve caching
$env:DOCKER_BUILDKIT = 1

# Build the Docker image with BuildKit enabled
Write-Host "Building Model Docker image with CPU-only PyTorch..."
Write-Host "This will use BuildKit for better caching and faster builds"

# Change to the directory containing the Dockerfile
Set-Location -Path $PSScriptRoot

# Build the image with proper tags
docker build --progress=plain --no-cache=false -t petcare-model:dev -f Dockerfile.dev .

Write-Host "Build complete. You can now run the container with docker-compose."