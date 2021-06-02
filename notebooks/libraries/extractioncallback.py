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


# User Information:
# Retuired Input: [Model (tf model), Layer ( must correspond to a layer in the model),
#                  validation_data (contains lists of x and y values of testing
#                  split)]
class CallbackDataExtractor(Callback):

    # INFO: The untrained model is passed into the CallbackDataExtractor as an argument. Class
    #       functions may use this to retreive layers, and retreive data from layers as they
    #       are trained. Each set of data to be retreived from a layer receives its own
    #       variable in the __init__() function.
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
    

    def get_testing_results(self):
        return self.testing_results

    def get_stored_predictions(self):
        all_epoch_list = []
        for epoch in self.testing_results:
            all_epoch_list.append(epoch['prediction'].tolist())
        return all_epoch_list

    def set_stored_predictions(self, updated_list):
        for i in range(len(self.testing_results)):
            self.testing_results[i]['prediction'] = updated_list[i]



    def on_epoch_end(self, epoch, logs={}):
        print("Collecting data on epoch ", epoch, "...")
        if(epoch % self.sample_every == 0):
            # At end of each epoch, collects layer weights and output, as well as predictions on
            # each epoch.
            # NOTE: Currently using testing data for intermediate operations because this is also
            #       used in confusion matrix.
            layer_number = self.selected_layer

            # If this is a binary classifier the first prediction method will be used, otherwise
            # if it is multivariable then the second prediction method will be used. First
            # method checks for confidence over .5, while the second chooses the highest
            # available confidence score.
            model = self.model
            predictions = []
            if self.is_bin == True:
                predictions = (self.model.predict(self.validation_data[0]) > .5).astype("int32")
            else:
                predictions = model.predict(self.validation_data[0])
                predictions = list(predictions.argmax(axis=-1))

            # Collecting, scaling, and recording predictions and layer outputs...
            # predictions = self.model.predict(self.validation_data[0])
            self.stored_predictions = predictions
            # print("Debugging: predictions: ", predictions)

            conf_scores = self.model.predict(self.validation_data[0], batch_size=512)
            scaler = MinMaxScaler(feature_range=[0, 1])
            scaler.fit(conf_scores)
            conf_scores = scaler.transform(conf_scores)
            # print("Debugging: conf_scores: ", conf_scores)

            extractor = Model(
                inputs=self.model.inputs,
                outputs=[layer.output for layer in self.model.layers]
            )
            features = extractor(self.validation_data[0])
            if self.raw_input is not None:
                sentences = self.raw_input[:len(self.validation_data[0])]
            else:
                sentences = self.validation_data[0]
            
            temp_data = []
            if self.rec_int_values == True:
                temp_data = list(zip(
                    np.full(len(self.validation_data[0]), epoch),
                    self.validation_data[1],
                    predictions,
                    np.around(conf_scores, decimals=3),
                    features[layer_number].numpy().tolist(),
                    sentences
                ))
                column_list = [ 'epoch', 'actual', 'prediction', 'confidence_score', 'intermediate_values', 'input' ]
            else:
                temp_data = list(zip(
                    np.full(len(self.validation_data[0]), epoch),
                    self.validation_data[1],
                    predictions,
                    np.around(conf_scores, decimals=3),
                    sentences
                ))
                column_list = [ 'epoch', 'actual', 'prediction', 'confidence_score', 'input' ]

            epoch_test_results = pd.DataFrame(
                temp_data,
                columns= column_list
            )
            self.testing_results.append(epoch_test_results)

    def generateJSON(self, path, num_entries=None):
        captured_data = self.testing_results
        data = {}
        if num_entries == None:
            for i in range(len(captured_data[0])):
                data[i] = {}
                data[i]['Num Epochs'] = len(captured_data)
                data[i]['Index'] = i
                if self.is_bin:
                    data[i]['Test Label'] = int(captured_data[0]['actual'][i])
                else:
                    data[i]['Test Label'] = int(captured_data[0]['actual'][i].argmax())
                data[i]['Test Prediction'] = {}
                data[i]['Test Confidence Score'] = {}
                if self.rec_int_values is True:
                    data[i]['Intermediate Values'] = {}
                    for j in range(len(captured_data)):
                        data[i]['Intermediate Values'][j] = captured_data[j]['intermediate_values'][i]
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
        else:
            random_selection = random.sample(range(len(captured_data[0])), num_entries)
            for index, i in enumerate(random_selection):
                data[index] = {}
                data[index]['Num Epochs'] = len(captured_data)
                data[index]['Index'] = index
                if self.is_bin:
                    data[index]['Test Label'] = int(captured_data[0]['actual'][i])
                else:
                    data[index]['Test Label'] = int(captured_data[0]['actual'][i].argmax())
                data[index]['Test Prediction'] = {}
                data[index]['Test Confidence Score'] = {}
                if self.rec_int_values is True:
                    data[index]['Intermediate Values'] = {}
                    for j in range(len(captured_data)):
                        data[index]['Intermediate Values'][j] = captured_data[j]['intermediate_values'][i]
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


        with open(path, 'w') as outfile:
            json.dump(data, outfile, indent=4, sort_keys=False)

