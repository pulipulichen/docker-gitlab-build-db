DATA_PATH=/database_data/
REMOTEDATA_PATH=/database_data_remote/
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

  echo "Reset data..."
  cp -arf /database_init/* $DATA_PATH

  if [ -d $REMOTE_DATA_PATH ]; then
    rm -rf $REMOTE_DATA_PATH/*
    cp -arf /database_init/* $REMOTE_DATA_PATH
  fi
  
  ls -la $DATA_PATH
  echo "Database is reseted."
else
  if [ "$(ls $DATA_PATH)" ]; then
    echo "Database is not empty."
  else
    echo "Initialize data..."
    cp -arf /database_init/* $DATA_PATH

    if [ -d $REMOTE_DATA_PATH ]; then
      echo "Initialize data to remote..."
      rm -rf $REMOTE_DATA_PATH/*
      cp -arf /database_init/* $REMOTE_DATA_PATH
    fi
    ls -la $DATA_PATH
    echo "Database is initialized."
  fi
fi

