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
      "Illustrate how to transform image data into a vectorized form suitable for training a neural network.",
    tag: "#explore_data",
  },
  {
    obj:
      "Describe how image classification is performed and how it differs from already vectorized data.",
    tag: "#explore_data",
  },
];

const importCode = `import tensorflow as tf 
import numpy as np
import matplotlib.pyplot as plt 
from sklearn.preprocessing import OneHotEncoder
`;

const loadDataCode = `fashion_mnist = tf.keras.datasets.fashion_mnist

# 60,000 training images, 10,000 test images
(training_imgs, training_labels), (test_imgs, test_labels) = fashion_mnist.load_data()
`;

const loadDataOutput = `Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/train-labels-idx1-ubyte.gz
32768/29515 [=================================] - 0s 1us/step
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/train-images-idx3-ubyte.gz
26427392/26421880 [==============================] - 2s 0us/step
Downloading data from https://storage.googleapis.com/tensorflow/tf-keras-datasets/t10k-labels-idx1-ubyte.gz
8192/5148 [===============================================] - 0s 0us/step
`;

const dataManip = `training_imgs = training_imgs.reshape((training_imgs.shape[0], 28, 28, 1))
training_imgs = training_imgs/255.0
test_imgs = test_imgs/255.0`;

const dataManip2 = `encoder1 = OneHotEncoder(sparse=False)
encoder2 = OneHotEncoder(sparse=False)
training_labels = training_labels.reshape(-1, 1)
test_labels = test_labels.reshape(-1, 1)
training_labels = encoder1.fit_transform(training_labels)
test_labels = encoder2.fit_transform(test_labels)`;

const createModel = `model = tf.keras.Sequential([
  tf.keras.layers.Flatten(input_shape=(28,28), name='input'), # image is 28x28 pixels
  tf.keras.layers.Dense(128, activation='relu', name='hidden-1'),
  tf.keras.layers.Dense(10, activation='softmax', name='output')
])

model.compile(optimizer='sgd', loss='categorical_crossentropy', metrics=['accuracy'])

model.summary()`;

const createModelOutput = `Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
input (Flatten)              (None, 784)               0         
_________________________________________________________________
hidden-1 (Dense)             (None, 128)               100480    
_________________________________________________________________
output (Dense)               (None, 10)                1290      
=================================================================
Total params: 101,770
Trainable params: 101,770
Non-trainable params: 0
_________________________________________________________________`;

const hiddenLayer = `# hidden layer vector

predictions = model(x)
tf.nn.softmax(predictions[:5])`;

const hiddenLayerOutput = `<tf.Tensor: shape=(5, 3), dtype=float32, numpy=
array([[0.265216  , 0.24151523, 0.4932688 ],
       [0.25755143, 0.23534136, 0.50710726],
       [0.31570503, 0.2655454 , 0.41874954],
       [0.2752816 , 0.2490699 , 0.47564843],
       [0.2801358 , 0.25202224, 0.46784198]], dtype=float32)>`;

const trainModel = `hist = model.fit(training_imgs, training_labels, verbose=1, batch_size=32, epochs=20, validation_split=0.3)`;

const trainModelOutput = `Epoch 1/20
1313/1313 [==============================] - 5s 3ms/step - loss: 1.1410 - accuracy: 0.6415 - val_loss: 0.5906 - val_accuracy: 0.8050
Epoch 2/20
1313/1313 [==============================] - 2s 2ms/step - loss: 0.5630 - accuracy: 0.8125 - val_loss: 0.5201 - val_accuracy: 0.8247
Epoch 3/20
1313/1313 [==============================] - 2s 2ms/step - loss: 0.4992 - accuracy: 0.8313 - val_loss: 0.4843 - val_accuracy: 0.8346
Epoch 4/20
1313/1313 [==============================] - 3s 2ms/step - loss: 0.4629 - accuracy: 0.8418 - val_loss: 0.4647 - val_accuracy: 0.8376
Epoch 5/20
1313/1313 [==============================] - 2s 2ms/step - loss: 0.4531 - accuracy: 0.8431 - val_loss: 0.4435 - val_accuracy: 0.8463
Epoch 6/20
1313/1313 [==============================] - 2s 2ms/step - loss: 0.4328 - accuracy: 0.8518 - val_loss: 0.4599 - val_accuracy: 0.8408
Epoch 7/20
1313/1313 [==============================] - 3s 2ms/step - loss: 0.4226 - accuracy: 0.8547 - val_loss: 0.4257 - val_accuracy: 0.8526
...`;

const evaluateModel = `testingPredictions = model.predict(test_imgs)
testingPredictions = list(testingPredictions.argmax(axis=-1))
confidence_scores = model.predict(test_imgs, batch_size=32)
np.set_printoptions(suppress=True)
print(confidence_scores)`;

const evaluateModelOutput = `
[0.00000729 0.00000009 0.00000275 ... 0.06012471 0.00154842 0.8761682 ]
 [0.00009534 0.00000013 0.98821205 ... 0.         0.00001153 0.        ]
 [0.00005938 0.99992764 0.00000173 ... 0.00000001 0.00000101 0.        ]
 ...
 [0.02944808 0.00000466 0.00140015 ... 0.00001671 0.951989   0.00000038]
 [0.00001509 0.9985979  0.0000077  ... 0.00000261 0.00000638 0.00000044]
 [0.00012927 0.00006131 0.00038427 ... 0.05729564 0.01049629 0.00277568]`;

const finalResults = `results = model.evaluate(x_test, y_test, verbose=1)`;

const finalResultsOutput = `4/4 [==============================] - 0s 1ms/step - loss: 0.6181 - accuracy: 0.8667
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
          3.{index}
          <h3>{obj.obj}</h3>
        </div>
      </a>
    );
  });
}

const introBlock = (
  <div id='introduction'>
    We carry on using the neural network model but with a new type of data and
    dataset. Originally, we started out building a model to classify data in a
    text format and we explored two different models. Now, we'll see how to use
    a neural network for image classification.
  </div>
);

const setupBlock = (
  <div>
    <h1>Set up libraries</h1>
    Per usual, we import any necessary libraries for this notebook. The
    libraries per chapter will vary!
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
    Now, we get to look at a whole new dataset.
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
    We can see a sample of what our data looks like:
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>PLACEHOLDER</span>
    </div>
    <Spacer space='1vh' />
  </div>
);

const manipDataBlock = (
  <div id='explore_data'>
    <h1>Preparing and manipulating the data for our model</h1>
    ou'll notice that we don't need to do any separation of the data into a
    training set and a test set -- fortunately, this has already been done for
    us. Like any dataset, there is some sort of pre-processing that needs to be
    done for our images to make sure that each image is suitable to be fed into
    the model.
    <Spacer space='1vh' />
    We reshape the entire array of images to match the shape of the first image
    in the array, then flatten them down to 28x28 pixels. The entire array is
    then divided by 255 so that the image is in grayscale instead of RGB.
    <Spacer space='1vh' />
    <CopyBlock
      text={dataManip}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    We are going to continue using the <code>OneHotEncoder</code> to re-shape
    our data into suitable vectors for our model.
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
    This neural network looks slightly different, but all the same parts are
    still here from the previous chapter. On the input layer, we've adjusted our
    input to match the adjusted image shape of 28x28 pixels.
    <Spacer space='1vh' />
    We only have one hidden layer this time but with 128 nodes. There is a
    larger number of nodes this time because image data contains a lot of
    information, and just having 10 nodes would not be sufficient to distinguish
    between image features.
    <Spacer space='1vh' />
    Our output layer has 10 nodes to account for the 10 different output classes
    in our dataset.
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
    Let's take a look at our model while it's training.
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
    It starts out with a fairly high accuracy and is already up at 0.85 by the
    seventh epoch!
    <Spacer space='1vh' />
    Here is the accuracy and loss graph across epochs. As a reminder, epochs are
    just one iteration of training the model with a given batch of data!
    <Spacer space='1vh' />
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>PLACEHOLDER</span>
    </div>
    <Spacer space='1vh' />
  </div>
);

const evaluateModelBlock = (
  <div>
    <h1>Evaluating the model</h1>
    The predictions will look a bit more jumbled because there are 10 different
    classes to consider now instead of just three. Consider viewing this through
    the notebook for a clearer view of what the prediction array looks like.
    <Spacer space='1vh' />
    <CopyBlock
      text={evaluateModel}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
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
  </div>
);

const visualizationBlock = (
  <div>
    <h1>Intepreting the results</h1>
    With image data, it's easy to create a quick graph to see how our model
    performed. Although this grid is non-adjustable here, if you look at the
    notebook it should be fairly straightforward how you can view more results.
    <Spacer space='1vh' />
    <div style={{ display: "flex", justifyContent: "center" }}>
      <span>PLACEHOLDER</span>
    </div>
    <Spacer space='1vh' />
    Here is the confusion matrix for our neural network.
    <Spacer space='1vh' />
    <span>PLACEHOLDER</span>
  </div>
);

const pageContent = (
  <>
    <Spacer space='1vh' />
    <div className='title'>
      chapter 3 - image classification with a neural network
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
        onClick={(e) => (window.location.href = "/chapter2")}
      />
      <Button
        className='primary-button'
        intent={Intent.PRIMARY}
        icon='arrow-right'
        text='Next chapter'
        onClick={(e) => (window.location.href = "/chapter4")}
      />
    </div>
  </>
);

export default function NeuralNetworkImg() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={pageContent} />
      </div>
    </div>
  );
}
