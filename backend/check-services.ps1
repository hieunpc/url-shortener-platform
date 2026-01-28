# Script kiểm tra MongoDB và Redis

Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoResult = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoResult.TcpTestSucceeded) {
        Write-Host "✓ MongoDB is running on port 27017" -ForegroundColor Green
    }
    else {
        Write-Host "✗ MongoDB is NOT running on port 27017" -ForegroundColor Red
        Write-Host "  Please start MongoDB or run: docker-compose up -d" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "✗ Cannot check MongoDB status" -ForegroundColor Red
}

Write-Host ""
Write-Host "Checking Redis..." -ForegroundColor Yellow
try {
    $redisResult = Test-NetConnection -ComputerName localhost -Port 6379 -WarningAction SilentlyContinue
    if ($redisResult.TcpTestSucceeded) {
        Write-Host "✓ Redis is running on port 6379" -ForegroundColor Green
    }
    else {
        Write-Host "✗ Redis is NOT running on port 6379" -ForegroundColor Red
        Write-Host "  Please start Redis or run: docker-compose up -d" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "✗ Cannot check Redis status" -ForegroundColor Red
}

Write-Host ""
Write-Host "Setup Options:" -ForegroundColor Cyan
Write-Host "1. Docker (Recommended): docker-compose up -d" -ForegroundColor White
Write-Host "2. Install locally: See SETUP_MONGODB_REDIS.md" -ForegroundColor White
Write-Host "3. Use cloud services: MongoDB Atlas + Redis Cloud" -ForegroundColor White
