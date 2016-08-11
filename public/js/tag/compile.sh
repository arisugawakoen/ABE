#!/bin/sh
riot . tag.js
uglifyjs -c -o ../tag.min.js ./tag.js
