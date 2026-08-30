$directories = @(
    "app",
    "app/api",
    "app/core",
    "app/dependencies",
    "tests"
)

$files = @(
    "app/__init__.py",
    "app/main.py",

    "app/api/__init__.py",
    "app/api/router.py",

    "app/core/__init__.py",
    "app/core/config.py",
    "app/core/logging.py",
    "app/core/exceptions.py",

    "app/dependencies/__init__.py",
    "app/dependencies/services.py",

    "tests/test_health.py",

    ".env.example",
    ".gitignore",
    "requirements.txt",
    "Dockerfile",
    "pyproject.toml",
    "README.md"
)

foreach ($directory in $directories) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

foreach ($file in $files) {
    New-Item -ItemType File -Path $file -Force | Out-Null
}

Write-Host "Backend Phase 1 structure created successfully."