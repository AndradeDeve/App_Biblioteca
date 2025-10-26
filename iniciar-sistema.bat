:: criar atalho na area de trabalho
:: caminho pra colocar no atalho
:: substitui o caminho da pasta do projeto
:: C:\Windows\System32\cmd.exe /c "cd /d C:\Users\Gisely Aguiar\Downloads\app_biblioteca\app_biblioteca && iniciar-sistema.bat"
::o icone ta na pasta public, da pra personalizar
@echo off
chcp 65001 >nul

:: Esconder completamente
if not "%1"=="hidden" (
    start /min cmd /c "%~f0" hidden
    exit
)

title SistemaBiblioteca

echo 🔍 Verificando sistema...

:: Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    mshta "javascript:alert('ERRO: Node.js não encontrado!\\n\\nInstale em: https://nodejs.org');close()"
    exit
)

:: Verificar pastas
if not exist "%~dp0backend" (
    mshta "javascript:alert('ERRO: Pasta backend não encontrada!');close()"
    exit
)

if not exist "%~dp0frontend" (
    mshta "javascript:alert('ERRO: Pasta frontend não encontrada!');close()"
    exit
)

echo ✅ Iniciando serviços em background...

:: Limpar processos antigos
taskkill /f /im node.exe >nul 2>&1

:: Backend silencioso
cd /d "%~dp0backend"
start /b npm start >nul 2>&1

echo ⏳ Iniciando backend...
timeout /t 8 >nul

:: Frontend silencioso
cd /d "%~dp0frontend" 
start /b npm start >nul 2>&1

echo ⏳ Iniciando frontend...
timeout /t 15 >nul

echo 🌐 Abrindo sistema...
start "" "http://localhost:3000"

echo ✅ Pronto!
exit