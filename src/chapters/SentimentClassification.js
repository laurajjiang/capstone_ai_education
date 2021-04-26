import React from "react";
import Navigation from "../components/navbar";
import Description from "../components/description";
import { Callout, Button, Intent } from "@blueprintjs/core";
import { CopyBlock, nord, a11yLight } from "react-code-blocks";
import Spacer from "../components/spacer";
import ConfusionMatrix from "../components/confusionMatrix";
import Container from "../components/container";
import "../index.css";
import data from "./predict_nn.json";

const objectives = [
  {
    obj:
      "How does text classification differ from the classifications that we've gone over in the previous chapters?",
    tag: "#build-model",
  },
  {
    obj:
      "Describe how sentiment classification works at a high level -- how is data transformed? How does the model learn to predict sentiment?",
    tag: "#build-model",
  },
  {
    obj:
      "What information can you gather from the barcode visualization? How are similar words displayed and grouped together?",
    tag: "#build-model",
  },
];

const importCode = `!pip install -q tensorflow-hub
!pip install patool

import os
import sys
import numpy as np

import tensorflow as tf
import tensorflow_hub as hub
import libraries.mlvislib as mlvs
from IPython.display import display
import ipywidgets as widgets
import pandas as pd
`;

const loadDataCode = `dataset = pd.read_csv("dataset/IMDB Dataset.csv")
dataset = dataset[:25000]

dataset.isnull().values.any()
dataset.shape
`;

const loadDataOutput = `(25000, 2)
`;

const exploreData = `import seaborn as sns

sns.countplot(x='sentiment', data=dataset)
dataset["review"][:9]
`;

const exploreDataOutput = `
0    One of the other reviewers has mentioned that ...
1    A wonderful little production. <br /><br />The...
2    I thought this was a wonderful way to spend ti...
3    Basically there's a family where a little boy ...
4    Petter Mattei's "Love in the Time of Money" is...
5    Probably my all-time favorite movie, a story o...
6    I sure would like to see a resurrection of a u...
7    This show was an amazing, fresh & innovative i...
8    Encouraged by the positive comments about this...
`;

const dataManip = `from sklearn.model_selection import train_test_split
import re

def cleanText(sentence):

    # Remove punctuations and numbers
    sentence = re.sub('[^a-zA-Z]', ' ', sentence)

    # Single character removal
    sentence = re.sub(r"\s+[a-zA-Z]\s+", ' ', sentence)

    # Removing multiple spaces
    sentence = re.sub(r'\s+', ' ', sentence)

    return sentence

def preProcess(text):
    # Make lower case
    text = text.lower()

    # Replace non-text characters with spaces
    nonText = string.punctuation + ("")
    text = text.translate(str.maketrans(nonText, ' ' * (len(nonText))))

    # Tokenize
    words = text.split()

    return words`;

const dataManip2 = `y = dataset['sentiment']

y = np.array(list(map(lambda x: 1 if x=="positive" else 0, y)))

x_train, x_test, y_train, y_test = train_test_split(dataset['review'], y, test_size=0.4, random_state=42)

print(x_train)`;

const dataManipOutput = `
18930    "Wired" would have to rate as one of the ten w...
2791     A 'Wes Craven presents' movie from 1995, direc...
388      A lovely little B picture with all the usual J...
22764    I am going to go out on a limb, and actually d...
24934    To put in simple words or rather a word, would...
                               ...                        
21575    I enjoyed a lot watching this movie. It has a ...
5390     I can't knock this film too terribly, because ...
860      This production was quite a surprise for me. I...
15795    This is a decent movie. Although little bit sh...
23654    Another very good Mann flick thanks to the fat...
`;

const createModel = `
from keras.models import Sequential
from keras.layers.core import Activation, Dropout, Dense
from keras.layers import Flatten
from keras.layers import GlobalMaxPooling1D
from keras.layers.embeddings import Embedding

embedding = "https://tfhub.dev/google/nnlm-en-dim50/2"
hub_layer = hub.KerasLayer(embedding, input_shape=[], 
                           dtype=tf.string, trainable=True)

model = Sequential()
model.add(hub_layer)
model.add(Dense(16, activation='relu'))
model.add(Dense(1))

model.summary()
])

model.compile(optimizer='sgd', loss='categorical_crossentropy', metrics=['accuracy'])

model.summary()`;

const createModelOutput = `Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
keras_layer (KerasLayer)     (None, 50)                48190600  
_________________________________________________________________
dense (Dense)                (None, 16)                816       
_________________________________________________________________
dense_1 (Dense)              (None, 1)                 17        
=================================================================
Total params: 48,191,433
Trainable params: 48,191,433
Non-trainable params: 0
_________________________________________________________________`;

const trainModel = `history = model.fit(x_train, y_train, batch_size=512, epochs=10, verbose=1, validation_split=0.2)`;

const trainModelOutput = `Epoch 1/10
24/24 [==============================] - 10s 416ms/step - loss: 0.6357 - accuracy: 0.5810 - val_loss: 0.5924 - val_accuracy: 0.6273
Epoch 2/10
24/24 [==============================] - 10s 416ms/step - loss: 0.5365 - accuracy: 0.7114 - val_loss: 0.5102 - val_accuracy: 0.7080
Epoch 3/10
24/24 [==============================] - 10s 415ms/step - loss: 0.4270 - accuracy: 0.8153 - val_loss: 0.4303 - val_accuracy: 0.7863
Epoch 4/10
24/24 [==============================] - 10s 421ms/step - loss: 0.3238 - accuracy: 0.8804 - val_loss: 0.3752 - val_accuracy: 0.8297
Epoch 5/10
24/24 [==============================] - 10s 421ms/step - loss: 0.2433 - accuracy: 0.9158 - val_loss: 0.3438 - val_accuracy: 0.8510
Epoch 6/10
24/24 [==============================] - 11s 445ms/step - loss: 0.1830 - accuracy: 0.9427 - val_loss: 0.3264 - val_accuracy: 0.8567
Epoch 7/10
24/24 [==============================] - 10s 406ms/step - loss: 0.1371 - accuracy: 0.9633 - val_loss: 0.3194 - val_accuracy: 0.8587
...`;

const evaluateModel = `from sklearn.metrics import classification_report
from sklearn.preprocessing import MinMaxScaler

# make a prediction
testingPredictions = (model.predict(x_test) > 0.5).astype("int32")
print(len(testingPredictions))
confidence_scores = model.predict(x_test, batch_size=512)

# scaling confidence scores to range between 0 and 1 with MinMaxScaler 
scaler = MinMaxScaler(feature_range=[0, 1])
scaler.fit(confidence_scores)
confidence_scores = scaler.transform(confidence_scores)
print(confidence_scores)

target_names = ['negative', 'positive']
print(classification_report(y_test, testingPredictions, target_names=target_names))
`;

const evaluateModelOutput = `   
               precision    recall  f1-score   support

negative       0.86      0.88      0.87      5002
positive       0.88      0.85      0.86      4998

accuracy                           0.87     10000
macro avg       0.87      0.87      0.87     10000
weighted avg       0.87      0.87      0.87     10000
`;

const buttonGroup = (
  <div className='button-group'>
    <Button
      className='primary-button'
      intent={Intent.PRIMARY}
      text='View on GitHub'
    />
    <Button
      className='primary-button'
      intent={Intent.PRIMARY}
      text='Download notebook'
    />
    <Button
      className='primary-button'
      intent={Intent.PRIMARY}
      text='View in Google Colab'
    />
  </div>
);

function objectiveComponent() {
  return objectives.map((obj, index) => {
    return (
      <a href={obj.tag}>
        <div>
          5.{index}
          <h3>{obj.obj}</h3>
        </div>
      </a>
    );
  });
}

const introBlock = (
  <div id='introduction'>
    Now, we're going to move onto tackling a completely new topic - text
    classification. Specifically, this chapter will cover sentiment
    classification using restaurant reviews pulled from Yelp. We'll still use a
    familiar model (a neural network) but also with an extra trick that you may
    not have seen before.
    <Spacer space='1vh' />
    Language and text can get very complicated which makes creating these
    algorithms difficult. Some things that make language difficult could be
    words that have multiple meanings, negation words (words such as not),
    slang, etc.
  </div>
);

const setupBlock = (
  <div>
    <h1>Set up libraries</h1>
    We will be using the same libraries that we typically import here --{" "}
    <code>Tensorflow, numpy, matplotlib, sklearn</code>.
    <Spacer space='1vh' />
    <CopyBlock
      text={importCode}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
  </div>
);

const exploreDataBlock = (
  <div>
    <h1>Load and explore the dataset</h1>
    We will be using a new dataset here since the type of classification we are
    working with works best when using a textual dataset. Each item in this data
    set will be a sentence marked as a positive or negative review.
    <Spacer space='1vh' />
    <CopyBlock
      text={loadDataCode}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    <CopyBlock
      text={loadDataOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    We can look at what some of these reviews are as well:
    <Spacer space='1vh' />
    <CopyBlock
      text={exploreData}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    <CopyBlock
      text={exploreDataOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
  </div>
);

const manipDataBlock = (
  <div id='explore_data'>
    <h1>Preparing and manipulating the data for our model</h1>A new type of data
    transformation is needed to work with our model. Namely, we need to strip
    our sentences clean of any punctuation and also transform them into
    individual tokens. To make sure that no errors occur, in our{" "}
    <code>preProcess</code> function we will turn the entire sentence into
    lowercase, replace any punctuation with spaces, and split the sentence into
    individual words -- or tokens, for our model's sake.
    <Spacer space='1vh' />
    As with most datasets, we also have to split our dataset up into a training
    set and test set on our own using the <code>train_test_split</code> function
    imported from <code>sklearn.model_selection</code> that we've used in
    previous chapters.
    <Spacer space='1vh' />
    <CopyBlock
      text={dataManip}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    <CopyBlock
      text={dataManip2}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
  </div>
);

const buildModelBlock = (
  <div id='build_model'>
    <h1>Building our model</h1>
    This model is fairly straightforward, except the extra catch is the addition
    of a hub, or a model that has already been trained in some regards. Since we
    are working with text classification, we have a few options available to
    use. For now, we'll use one called{" "}
    <a href='https://tfhub.dev/google/nnlm-en-dim50/2'>
      google/nnlm-en-dim50/2
    </a>
    but there are a few others that you can check out from the{" "}
    <a href='https://tfhub.dev/s?module-type=text-embedding'>
      Tensorflow Hub page.
    </a>
    <Spacer space='1vh' />
    We'll first create a Keras layer from the Hub model and use it as our first
    layer in our model. Then, we'll create a single Dense hidden layer with 16
    nodes. Our last layer is just a single output node, connected to the hidden
    layer. You'll notice that our optimizer and loss function will stay
    consistent, using <code>sgd</code> and <code>categorical_crossentropy</code>
    .
    <Spacer space='1vh' />
    <CopyBlock
      text={createModel}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <CopyBlock
      text={createModelOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
  </div>
);

const trainModelBlock = (
  <div id='train_model'>
    <h1>Training the model</h1>
    Our batch size will be adjusted a bit from some of our previous chapters.
    Since we have more input, we'll increase our batch size and decrease the
    number of epochs that we spend training our model.
    <Spacer space='1vh' />
    How does the accuracy change using the Hub as our first layer compared to
    one of the regular neural network model that we used earlier? Why do you
    think that is?
    <Spacer space='1vh' />
    <CopyBlock
      text={trainModel}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <CopyBlock
      text={trainModelOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    Here is the accuracy and loss graph across epochs.
    <Spacer space='1vh' />
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>PLACEHOLDER</span>
    </div>
  </div>
);

const evaluateModelBlock = (
  <div>
    <h1>Evaluating the model</h1>
    We can now test our model to evaluate its accuracy and loss.
    <Spacer space='1vh' />
    <CopyBlock
      text={evaluateModel}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    Below is the prediction vector output by the model. The index with the
    highest probability is the type of iris the classification model has
    predicted the data corresponds to (0, 1, or 2).
    <Spacer space='1vh' />
    <CopyBlock
      text={evaluateModelOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
  </div>
);

const visualizationBlock = (
  <div>
    <h1>Intepreting the results</h1>
    Here is the confusion matrix for our neural network.
    <Spacer space='1vh' />
    <span>PLACEHOLDER</span>
  </div>
);

const pageContent = (
  <>
    <Spacer space='1vh' />
    <div className='title'>
      chapter 5 - sentiment classification with a neural network
    </div>
    {buttonGroup}
    <div className='card'>
      <h2>Chapter Objectives</h2>
      {objectiveComponent()}
    </div>
    <Spacer space='1vh' />
    <Description content={introBlock} />
    <Description content={setupBlock} />
    <Description content={exploreDataBlock} />
    <Description content={manipDataBlock} />
    <Description content={buildModelBlock} />
    <Description content={trainModelBlock} />
    <Description content={evaluateModelBlock} />
    <Description content={visualizationBlock} />
    {/* <ConfusionMatrix data={data} /> */}
    <Spacer space='1vh' />
    <div>
      <Button
        className='primary-button'
        intent={Intent.PRIMARY}
        icon='arrow-left'
        text='Previous chapter'
        onClick={(e) => (window.location.href = "/chapter4")}
      />
    </div>
  </>
);

export default function SentimentClassification() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={pageContent} />
      </div>
    </div>
  );
}
