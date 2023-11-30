# Treebased model loading file

from re import X
import warnings
warnings.filterwarnings("ignore")


import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix
from scipy import stats
import joblib
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import pickle
import os

# def evaluate_stacking_model(data_file, stack_model_file, xg_model_file, rf_model_file, et_model_file, dt_model_file, xgb_model, select_features_file):

def evaluate_stacking_model(data_file, dt_model_file, stk_model_file, xg_model_file, rf_model_file, et_model_file):

    # #mount drive
    from google.colab import drive
    drive.mount('/content/drive')


    # Load the data
    df = pd.read_csv(data_file)

    print(df.shape[1])

    # Z-score normalization
    features = df.dtypes[df.dtypes != 'object'].index
    df[features] = df[features].apply(lambda x: (x - x.mean()) / x.std())

    # Fill empty values with 0
    df = df.fillna(0)

    X_test= df

    # #Feature selection - using saved approach from training to use same set of features
    # X_test = df[loaded_fs].values
    # print(X_test)
    # print(X_test.shape)


    # Encode labels
    labelencoder = LabelEncoder()
    df.iloc[:, -1] = labelencoder.fit_transform(df.iloc[:, -1])

    # Get X and y
    X = df.drop(['Label'], axis=1).values
    y = df.iloc[:, -1].values.reshape(-1, 1)
    y = np.ravel(y)


    # Load models
    dt = joblib.load(dt_model_file)
    print(dir(dt))
    stack = joblib.load(stk_model_file)
    xg = joblib.load(xg_model_file)
    rf = joblib.load(rf_model_file)
    et = joblib.load(et_model_file)

    # et = joblib.load(et_model_file)
    # print(et_model_file)
    # print(os.path.exists(dt_model_file))
    # with open(et_model_file,'rb') as f:
    #    content = f.read()
    # print(content[:100])
    # with open(et_model_file, 'rb') as f:
    #  et = pickle.load(f)
    # xgb = joblib.load(xgb_model)


    # Make predictions
    dt_test = dt.predict(X_test)
    et_test = et.predict(X_test)
    rf_test = rf.predict(X_test)
    xg_test = xg.predict(X_test)
    # xgb_test = xgb.predict(X_test)

    # Reshape predictions
    dt_test = dt_test.reshape(-1, 1)
    et_test = et_test.reshape(-1, 1)
    rf_test = rf_test.reshape(-1, 1)
    xg_test = xg_test.reshape(-1, 1)

    # Stack predictions
    stk_test = np.concatenate((dt_test, et_test, rf_test, xg_test), axis=1)

    # Make final prediction with stacking model
    y_predict = stack.predict(stk_test)
    print(y_predict)

    # Find the most common class in y_predict
    most_common_class = np.bincount(y_predict).argmax()


    print("Most Common Class in y_predict:", most_common_class)

    return most_common_class



evaluate_stacking_model("/content/drive/Shareddrives/Master's Project I/Treebased_Analysis/CICIDS2017_sample.csv",
                        "/content/drive/Shareddrives/Master's Project I/Treebased_Analysis/dt_model.pkl",
                        "/content/drive/Shareddrives/Master's Project I/Treebased_Analysis/stk_model.pkl",
                         "/content/drive/Shareddrives/Master's Project I/Treebased_Analysis/xg_model.pkl",
                        "/content/drive/Shareddrives/Master's Project I/Treebased_Analysis/rf_model.pkl",
                        "/content/drive/Shareddrives/Master's Project I/Treebased_Analysis/et_model.pkl")
