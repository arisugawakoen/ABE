#!/bin/sh
riot . tag.js
uglifyjs -m -o ../tag.min.js ./tag.js
