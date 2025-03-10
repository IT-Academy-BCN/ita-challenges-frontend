#!/bin/sh
#  Process to deploy manually the docker image:
#       export ENV=dev
#       export REGISTRY_NAME=itacademybcn/itachallenges
#       export MICROSERVICE_VERSION=x.x.x
#       ./build_Docker.sh
#
#  At the server, execute:
#      ./deploy_frontend_dev.sh itachallenge-nginx [MICROSERVICE_VERSION]



# Init variables
echo " ENV="${ENV}
echo " REGISTRY_NAME="${REGISTRY_NAME}
echo " MICROSERVICE_VERSION="${MICROSERVICE_VERSION}

now="$(date +'%d-%m-%Y %H:%M:%S:%3N')"
base_dir=`pwd`

ng build --configuration production

docker build -t=${REGISTRY_NAME}:itachallenge-nginx-${MICROSERVICE_VERSION} .

#upload image to DockerHub
if [ ${ENV} = "dev" ] || [ ${ENV} = "pre" ];
then
  docker push ${REGISTRY_NAME}:itachallenge-nginx-${MICROSERVICE_VERSION}
fi
