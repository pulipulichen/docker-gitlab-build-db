DATA_PATH=/database_data/
echo $DATA_PATH
if [ "$(ls $DATA_PATH)" ]; then
  echo "$DATA_PATH is not empty. Restore job stops."
else
  unzip /database.zip -d $DATA_PATH
  echo "Data is restored."
fi
