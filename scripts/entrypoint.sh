DATA_PATH=/database_data/
echo $DATA_PATH
if [ "$(ls $DATA_PATH)" ]; then
  echo "$DATA_PATH is not empty. Stop restore."
else
  cp -arf /database_init/* $DATA_PATH
  echo "Database is restored."
fi
