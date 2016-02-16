#!/usr/bin/env bash

printf "\n#### CREATE NEW MAIL TOOL WIZARD ####\n\n"

RED='\033[0;31m'
NC='\033[0m' # No Color
GREEN='\033[0;32m'
VALIDATE=false

printf ${GREEN}

read -p "Insert the namespace to use: " NS


if [[ $NS = *[!\ ]* ]]; then

	if [[ $NS = *[$' \t\n-._#@!$%^&']* ]]; then
		printf "${RED}The 'namespace' attribute cannot contain spaces or special characters....${NC}\n"
		VALIDATE=false;
	else
		VALIDATE=true;
	fi

else
  printf "${RED}No namespace inserted!${NC}\n"
  exit;
  VALIDATE=false;
fi


if $VALIDATE ; then

	#### GET VARIABLES ####

		NS_LOWER=$(echo "$NS" | tr '[:upper:]' '[:lower:]')
		NS_CAP=`echo $NS_LOWER|cut -c1|tr [a-z] [A-Z]``echo $NS_LOWER|cut -c2-`

		printf ${GREEN}
			read -p "Insert the hostname to use e.g( http://test.demo/ ): " HOST
			read -p "Insert the mongo database name e.g( email_creator ): " DB
		printf ${NC}

		ENV_FILE=".env"


		rm -rf $ENV_FILE

		if [ ! -f $ENV_FILE ]
		then
		   cp .env.example $ENV_FILE
		   printf "${GREEN}Copying $ENV_FILE file ..... DONE!${NC}\n"
		fi

	#### SET VARIABLES ####

		sed -i -e "s/^\(\APP_NAME=*\).*$/\1$NS_LOWER/" $ENV_FILE
		printf "${GREEN}Set APP_NAME to $NS_LOWER ..... DONE!${NC}\n"

		sed -i -e "s/^\(\CACHE_PREFIX=*\).*$/\1$NS_LOWER/" $ENV_FILE
		printf "${GREEN}Set CACHE_PREFIX to $NS_LOWER ..... DONE!${NC}\n"

		sed -i -e "s/^\(\QUEUE_NAME=*\).*$/\1$NS_LOWER/" $ENV_FILE
		printf "${GREEN}Set QUEUE_NAME to $NS_LOWER ..... DONE!${NC}\n"

		if [[ $HOST = *[!\ ]* ]]; then
			echo "APP_BASE_URL=$HOST" | cat -  $ENV_FILE > temp && mv temp $ENV_FILE
			printf "${GREEN}Set APP_BASE_URL to $HOST ..... DONE!${NC}\n"
		fi

		if [[ $DB = *[!\ ]* ]]; then
			sed -i -e "s/^\(\DB_DATABASE=*\).*$/\1$DB/" $ENV_FILE
			printf "${GREEN}Set DB_DATABASE to $DB ..... DONE!${NC}\n"
		fi

	if [ $NS_LOWER != "base" ]; then
		#### CONFIG FILES ####

			DEFUALT_OVERRIDE="<?php return array();"
			COFING_FOLDER="config/$NS_CAP"

			if [ ! -d $COFING_FOLDER ]; then
			  mkdir $COFING_FOLDER
			  chmod -R 777 $COFING_FOLDER
			  printf "\n${GREEN}Folder to config app created at $COFING_FOLDER ..... DONE!${NC}\n"
			fi

			CONFIG_FILES=(app menu view routes)

			for index in ${!CONFIG_FILES[*]}
			do
				if [ ! -f $COFING_FOLDER/${CONFIG_FILES[$index]}.php ]; then
					echo $DEFUALT_OVERRIDE > $COFING_FOLDER/${CONFIG_FILES[$index]}.php
					printf "${GREEN}Config files created at $COFING_FOLDER/${CONFIG_FILES[$index]}.php ..... DONE!${NC}\n"
				fi
			done

			printf "\n${GREEN}This config files override the ones on config parent folder, every new changes must be do it on the app config folder $COFING_FOLDER!${NC}\n\n"


		#### VIEW FOLDER ####

			VIEW_FOLDER="resources/views/$NS_LOWER"

			if [ ! -d $VIEW_FOLDER ]; then
			  mkdir $VIEW_FOLDER
			  chmod -R 777 $VIEW_FOLDER
			  printf "${GREEN}Folder to include custom views created at $VIEW_FOLDER ..... DONE!${NC}\n"
			fi

		#### LESS FOLDER ####
			LESS_FOLDER="resources/assets/less/"
			LESS_NEW_FOLDER=$LESS_FOLDER$NS_LOWER
			LESS_FILES=( "base" "admin/admin" )

			if [ ! -d $LESS_NEW_FOLDER ]; then
			  mkdir $LESS_NEW_FOLDER
			  chmod -R 777 $LESS_NEW_FOLDER
			  printf "${GREEN}Folder to include custom less style files created at $LESS_NEW_FOLDER ..... DONE!${NC}\n"
			fi

			for index in ${!LESS_FILES[*]}
			do
				LESS_FILE_NAME=`basename ${LESS_FILES[$index]}`
				if [ ! -f $LESS_NEW_FOLDER/${LESS_FILE_NAME}.less ]; then
					echo "@import \"../base/${LESS_FILES[$index]}\";" > $LESS_NEW_FOLDER/${LESS_FILE_NAME}.less
					printf "${GREEN}Less files created at $LESS_NEW_FOLDER/${LESS_FILE_NAME}.less ..... DONE!${NC}\n"
				fi
			done

		#### JS FOLDER ####

			JS_NEW_FOLDER="resources/assets/js/$NS_LOWER"
			JS_OLD_FOLDER="resources/assets/js/base"

			if [ ! -d $JS_NEW_FOLDER ]; then
			  mkdir $JS_NEW_FOLDER
			  chmod -R 777 $JS_NEW_FOLDER
			  printf "${GREEN}Folder to include custom js scripts created at $JS_NEW_FOLDER ..... DONE!${NC}\n"
			fi

			cp -a $JS_OLD_FOLDER/. $JS_NEW_FOLDER/

			printf "${GREEN}chmod to folders, use sudo so please introduce your key!${NC}\n"

			sudo chmod -R 777 storage
			sudo chmod -R 777 bootstrap
			sudo chmod -R 777 public

			printf "${GREEN}Copy base script to new namespace asset script folder to change them later ..... DONE!${NC}\n"

		printf "${GREEN}Every new view or assets or changes of and base view or asset must be cloned and overridden on the app config folder $VIEW_FOLDER or $JS_NEW_FOLDER with the same tree sub folders!${NC}\n\n"

	fi

	if [ -f .env-e ]; then
		rm .env-e
	fi

fi
