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
    def __init__(self, model, layer, validation_data, rec_int_values, raw_input=None):
        super().__init__()
        self.model = model
        self.validation_data = validation_data
        self.raw_input = raw_input
        self.selected_layer = layer
        self.testing_results = []
        self.stored_predictions = []
        self.rec_int_values = rec_int_values
    

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
        # At end of each epoch, collects layer weights and output, as well as predictions on
        # each epoch.
        # NOTE: Currently using testing data for intermediate operations because this is also
        #       used in confusion matrix.
        layer_number = self.selected_layer

        # Collecting, scaling, and recording predictions and layer outputs...
        predictions = self.model.predict(self.validation_data[0])
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
                conf_scores,
                features[layer_number].numpy().tolist(),
                sentences
            ))
            column_list = [ 'epoch', 'actual', 'prediction', 'confidence_score', 'intermediate_values', 'input' ]
        else:
            temp_data = list(zip(
                np.full(len(self.validation_data[0]), epoch),
                self.validation_data[1],
                predictions,
                conf_scores,
                sentences
            ))
            column_list = [ 'epoch', 'actual', 'prediction', 'confidence_score', 'input' ]

        # print("Debugging: features: ", features[layer_number].numpy().tolist())
        epoch_test_results = pd.DataFrame(
            temp_data,
            columns= column_list
        )
        self.testing_results.append(epoch_test_results)
