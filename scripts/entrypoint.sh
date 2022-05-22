DATA_PATH=/database_data/
# echo $DATA_PATH
# if [ "$(ls $DATA_PATH)" ]; then
#   echo "$DATA_PATH is not empty. Stop restore."
# else
#   cp -arf /database_init/* $DATA_PATH
#   echo "Database is restored."
# fi

if [ -n "$RESET_MODE" ]; then
  if [ "$(ls $DATA_PATH)" ]; then
    rm -rf $DATA_PATH/*
  fi
  cp -arf /database_init/* $DATA_PATH
  cp -arf /database_init/* $REMOTE_DATA_PATH
  ls -la $DATA_PATH
  echo "Database is reseted."
else
  if [ "$(ls $DATA_PATH)" ]; then
    echo "Database is not empty."
  else
    cp -arf /database_init/* $DATA_PATH
    cp -arf /database_init/* $REMOTE_DATA_PATH
    ls -la $DATA_PATH
    echo "Database is initialized."
  fi
fi

