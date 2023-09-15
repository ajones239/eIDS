# eIDS
An extensible and modular IDS framework

## Backend build instructions

Tested with python 3.11.
Commands assume Linux, may have to adjust for other operating systems
Also assumes `eIDS/backend as working directory`

- optional: use python virtual environment to install dependencies
```
python -m venv venv
. ./venv/bin/activate
```

- install dependencies
`pip install -r requirements.txt`

- run backend
`python app.py`

Server is `http://localhost:5000`
Documentation is available at `http://localhost:5000/ui`

