if [[ ${RESET_DATA} ]]; then
  rm -rf ${DATA_PATH}/*
  if [[ -e /backup/database.zip ]]; then
    unzip /backup/database.zip -d $DATA_PATH
  fi
fi

# 後面要接原本要執行的指令