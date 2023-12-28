#!/bin/sh


sudo docker compose -p all4qms -f ./src/main/docker/postgresql.yml up -d
sudo docker compose -p all4qms -f ./src/main/docker/jhipster-registry.yml up -d

# sudo docker compose -f ./src/main/docker/postgresql.yml down -v
# sudo docker compose -f ./src/main/docker/jhipster-registry.yml down -v
