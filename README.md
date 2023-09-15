# eIDS
An extensible and modular IDS framework

## Running the backend
### Dependencies
- python 3.11 (other versions may work, but are untested)
- docker (for mongodb), can also run mongodb without docker

Commands assume Linux, may have to adjust for other operating systems

Also assumes `eIDS/backend` as working directory

### Steps
- optional: use python virtual environment to install dependencies
```
python -m venv venv
. ./venv/bin/activate
```
- install dependencies
```
pip install -r requirements.txt
```
- run database
```
pushd ../database
./rundb.sh
popd
```
- run backend
```
python app.py
```

Server is `http://localhost:5000`

Documentation is available at `http://localhost:5000/ui`

