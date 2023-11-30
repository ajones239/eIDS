# -*- coding: utf-8 -*-
"""CNN_Analysis_Module.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/10KRKAme8eUeRAi7GgnSEAFYHaeO1ObA1
"""
# converter model install dependency
# import os
# os.system('pip install tab2img')

#imports
# import pip
import os
import numpy as np
# import pandas as pd
# from tab2img.converter import Tab2Img
from sklearn.preprocessing import StandardScaler
from PIL import Image
import pickle
# import warnings
# import matplotlib.pyplot as plt
from keras.preprocessing import image
from keras.models import load_model
from base64 import urlsafe_b64decode
import urllib.request


class CNNAnalysis(modules.Module, modules.IOModule):

    def __init__(self):
        super(CNNAnalysis, self).__init__()

    def getOutput(self):
        return self.getOutputData()

    def addInput(self, moduleId, data):
        if data is None:
            return
        r = self.predict_max_class_label(
                    self.getTempFilePath('resnet.h5'),
                    self.getTempDir(),
                    self.getTempFilePath('converter.pkl'),
                    data)
        print('Class for interval of network data: ' + str(r))

    def start(self):
        self.addTempFile('none', b'0')
        urllib.request.urlretrieve(self.data['resnet.h5_url'], self.getTempFilePath('resnet.h5'))
        self.addTempFile('converter.pkl', urlsafe_b64decode(self.data['converter.pkl']))

    def stop(self):
        self.deleteTempFile('converter.pkl')
        self.deleteTempFile('resnet.h5')

    def predict_max_class_label(self, model_path, image_folder_path, converter_path, df):

        # Using to test 10 samples for faster inference
        # Can use entire data too, remove nrows param when reading data
        n_samples = 10

        # Define a dictionary to map class labels to their names
        index_to_attack = {0: "Normal", 1: "Bot", 2: "BruteForce", 3: "DoS", 
                   4: "Infiltration", 5: "PortScan", 6: "WebAttack"}

        if len(df) > n_samples:
            df = df.head(n_samples)

        # Read dataset
        # df = pd.read_csv(data_path, nrows=n_samples)
        try:
            X = df.drop(["Label"], axis=1)
        except KeyError:
            X = df

        # Scale all data [0,1]
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        # Load the model and its associated data for fitting test data to model
        with open(converter_path, "rb") as model_file:
            loaded_converter, loaded_mapping = pickle.load(model_file)

        # Use the loaded model to transform new data
        test_images = loaded_converter.transform(X_scaled)

        # Define the output directory for test images
        output_directory = image_folder_path

        # Ensure the output directory exists
        os.makedirs(output_directory, exist_ok=True)

        # Save test_images
        for i, this_image in enumerate(test_images):
            image_path = os.path.join(output_directory, f"test_image_{i}.png")
            this_image = (this_image * 255).astype('uint8')  # Convert the image back to 8-bit format
            Image.fromarray(this_image).save(image_path)

        # Load the saved model
        model = load_model(model_path)

        max_prediction = -1  # Initialize with a very low value
        max_class_label = -1

        # Iterate through files in the directory
        for file in os.listdir(image_folder_path):
            if not (file.endswith(".jpeg") or file.endswith(".jpg") or file.endswith(".png")):
                continue

            # Load the image
            image_path = os.path.join(image_folder_path, file)
            new_image = image.load_img(image_path, target_size=(224, 224))

            # Preprocess the image
            new_image = image.img_to_array(new_image)
            new_image = np.expand_dims(new_image, axis=0)
            new_image = new_image / 255.0  # Normalize the image

            # Make predictions
            predictions = model.predict(new_image)

            # Get the class label with the highest prediction score
            class_label = np.argmax(predictions, axis=1)[0]

            # Update max_prediction and max_class_label if needed
            if predictions[0, class_label] > max_prediction:
                max_prediction = predictions[0, class_label]
                max_class_label = class_label

        # Map the class label to the attack name
        attack_name = index_to_attack.get(max_class_label, 'Unknown Attack')
        
        self.setOutput(attack_name)
        return attack_name

# src paths
# model_path = "/content/drive/MyDrive/Master's project stuff/SavedModels/resnet.h5"
# image_folder_path = "/content/drive/MyDrive/Master's project stuff/images/temp_test"
# converter_path = "/content/drive/MyDrive/Master's project stuff/SavedModels/converter.pkl"
# data_path = "/content/drive/MyDrive/Master's project stuff/datasets/CICIDS2017_sample_km.csv"

# Predict the class label with the highest prediction score
# max_class_label = predict_max_class_label(model_path, image_folder_path, converter_path, data_path)
# print("Most predicted class label:", max_class_label)
