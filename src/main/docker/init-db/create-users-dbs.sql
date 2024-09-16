-- Criar banco e usuário para all4qmsMsMetaInd
CREATE USER metaind_system WITH PASSWORD 'all4qmsMsMetaind';
CREATE DATABASE metaindicadores OWNER metaind_system;
GRANT ALL PRIVILEGES ON DATABASE metaindicadores TO metaind_system;

-- Criar banco e usuário para all4qmsMsGateway
CREATE USER gateway_system WITH PASSWORD 'all4qmsMsGateway';
CREATE DATABASE gateway OWNER gateway_system;
GRANT ALL PRIVILEGES ON DATABASE gateway TO gateway_system;
