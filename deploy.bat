@echo off
echo ========================================
echo New-Shop-Frontend Vercel 部署脚本
echo ========================================
echo.

echo [1/3] 检查 Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Vercel CLI 未安装，正在安装...
    npm install -g vercel
) else (
    echo Vercel CLI 已安装
)

echo.
echo [2/3] 构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 部署到 Vercel...
echo.
echo 选择部署类型:
echo 1. 预览部署 (vercel)
echo 2. 生产部署 (vercel --prod)
echo.
set /p choice="请输入选择 (1 或 2): "

if "%choice%"=="1" (
    vercel
) else if "%choice%"=="2" (
    vercel --prod
) else (
    echo 无效选择！
    pause
    exit /b 1
)

echo.
echo ========================================
echo 部署完成！
echo ========================================
pause

