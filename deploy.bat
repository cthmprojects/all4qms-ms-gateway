@echo off
echo ========================================
echo    DEPLOY OMNIA SESMT
echo ========================================
echo.

echo [1/3] Limpando e compilando o projeto...
call mvnw clean install -DskipTests
if %errorlevel% neq 0 (
    echo ERRO: Falha na compilacao do projeto
    pause
    exit /b 1
)
echo Compilacao concluida com sucesso!
echo.

echo [2/3] Construindo imagem Docker...
call mvnw -ntp verify -DskipTests -Pprod jib:dockerBuild
if %errorlevel% neq 0 (
    echo ERRO: Falha na construcao da imagem Docker
    pause
    exit /b 1
)
echo Imagem Docker construida com sucesso!
echo.

echo [3/3] Iniciando containers...
docker compose -f src\main\docker\app.yml up -d
if %errorlevel% neq 0 (
    echo ERRO: Falha ao iniciar os containers
    pause
    exit /b 1
)
echo Containers iniciados com sucesso!
echo.

echo ========================================
echo    DEPLOY CONCLUIDO COM SUCESSO!
echo ========================================
echo.
echo Para verificar os containers rodando:
echo docker ps
echo.
echo Para ver os logs:
echo docker compose -f src\main\docker\app.yml logs -f
echo.
pause
