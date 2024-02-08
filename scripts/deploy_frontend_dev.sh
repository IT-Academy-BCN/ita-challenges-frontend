#!/bin/bash
#title  :deploy_frontend_dev.sh
#In params:
#  - microservice_name
#  - microservice_upgrade_version
#description:
#bash_version: 4.2.46(1)-release or later
#===================================================================================================

microservice_name=$1;
microservice_upgrade_version=$2;

#Remove old version
id_container=$(docker ps -a --format '{{.ID}}\t{{.Image}}' | grep $microservice_name | cut -f1)
echo 'Killing container '${id_container}
docker kill $id_container
echo 'Removing container... '${id_container}
docker rm $id_container

#Deploy new version: overwrite micro version of .env.dev (consumed by docker-compose.dev.yml)
export NGINX_FRONTEND_TAG=$microservice_upgrade_version
docker compose --env-file itachallenges/conf/.env.dev -f itachallenges/docker/docker-compose.dev.yml up --remove-orphans $microservice_name -d
