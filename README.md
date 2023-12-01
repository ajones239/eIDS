# eIDS
eIDS is an extensible and modular IDS framework that leverages machine learning to detect various types of network attacks. We provide an extensive set of modules out of the box, but provide a framework so that users can easily develop their own.

## Provided modules

### Analysis modules
- BiGAN analysis: A module that analyzes network traffic using a BiGAN model. The module expects data to be inputted as a pandas dataframe matching the CICIDS-2017 format, and outputs the class of the data. All necessary preprocessing is included in the module.
- CNN analysis: A module that analyzes network traffic using a CNN model. The module expects data to be inputted as a pandas dataframe matching the CICIDS-2017 format, and outputs the class of the data. All necessary preprocessing is included in the module. Specifically, the data is converted to an image so that the model can properly analyze it.
- Ensemble analysis: A module that analyzes network traffic using an ensemble model, which consists of a decision tree, random forest, extra tree, and XGB boost. The module expects data to be inputted as a pandas dataframe matching the CICIDS-2017 format, and outputs the class of the data. All necessary preprocessing is included in the module.
- Tree based analysis: A module that analyzes network traffic using a tree-based model. The module expects data to be inputted as a pandas dataframe matching the CICIDS-2017 format, and outputs the class of the data. All necessary preprocessing is included in the module.

### Input parsing modules
- CSV importer: A module that allows users to upload CSV files to be analyzed by analysis modules.
- NIC capture: A module for capturing network traffic from the system. Network traffic is saved as PCAP files in temporary storage.

### Processing modules
- PCAP to CSV converter: A module that processes PCAP files and outputs a pandas dataframe that is compliant with the CICIDS-2017 dataset. Uses the tool CICFlowMeter under the hood.
- Data grapher: A module that transparently records statistics about the attacks being recorded by the system and makes that data available for the UI.
- Label stripper: A module used for stripping the label column off of pandas dataframes.

### Action modules
- Discord alert: A module that sends an alert to a custom Discord channel based when an attack is detected. 

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

## Running the frontend

### Dependencies
- NodeJS 18.17.1 or newer
- npm

Assumes `eIDS/frontend/eids` as working directory

### Steps
- install dependencies
```
npm install
```
- run webserver
```
npm run dev
```

Website is available at `http://localhost:3000`

