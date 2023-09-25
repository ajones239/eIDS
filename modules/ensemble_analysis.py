# -*- coding: utf-8 -*-
"""Ensemble_Analysis.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1OeB_WtSx-MKW_DXnx2rbDSi4mSvm60F_
"""

#ignore deprecated warnings
import warnings
warnings.filterwarnings("ignore")

#Imports
# import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
import joblib
import numpy as np
# import seaborn as sns
# import matplotlib.pyplot as plt
from base64 import urlsafe_b64decode

class EnsembleAnalysis(modules.Module, modules.IOModule):

    def __init__(self):
        super(EnsembleAnalysis, self).__init__()
        self.stream = False

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        self.evaluate_stacking_model(data,
                                self.getTempFile('stack.pkl'),
                                self.getTempFile('rf_hpo.pkl'),
                                self.getTempFile('xg_hpo.pkl'),
                                self.getTempFile('rf_hpo.pkl'),
                                self.getTempFile('et_hpo.pkl'),
                                self.getTempFile('dt_hpo.pkl'))

    def start(self):
        # assumes data is {'filename', 'data'}
        # and that filenames are 'dt_hpo.pkl', 'et_hpo.pkl',
        # 'rf_hpo.pkl', 'stack.pkl', and 'xg_hpo.pkl'
        for k in self.data.keys():
            self.addTempFile(k, urlsafe_b64decode(self.data[k]))

    def stop(self):
        for k in self.data.keys():
            self.deleteTempFile(k)

    def evaluate_stacking_model(self, data, stack_model_file, xg_model_file,
                                rf_model_file, et_model_file, dt_model_file):

        # Load the data
        df = data

        # Z-score normalization
        features = df.dtypes[df.dtypes != 'object'].index
        df[features] = df[features].apply(lambda x: (x - x.mean()) / x.std())

        # Fill empty values with 0
        df = df.fillna(0)

        # Encode labels
        labelencoder = LabelEncoder()
        df.iloc[:, -1] = labelencoder.fit_transform(df.iloc[:, -1])

        # Get X and y
        X = df.drop(['Label'], axis=1).values
        y = df.iloc[:, -1].values.reshape(-1, 1)
        y = np.ravel(y)

        # Load models
        stack = joblib.load(stack_model_file)
        xg = joblib.load(xg_model_file)
        rf = joblib.load(rf_model_file)
        et = joblib.load(et_model_file)
        dt = joblib.load(dt_model_file)

        # Fit models
        dt.fit(X, y)
        et.fit(X, y)
        rf.fit(X, y)
        xg = xg.fit(X, y)

        # Make predictions
        dt_test = dt.predict(X)
        et_test = et.predict(X)
        rf_test = rf.predict(X)
        xg_test = xg.predict(X)

        # Reshape predictions
        dt_test = dt_test.reshape(-1, 1)
        et_test = et_test.reshape(-1, 1)
        rf_test = rf_test.reshape(-1, 1)
        xg_test = xg_test.reshape(-1, 1)

        # Stack predictions
        stk_test = np.concatenate((dt_test, et_test, rf_test, xg_test), axis=1)

        # Make final prediction with stacking model
        y_predict = stack.predict(stk_test)
        y_true = y

        # Calculate and print evaluation metrics
        stk_score = accuracy_score(y_true, y_predict)
        print('Accuracy of Stacking: ' + str(stk_score))
        precision, recall, fscore, none = precision_recall_fscore_support(y_true, y_predict, average='weighted')
        print('Precision of Stacking: ' + str(precision))
        print('Recall of Stacking: ' + str(recall))
        print('F1-score of Stacking: ' + str(fscore))
        print(classification_report(y_true, y_predict))
        # cm = confusion_matrix(y_true, y_predict)
        # f, ax = plt.subplots(figsize=(5, 5))
        # sns.heatmap(cm, annot=True, linewidth=0.5, linecolor="red", fmt=".0f", ax=ax)
        # plt.xlabel("y_pred")
        # plt.ylabel("y_true")
        # plt.show()
