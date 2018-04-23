#!/usr/bin/env bash

RUN_WEBPACK=false
RUN_COMPOSER=false
RUN_NPM=false
GIT_DIFF=`git diff --name-only HEAD@{0} HEAD@{1}`

while read srcfile
do
	REGEX_WEBPACK="\.js$|\.less|resources|public|webpack.mix"
	echo $srcfile;
	#Check if you need to run webpack
	if [[ $srcfile =~ $REGEX_WEBPACK ]]; then
		RUN_WEBPACK=true
	fi

	#Check if you need to run composer
	if [[ $srcfile = "composer.json" ]] ; then
		RUN_COMPOSER=true
	fi

	#Check if you need to run npm
	if [[ $srcfile = "package.json" ]] ; then
		RUN_NPM=true
		RUN_WEBPACK=true
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

function deploy_npm {
	echo "updating npm dependencies..."
    npm install
}

function deploy_webpack {
	echo "optimzing assets using webpack..."
	npm run production
}

if [ -z "$GIT_DIFF" ]; then
	RUN_COMPOSER=true
	RUN_NPM=true
	RUN_WEBPACK=true
fi

case "$1" in

  "--composer")
	deploy_composer
  ;;

  "--npm")
	deploy_npm
  ;;

  "--webpack")
	deploy_webpack
  ;;

  "--force-all")
	deploy_composer
	deploy_npm
	deploy_webpack
  ;;

  *)
	if $RUN_COMPOSER ; then
		deploy_composer
	fi
	if  $RUN_NPM ; then
		deploy_npm
	fi
	if  $RUN_WEBPACK ; then
		deploy_webpack
	fi

  esac

  exit 0
