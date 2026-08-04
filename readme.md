продакшн бд запускается локально на серваке:

cd /opt/pets

docker compose \
  --env-file .env \
  -f compose.prod.yaml \
  up -d





Каждая beta запускается с отдельным Compose project name:

docker compose \
  -p beta-feature-dogs \
  --env-file /opt/pets/beta.env \
  -f /opt/pets/compose.beta.yaml \
  up -d



  Узнать порт беты:

docker compose \
  -p beta-feature-dogs \
  --env-file /opt/pets/beta.env \
  -f /opt/pets/compose.beta.yaml \
  port backend 5000




  Удаление ветки:

docker compose \
  -p beta-feature-dogs \
  --env-file /opt/pets/beta.env \
  -f /opt/pets/compose.beta.yaml \
  down -v