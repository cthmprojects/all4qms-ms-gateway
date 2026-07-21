@echo off
echo ========================================
echo    DEPLOY QMS GATEWAY
echo ========================================
echo.

echo [1/3] Atualizando repositorio...
call git pull
if %errorlevel% neq 0 (
    echo ERRO: Falha na atualizacao do repositorio
    pause
    exit /b 1
)
echo Compilacao concluida com sucesso!
echo.

echo [2/3] Limpando e compilando o projeto...
call mvnw clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao do projeto
    pause
    exit /b 1
)
echo Compilacao concluida com sucesso!
echo.

echo [3/3] Construindo imagem Docker...
call mvnw -ntp verify -DskipTests -Pprod jib:dockerBuild
if %errorlevel% neq 0 (
    echo ERRO: Falha na construcao da imagem Docker
    pause
    exit /b 1
)
echo Imagem Docker construida com sucesso!
echo.

echo ========================================
echo    GATEWAY CONCLUIDA COM SUCESSO!
echo ========================================
echo.

