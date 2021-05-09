import numpy as np
import pandas as pd
import tensorflow as tf
import sklearn
from keras.models import Model
from keras.callbacks import Callback
from sklearn.preprocessing import MinMaxScaler


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
