import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
import sklearn
from tensorflow.keras.models import Model
from tensorflow.keras.callbacks import Callback
from sklearn.preprocessing import MinMaxScaler
import random
import os
import sys
import json

class CallbackDataExtractor(Callback):

    # INFO: The untrained model is passed into the CallbackDataExtractor as an argument. Class
    #       functions may use this to retreive layers, and retreive data from layers as they
    #       are trained. Each set of data to be retreived from a layer receives its own
    #       variable in the __init__() function.
    '''---------------------------------------------------------------------------------------------------
    Function: constructor
        Arguments:
            model               takes a TensorFlow model as an argument
            layer               integer representing the layer to collect data from
            validation_data     set of test data, separated into a tuple, formatted as (x_test_data, y_test_data)
            rec_int_values      integer set to 1 or 0 to toggle whether or not to record vales from hiddent layers
            is_bin              integer set to 1 or 0 to determine whether results need to be output as a binary or multinomial classifier
            sample_every        integer determines what interval to sample data at
            raw_input           depreciated variable
    ---------------------------------------------------------------------------------------------------'''
    def __init__(self, model, layer, validation_data, rec_int_values, is_bin, sample_every=1, raw_input=None):
        super().__init__()
        self.model = model
        self.validation_data = validation_data
        self.raw_input = raw_input
        self.selected_layer = layer
        self.testing_results = []
        self.stored_predictions = []
        self.rec_int_values = rec_int_values
        self.is_bin = is_bin
        self.sample_every = sample_every
    
    '''---------------------------------------------------------------------------------------------------
    Function: get_testing_results()
        Returns testing results variable.
    ---------------------------------------------------------------------------------------------------'''
    def get_testing_results(self):
        return self.testing_results

    '''---------------------------------------------------------------------------------------------------
    Function: get_stored_predictions()
        Fetches predictions from each epochs data, and places it into a list to return.
    ---------------------------------------------------------------------------------------------------'''
    def get_stored_predictions(self):
        all_epoch_list = []
        for epoch in self.testing_results:
            all_epoch_list.append(epoch['prediction'].tolist())
        return all_epoch_list

    '''---------------------------------------------------------------------------------------------------
    Function: set_stored_predictions()
        Depreciated function used to set the values of predictions for each epoch.
    ---------------------------------------------------------------------------------------------------'''
    def set_stored_predictions(self, updated_list):
        for i in range(len(self.testing_results)):
            self.testing_results[i]['prediction'] = updated_list[i]

    '''---------------------------------------------------------------------------------------------------
    Function: on_epoch_end()
        Collects predictions, confidence scores, and intermediate data from the model after each epoch and
        combines with the true labels to data, as well as the original inputs. Storing them in an array
        of dataFrames with each dataFrame representing an epoch's data.
    ---------------------------------------------------------------------------------------------------'''
    def on_epoch_end(self, epoch, logs={}):
        print("Collecting data on epoch ", epoch, "...")
        if(epoch % self.sample_every == 0):                                                           # Check whether or not sampling shold take places this epoch
            layer_number = self.selected_layer                                                        # Integer representing layer to extract intermediate data from
            model = self.model                                                                        # Cretaing a TensorFlow model to make predictions on data with
            predictions = []                                                                          # Predictions for a single epoch are stored in this variable
            # Prediction method varies based on whether or not model is a binary classifier. Binary   # 
            # classifier looks to see if confidence scores are greater than .5 to decide, where       # 
            # multinomial classifiers look to see the highest valued prediction among the possible    # 
            # output labels.                                                                          # 
            if self.is_bin == True:                                                                   # 
                predictions = (self.model.predict(self.validation_data[0]) > .5).astype("int32")      # 
            else:                                                                                     # 
                predictions = model.predict(self.validation_data[0])                                  # 
                predictions = list(predictions.argmax(axis=-1))                                       # 
            self.stored_predictions = predictions                                                     # Depreciated, holds the most recent epoch's predictions
            conf_scores = self.model.predict(self.validation_data[0], batch_size=512)                 # Confidence scores are saved from model prediction
            scaler = MinMaxScaler(feature_range=[0, 1])                                               # Scaler created to ensure conf scores range from 1 to 0
            scaler.fit(conf_scores)                                                                   # Scaler is applied to saved confidence scores
            conf_scores = scaler.transform(conf_scores)                                               # 
            extractor = Model(                                                                        # Model is defined as only an input and output layer
                inputs=self.model.inputs,                                                             # 
                outputs=[layer.output for layer in self.model.layers]                                 # 
            )                                                                                         # 
            features = extractor(self.validation_data[0])                                             # Gathering intermediate data from the selected hidden layer
            # If a value is given for 'raw input', this data replaces the x data for validation_data  # 
            # this is mostly depreciated and should be either ignored or replaced, to only enact the  # 
            # else condition.                                                                         # 
            if self.raw_input is not None:                                                            # 
                sentences = self.raw_input[:len(self.validation_data[0])]                             # 
            else:                                                                                     # 
                sentences = self.validation_data[0]                                                   # 
            temp_data = []                                                                            # 
            # Depending on whether or not intermediate data is set to be collected by the extractor   # 
            # a different data structure will have to be used to store data. Since both the confusion # 
            # matrix and the barcode plot use intermediate level data, it is unlikely that it will    # 
            # not be recorded.                                                                        # 
            if self.rec_int_values == True:                                                           # 
                temp_data = list(zip(                                                                 # 
                    np.full(len(self.validation_data[0]), epoch),                                     # Include the current epoch number with stored data
                    self.validation_data[1],                                                          # 'True Label' or y of test set
                    predictions,                                                                      # 
                    np.around(conf_scores, decimals=3),                                               # Confidence scores are limited to 3 decimals
                    features[layer_number].numpy().tolist(),                                          # Fetch data from a layer and store in a dataFrame friendly format
                    sentences                                                                         # 
                ))                                                                                    # 
                column_list = [ 'epoch', 'actual', 'prediction', 'confidence_score',                  # 
                    'intermediate_values', 'input' ]                                                  # 
            else:                                                                                     # 
                temp_data = list(zip(                                                                 # 
                    np.full(len(self.validation_data[0]), epoch),                                     # 
                    self.validation_data[1],                                                          # 
                    predictions,                                                                      # 
                    np.around(conf_scores, decimals=3),                                               # 
                    sentences                                                                         # 
                ))                                                                                    # 
                column_list = [ 'epoch', 'actual', 'prediction', 'confidence_score', 'input' ]        # 
            epoch_test_results = pd.DataFrame(                                                        # Data is placed into a dataFrame
                temp_data,                                                                            # 
                columns= column_list                                                                  # 
            )                                                                                         # 
            self.testing_results.append(epoch_test_results)                                           # Epoch's data is added to a list of dataFrames

    '''---------------------------------------------------------------------------------------------------
    Function: generateJSON()
        Take the array of dataFrames generated as epochs are run through, and store these into a JSON
        file. 
        Arguments:
            path                    location to store json file in
            num_entries             dictate how many data points are stored in the resulting JSON file
    ---------------------------------------------------------------------------------------------------'''
    def generateJSON(self, path, num_entries=None):
        captured_data = self.testing_results
        data = {}
        # Storing the entire data set
        if num_entries == None:
            for i in range(len(captured_data[0])):
                data[i] = {}
                data[i]['Num Epochs'] = len(captured_data)
                data[i]['Index'] = i
                # Determine how to store data based on if model is bivariate or multivariate
                if self.is_bin:
                    data[i]['Test Label'] = int(captured_data[0]['actual'][i])
                else:
                    data[i]['Test Label'] = int(captured_data[0]['actual'][i].argmax())
                data[i]['Test Prediction'] = {}
                data[i]['Test Confidence Score'] = {}
                # Only store intermediate values the JSON file if it has been recorded earlier
                if self.rec_int_values is True:
                    data[i]['Intermediate Values'] = {}
                    for j in range(len(captured_data)):
                        data[i]['Intermediate Values'][j] = captured_data[j]['intermediate_values'][i]
                # Ensure that binary classification does not store data nested into another array
                if self.is_bin is True:
                    for j in range(len(captured_data)):
                        data[i]['Test Prediction'][j] = int(captured_data[j]['prediction'][i][0])
                        data[i]['Test Confidence Score'][j] = [round(float(captured_data[j]['confidence_score'][i][0]), 3)]
                    data[i]['Test Sentence'] = captured_data[0]['input'][i]
                else:
                    for j in range(len(captured_data)):
                        data[i]['Test Prediction'][j] = int(captured_data[j]['prediction'][i])
                        data[i]['Test Confidence Score'][j] = captured_data[j]['confidence_score'][i].tolist()
                    data[i]['Test Sentence'] = captured_data[0]['input'][i].tolist()
        # Storing a random subset of data points limited by num_entries
        else:
            random_selection = random.sample(range(len(captured_data[0])), num_entries)
            for index, i in enumerate(random_selection):
                data[index] = {}
                data[index]['Num Epochs'] = len(captured_data)
                data[index]['Index'] = index
                # Determine how to store data based on if model is bivariate or multivariate
                if self.is_bin:
                    data[index]['Test Label'] = int(captured_data[0]['actual'][i])
                else:
                    data[index]['Test Label'] = int(captured_data[0]['actual'][i].argmax())
                data[index]['Test Prediction'] = {}
                data[index]['Test Confidence Score'] = {}
                # Only store intermediate values the JSON file if it has been recorded earlier
                if self.rec_int_values is True:
                    data[index]['Intermediate Values'] = {}
                    for j in range(len(captured_data)):
                        data[index]['Intermediate Values'][j] = captured_data[j]['intermediate_values'][i]
                # Ensure that binary classification does not store data nested into another array
                if self.is_bin is True:
                    for j in range(len(captured_data)):
                        data[index]['Test Prediction'][j] = int(captured_data[j]['prediction'][i][0])
                        data[index]['Test Confidence Score'][j] = [round(float(captured_data[j]['confidence_score'][i][0]), 3)]
                    data[index]['Test Sentence'] = captured_data[0]['input'][i]
                else:
                    for j in range(len(captured_data)):
                        data[index]['Test Prediction'][j] = int(captured_data[j]['prediction'][i])
                        data[index]['Test Confidence Score'][j] = captured_data[j]['confidence_score'][i].tolist()
                    data[index]['Test Sentence'] = captured_data[0]['input'][i].tolist()
        # Open a file with the name given in path, and store the data in json format here
        with open(path, 'w') as outfile:
            json.dump(data, outfile, indent=4, sort_keys=False)
