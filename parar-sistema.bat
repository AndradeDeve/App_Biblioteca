@echo off
taskkill /f /im node.exe >nul 2>&1
mshta "javascript:alert('✅ Sistema da Biblioteca parado com sucesso!');close()"