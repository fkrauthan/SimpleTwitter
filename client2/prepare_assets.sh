#!/bin/bash
if [ ! -d "./bower_components" ]; then
  echo "Please run bower install!!!"
  exit -1
fi


if [ -d "./static/components/jquery" ]; then
    rm -Rf ./static/components/jquery
fi

mkdir -p  ./static/components/jquery/js
cp ./bower_components/jquery/dist/jquery.min.js ./static/components/jquery/js


if [ -d "./static/components/html5shiv" ]; then
    rm -Rf ./static/components/html5shiv
fi

mkdir -p  ./static/components/html5shiv/js
cp ./bower_components/html5shiv/dist/html5shiv.min.js ./static/components/html5shiv/js


if [ -d "./static/components/respond" ]; then
    rm -Rf ./static/components/respond
fi

mkdir -p  ./static/components/respond/js
cp ./bower_components/respond/dest/respond.min.js ./static/components/respond/js


if [ -d "./static/components/bootstrap" ]; then
    rm -Rf ./static/components/bootstrap
fi

mkdir -p  ./static/components/bootstrap/js
mkdir -p  ./static/components/bootstrap/css
mkdir -p  ./static/components/bootstrap/fonts
cp ./bower_components/bootstrap/dist/fonts/* ./static/components/bootstrap/fonts
cp ./bower_components/bootstrap/dist/js/bootstrap.min.js ./static/components/bootstrap/js
cp ./bower_components/bootstrap/dist/css/bootstrap.min.css ./static/components/bootstrap/css
