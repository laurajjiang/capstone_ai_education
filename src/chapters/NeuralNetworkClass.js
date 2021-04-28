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
      "Summarize the difference between logistic regression and a neural network.",
    tag: "#introduction",
  },
  {
    obj: "Describe the purpose of each layer in a neural network.",
    tag: "#introduction",
  },
  {
    obj: "Translate the hidden layer’s output in a neural network.",
    tag: "#explore_data",
  },
  {
    obj:
      "Interpret the differences between accuracy and loss per epoch, particularly interacting with the epoch slider on the confusion matrix.",
    tag: "#build_model",
  },
];

const importCode = `from sklearn import datasets
from sklearn.preprocessing import OneHotEncoder
import numpy as np 
import matplotlib.pyplot as plt 
import pandas as pd
import tensorflow as tf
import json
import os
import sys
`;

const loadDataCode = `iris = datasets.load_iris()
iris = pd.DataFrame(data= np.c_[iris['data'], iris['target']],
                     columns= iris['feature_names'] + ['target'])
iris = iris.astype({"target": int })

print(iris)
print(iris.shape)
`;

const loadDataOutput = `
  sepal length (cm)  sepal width (cm)  petal len(cm)  petal w (cm)  \ 
0    5.1               3.5                1.4               0.2   
1    4.9               3.0                1.4               0.2   
2    4.7               3.2                1.3               0.2   
3    4.6               3.1                1.5               0.2   
4    5.0               3.6                1.4               0.2   
     ...                 ...               ...              ...  
145  6.7               3.0                5.2               2.3   
146  6.3               2.5                5.0               1.9   
147  6.5               3.0                5.2               2.0   
148  6.2               3.4                5.4               2.3   
149  5.9               3.0                5.1               1.8   

target  
0         0  
1         0  
2         0  
3         0  
4         0  
..      ...  
145       2  
146       2  
147       2  
148       2  
149       2 

[150 rows x 5 columns]
(150, 5)
`;

const dataManip = `x = iris.drop(labels=['target'], axis=1).values
y_ = iris['target'].values.reshape(-1, 1)
encoder = OneHotEncoder(sparse=False)
y = encoder.fit_transform(y_)`;

const dataManip2 = `from sklearn.model_selection import train_test_split
from sklearn.utils import shuffle 

x, y = shuffle(x, y)
train_x, test_x, train_y, test_y = train_test_split(x, y, test_size=0.8)`;

const createModel = `model = tf.keras.Sequential([
  tf.keras.layers.Dense(10, activation=tf.nn.relu, input_shape=(4,), name='input'),  # input shape required
  tf.keras.layers.Dense(10, activation=tf.nn.relu, name='hidden-1'),
  tf.keras.layers.Dense(10, activation=tf.nn.relu, name='hidden-2'),
  tf.keras.layers.Dense(3, activation='softmax', name='output')
])

print(model.summary())`;

const createModelOutput = `Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
input (Dense)                (None, 10)                50        
_________________________________________________________________
hidden-1 (Dense)             (None, 10)                110       
_________________________________________________________________
hidden-2 (Dense)             (None, 10)                110       
_________________________________________________________________
output (Dense)               (None, 3)                 33        
=================================================================
Total params: 303
Trainable params: 303
Non-trainable params: 0
_________________________________________________________________
None`;

const hiddenLayer = `# hidden layer vector

predictions = model(x)
tf.nn.softmax(predictions[:5])`;

const hiddenLayerOutput = `<tf.Tensor: shape=(5, 3), dtype=float32, numpy=
array([[0.265216  , 0.24151523, 0.4932688 ],
       [0.25755143, 0.23534136, 0.50710726],
       [0.31570503, 0.2655454 , 0.41874954],
       [0.2752816 , 0.2490699 , 0.47564843],
       [0.2801358 , 0.25202224, 0.46784198]], dtype=float32)>`;

const trainModel = `model.compile(optimizer='sgd', loss='categorical_crossentropy', metrics=['accuracy'])
hist = model.fit(train_x, train_y, verbose=1, batch_size=32, epochs=200, validation_split=0.3)`;

const trainModelOutput = `Epoch 1/200
1/1 [==============================] - 3s 3s/step - loss: 1.3616 - accuracy: 0.3810 - val_loss: 1.3850 - val_accuracy: 0.2222
Epoch 2/200
1/1 [==============================] - 0s 61ms/step - loss: 1.2207 - accuracy: 0.3810 - val_loss: 1.2874 - val_accuracy: 0.2222
Epoch 3/200
1/1 [==============================] - 0s 53ms/step - loss: 1.1369 - accuracy: 0.3810 - val_loss: 1.2281 - val_accuracy: 0.2222
Epoch 4/200
1/1 [==============================] - 0s 51ms/step - loss: 1.0900 - accuracy: 0.3810 - val_loss: 1.1920 - val_accuracy: 0.2222
Epoch 5/200
1/1 [==============================] - 0s 50ms/step - loss: 1.0613 - accuracy: 0.3810 - val_loss: 1.1718 - val_accuracy: 0.2222
Epoch 6/200
1/1 [==============================] - 0s 47ms/step - loss: 1.0386 - accuracy: 0.3810 - val_loss: 1.1479 - val_accuracy: 0.2222
Epoch 7/200
1/1 [==============================] - 0s 49ms/step - loss: 1.0185 - accuracy: 0.3810 - val_loss: 1.1308 - val_accuracy: 0.2222
...`;

const evaluateModel = `from sklearn.metrics import classification_report
from sklearn.preprocessing import MinMaxScaler

# make a prediction
testingPredictions = model.predict(test_x)
testingPredictions = list(testingPredictions.argmax(axis=-1))

confidence_scores = model.predict(test_x, batch_size=32)
print(confidence_scores)

target_names = ['Iris-setosa', 'Iris-versicolo', 'Iris-virginica']
print(classification_report(test_y.argmax(axis=-1), testingPredictions, target_names=target_names))`;

const evaluateModelOutput = `
[0.02694994 0.32540676 0.64764327]
 [0.0573839  0.454274   0.48834205]
 [0.4494218  0.24518618 0.30539203]
 [0.01584578 0.36030072 0.62385356]
 [0.02634715 0.5248358  0.44881704]
 [0.45135206 0.2415105  0.3071375 ]
 [0.02668841 0.5560593  0.4172524 ]
 [0.01033322 0.22954245 0.7601244 ]
 ....`;

const finalResults = `results = model.evaluate(x_test, y_test, verbose=1)`;

const finalResultsOutput = `4/4 [==============================] - 0s 1ms/step - loss: 0.6181 - accuracy: 0.8667
 `;

const buttonGroup = (
  <div className='button-group'>
    <Button
      className='primary-button'
      intent={Intent.PRIMARY}
      text={
        <a
          href='https://github.com/laurajjiang/capstone_ai_education/blob/main/notebooks/neural_network_classification.ipynb'
          target='_blank'
          rel='noopener noreferrer'>
          View on GitHub
        </a>
      }
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
          2.{index}
          <h3>{obj.obj}</h3>
        </div>
      </a>
    );
  });
}

const introBlock = (
  <div id='introduction'>
    Neural networks take on their name and structure after the human brain. In
    this chapter, we'll learn how to create a neural network and then use it for
    multi-categorical classification, categorizing iris data into three separate
    classes. This is the same problem we were dealing with in Chapter 1, except
    we will be using a different model so much of the set-up process will be
    identical.
    <Spacer space='1vh' />
    If you'd like further elaboration on any set-up, please refer to the
    previous chapter for more details.
  </div>
);

const setupBlock = (
  <div>
    <h1>Set up libraries</h1>
    First, install and import all the Python libraries that you'll need for this
    notebook.
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
    We'll load the dataset in to start using it. For further detail and
    commentary on how the code functions, refer to the notebooks linked above.
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
    As you can see through the table, each data point includes sepal length,
    sepal width, petal length, petal width, and a "target label" representing
    which type of it is. 0 is a <i>Iris-setosa</i>, 1 is a <i>Iris-versicolo</i>
    , and 2 is a <i>Iris-virginica</i>.
    <Spacer space='1vh' />
    You might remember the simple plot of the iris data from the previous
    chapter. Let's look at the iris data using a different kind of
    visualization.
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>PLACEHOLDER</span>
    </div>
  </div>
);

const manipDataBlock = (
  <div id='explore_data'>
    <h1>Preparing and manipulating the data for our model</h1>
    Before we can feed this dataset to any machine learning model, we have to do
    some pre-processing with the data.
    <Spacer space='1vh' />
    The data preparation is going to simplified with the use of a library
    function here. Earlier, we used this import{" "}
    <code>from sklearn.preprocessing import OneHotEncoder</code>, and we'll use
    the <code>OneHotEncoder</code> function here. We drop the "target" column
    from our original table (the correct labels for each of our data points) and
    convert it into a 1D-vector.
    <Spacer space='1vh' />
    <CopyBlock
      text={dataManip}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    The next step is to split the dataset into a training set and a test set.
    Again, we've sped up this process by using a built in function called{" "}
    <code>train_test_split</code>, but it functionally does the same thing as
    our manual split from Chapter 1.
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
    Now, here is the fun part: building up our first neural network model! We
    have a few different layers going on now, and our model looks fairly
    different from the logistic regression model that we were using in the
    previous chapter.
    <Spacer space='1vh' />
    The first layer is our input layer. We've chosen to add 10 nodes and also
    use the ReLU activation function; 10 is a bit arbitrary, so feel free to
    experiment. The input shape is <code>(4,)</code> as our x-vector is a flat
    vector of size 4 (sepal length and width, petal length and width).
    <Spacer space='1vh' />
    The next two layers are hidden layers, and they create the essential part of
    a neural network. These two layers help the network break down incoming data
    into multiple pieces, so each node in these hidden layers is meant to
    identify a particular piece of information. We have two hidden layers here,
    but again you can add more.
    <Spacer space='1vh' />
    Lastly, we have the output layer. There are only three nodes here because
    there are three possible output classes. We're also using softmax as our
    activation function here to normalize our output between the range 0 and 1.
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
    <Spacer space='1vh' />
    <CopyBlock
      text={hiddenLayer}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <CopyBlock
      text={hiddenLayerOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
  </div>
);

const trainModelBlock = (
  <div id='train_model'>
    <h1>Training the model</h1>
    For consistency, we will always use categorical crossentropy as our loss
    function and stochastic gradient descent (SGD) as our optimizer.
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
    Here is the accuracy and loss graph across epochs. As a reminder, epochs are
    just one iteration of training the model with a given batch of data!
    <Spacer space='1vh' />
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>PLACEHOLDER</span>
    </div>
  </div>
);

const evaluateModelBlock = (
  <div>
    <h1>Evaluating the model</h1>
    We can now test our model to evaluate its accuracy and loss. This part
    should look almost identical to how we evaluated our model in the previous
    chapter, and you'll see the same thing in later chapters as well.
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
    Finally, let's view the overall accuracy and loss from our model:
    <Spacer space='1vh' />
    <CopyBlock
      text={finalResults}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <CopyBlock
      text={finalResultsOutput}
      language='python'
      theme={a11yLight}
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    An accuracy of 0.86 is pretty good!
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
    <div className='title'>chapter 2 - neural network classification</div>
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
        onClick={(e) => (window.location.href = "/chapter1")}
      />
      <Button
        className='primary-button'
        intent={Intent.PRIMARY}
        icon='arrow-right'
        text='Next chapter'
        onClick={(e) => (window.location.href = "/chapter3")}
      />
    </div>
  </>
);

export default function NeuralNetworkClass() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={pageContent} />
      </div>
    </div>
  );
}
