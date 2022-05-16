
# =================================
# Data Reset

if [ ${RESET_DATA} ]; then
  rm -rf ${DATA_PATH}/*  
  echo "Data is reseted."
fi

if [ -d "/paas_data/database/" ]; then
  if [ "$(ls $DATA_PATH)" ]; then
    echo "$DATA_PATH is not empty."
  else
    cp -arf /paas_data/database/* $DATA_PATH
    echo "Data is restored."
  fi
else
  echo "Data folder is not existing. /paas_data/database/"
fi
