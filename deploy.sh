#!/usr/bin/env bash



function deploy_composer {
	echo "updating php dependencies..."
	if [ -f ./composer.phar ]; then
		echo "using local composer instalation..."
		php composer.phar self-update
		php composer.phar clear-cache
		php composer.phar install -o
	else
		echo "using global composer instalation..."
		composer self-update
		composer clear-cache
		composer install -o
	fi
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

  *)
	deploy_composer
	deploy_bower
	deploy_npm
	deploy_gulp

  esac

  exit 0