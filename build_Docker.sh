#!/bin/sh
#  Start parameters:
#  1.-fileConfig
#  Example: ./build_Docker.sh ./nginx_conf/.env.dev

# Init variables
fileConfig=$1;
now="$(date +'%d-%m-%Y %H:%M:%S:%3N')"
base_dir=`pwd`

# Load environment variables
if [ -f "$fileConfig" ]
then
  echo ""
  echo " Loading config from $fileConfig"
  echo ""

  while IFS='=' read -r key value
  do
    key=$(echo $key | tr '.' '_')
    eval ${key}='${value}'
  done < "$fileConfig"

  echo " Date: "${now}
  echo " ======================================================"
  echo ""
  echo "                 Initializing variables "
  echo ""
  echo " ======================================================"
  echo " REGISTRY_NAME="${REGISTRY_NAME}

  else
    echo "$fileConfig not found."
  fi

#./gradlew :itachallenge-challenge:clean && ./gradlew :itachallenge-challenge:build

ng build --configuration production

docker build -t=${REGISTRY_NAME}:itachallenge-nginx-${MICROSERVICE_VERSION} .

#upload image to DockerHub
if [ ${ENV} = "dev" ] || [ ${ENV} = "pre" ];
then
  docker push ${REGISTRY_NAME}:itachallenge-nginx-${MICROSERVICE_VERSION}
fi
