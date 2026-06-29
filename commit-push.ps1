$ErrorActionPreference = "Stop"

Set-Location "C:\Users\Joao\Pictures\achados e perdidos\achados-perdidos"

# Stage the vercel.json and version.txt files
git add vercel.json
echo "v4" > version.txt
git add version.txt

# Commit both files
git commit -m "feat: add vercel deployment config and version"

# Push to remote repository
git push origin main

Write-Host "Commit and push successful!"