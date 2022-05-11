if [ ${RESET_DATA} ]; then
  rm -rf ${DATA_PATH}/*  
fi

if [ -d /backup/database ]; then
  [ "$(ls -A $DATA_PATH)" ] && echo "$DATA_PATH is not empty." || cp -rf /backup/database -d $DATA_PATH
fi
# Original Command: