@echo off
chcp 65001 >nul
echo.
echo  Enviando alteracoes para o GitHub...
echo  ----------------------------------------

cd /d "%~dp0"

git add -A

set /p msg="Descricao da alteracao (Enter para usar 'update'): "
if "%msg%"=="" set msg=update

git commit -m "%msg%"

git push origin main

echo.
echo  ----------------------------------------
echo  Pronto! Site atualizado em:
echo  https://rujo-dsgn.github.io/cardapio-ecologia/
echo.
pause
