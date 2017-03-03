#!/usr/bin/env bash

RUN_GULP=false
RUN_COMPOSER=false
RUN_BOWER=false
RUN_NPM=false
GIT_DIFF=`git diff --name-only HEAD@{0} HEAD@{1}`

while read srcfile
do
	REGEX_GULP="\.js$|\.less|resources|public|gulpfile"
	echo $srcfile;
	#Check if you need to run gulp
	if [[ $srcfile =~ $REGEX_GULP ]]; then
		RUN_GULP=true
	fi

	#Check if you need to run composer
	if [[ $srcfile = "composer.json" ]] ; then
		RUN_COMPOSER=true
	fi

	#Check if you need to run bower
	if [[ $srcfile = "bower.json" ]] ; then
		RUN_BOWER=true
		RUN_GULP=true
	fi

	#Check if you need to run npm
	if [[ $srcfile = "package.json" ]] ; then
		RUN_NPM=true
		RUN_GULP=true
	fi
done <<< "$(echo -e "$GIT_DIFF")"

function deploy_composer {
	echo "updating php dependencies..."

	if [ ! -f ./composer.phar ]; then
		echo "downloading composer..."
	    curl -o composer.phar "https://s3.amazonaws.com/stensul-devops/composer/composer.phar" 2>/dev/null
	fi

	echo "updating composer..."
	php composer.phar self-update

	echo "updating packages dependencies..."
	php composer.phar update -o

}

function deploy_bower {
	echo "updating bower dependencies..."
	bower install
}
function deploy_npm {
	echo "updating npm dependencies..."
    npm install
}

function deploy_gulp {
	echo "optimzing assets using gulp..."
	gulp --production
}

if [ -z "$GIT_DIFF" ]; then
	RUN_COMPOSER=true
	RUN_BOWER=true
	RUN_NPM=true
	RUN_GULP=true
fi

case "$1" in

  "--composer")
	deploy_composer
  ;;

  "--bower")
	deploy_bower
  ;;

  "--npm")
	deploy_npm
  ;;

  "--gulp")
	deploy_gulp
  ;;

  "--force-all")
	deploy_composer
	deploy_npm
	deploy_bower
	deploy_gulp
  ;;

  *)
	if $RUN_COMPOSER ; then
		deploy_composer
	fi
	if  $RUN_BOWER ; then
		deploy_bower
	fi
	if  $RUN_NPM ; then
		deploy_npm
	fi
	if  $RUN_GULP ; then
		deploy_gulp
	fi

  esac

  exit 0
