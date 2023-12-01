# -*- coding: utf-8 -*-
"""bigan_analysis.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1EsXNCZBG8AVpUE9Q_o2mpfPaN6fnszO3
"""

# imports
import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from keras.models import load_model
from keras.utils import CustomObjectScope


class BiGANAnalysis(modules.Module, modules.IOModule):

    def __init__(self):
        super(BiGANAnalysis, self).__init__()

    def getOutput(self):
        return self.getOuputData()

    def addInput(self, moduleId, data):
        if data is None:
            return
        try:
            r = self.evaluate_bigan_model(
                        data,
                        self.getTempDir(),
                        self.getTempFilePath('column_transformer.joblib'),
                        self.getTempFilePath('min_max_scaler.joblib'))
        except ValueError:
            return
        print('Class for interval of network data: ' + str(r))
        self.setOutput(str(r))
        return str(r)

    def start(self):
        # assumes data is {'filename': 'data'}
        # and that filenames are BiGAN_bigan.hdf5, BiGAN_discriminator_focal.hdf5,
        # BiGAN_encoder.hdf5, column_transformer.joblib, & min_max_scaler.joblib
        for k in self.data.keys():
            self.addTempFile(k, urlsafe_b64decode(self.data[k]))
        self.log('Starting BiGAN Analysis Module')

    def stop(self):
        for k in self.data.keys():
            self.deleteTempFile(k)

    def evaluate_bigan_model(self, data, models_path, ct_path, scaler_path, threshold=0.35):
        def focal_loss(gamma=2., alpha=.25):
            def focal_loss_fixed(y_true, y_pred):
                pt_1 = tf.where(tf.equal(y_true, 1), y_pred, tf.ones_like(y_pred))
                pt_0 = tf.where(tf.equal(y_true, 0), y_pred, tf.zeros_like(y_pred))
                return -tf.keras.backend.mean(alpha * tf.keras.backend.pow(1. - pt_1, gamma) * tf.keras.backend.log(pt_1)) \
                       - tf.keras.backend.mean((1-alpha) * tf.keras.backend.pow(pt_0, gamma) * tf.keras.backend.log(1. - pt_0))
            return focal_loss_fixed

        # Load models
        with CustomObjectScope({'focal_loss_fixed': focal_loss()}):
            discriminator = load_model(f"{models_path}/BiGAN_discriminator_focal.hdf5")
        encoder = load_model(f"{models_path}/BiGAN_encoder.hdf5")

        # Load data
        X_new = data

        # Preprocess data
        ct_loaded = joblib.load(ct_path)
        scaler_loaded = joblib.load(scaler_path)
        X_new_encoded = ct_loaded.transform(X_new)
        X_new_scaled = scaler_loaded.transform(X_new_encoded)

        # Make predictions
        z_test_new = encoder.predict(X_new_scaled)
        y_pred_prob_new = discriminator.predict([z_test_new, X_new_scaled])
        y_pred_adjusted_new = (y_pred_prob_new > threshold).astype(int).flatten()

        # Determine the most frequent label
        label_counts = np.bincount(y_pred_adjusted_new)
        max_label_index = np.argmax(label_counts)
        max_label = 'Normal' if max_label_index == 0 else 'Anomalous'

        return max_label
