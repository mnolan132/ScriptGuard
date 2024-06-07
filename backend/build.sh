#!/bin/bash

# Install SQLite development package
apt-get update && apt-get install -y libsqlite3-dev

# Install Python packages
pip3 install -r requirements.txt && pip3 install pysqlite3
