# Treebased model loading file

from sklearn.preprocessing import LabelEncoder
import joblib
import numpy as np
from base64 import urlsafe_b64decode

class TreeBasedAnalysis(modules.Module, modules.IOModule):

    def __init__(self):
        super(TreeBasedAnalysis, self).__init__()

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        if data is None:
            return
        r = str(self.evaluate_stacking_model(
                    data,
                    self.getTempFilePath('dt_model.pkl'),
                    self.getTempFilePath('stk_model.pkl'),
                    self.getTempFilePath('xg_model.pkl'),
                    self.getTempFilePath('rf_model.pkl'),
                    self.getTempFilePath('et_model.pkl')))
        print('Class for interval of network data: ' + r)
        self.setOutput(str(r))
        return r

    def start(self):
        for k in self.data.keys():
            self.addTempFile(k, urlsafe_b64decode(self.data[k]))
        self.log('Starting Tree-based Analysis Module')

    def stop(self):
        for k in self.data.keys():
            self.deleteTempFile(k)

    def evaluate_stacking_model(self, data, dt_model_file, stk_model_file, xg_model_file, rf_model_file, et_model_file):

        # Load the data
        df = data

        print(df.shape[1])

        # Z-score normalization
        features = df.dtypes[df.dtypes != 'object'].index
        df[features] = df[features].apply(lambda x: (x - x.mean()) / x.std())

        # Fill empty values with 0
        df = df.fillna(0)

        X_test= df

        # Encode labels
        labelencoder = LabelEncoder()
        df.iloc[:, -1] = labelencoder.fit_transform(df.iloc[:, -1])

        # Get X and y
        y = df.iloc[:, -1].values.reshape(-1, 1)
        y = np.ravel(y)


        # Load models
        dt = joblib.load(dt_model_file)
        print(dir(dt))
        stack = joblib.load(stk_model_file)
        xg = joblib.load(xg_model_file)
        rf = joblib.load(rf_model_file)
        et = joblib.load(et_model_file)

        # Make predictions
        try:
            dt_test = dt.predict(X_test)
            et_test = et.predict(X_test)
            rf_test = rf.predict(X_test)
            xg_test = xg.predict(X_test)
        except:
            return

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
