import React from "react";
import Navigation from "../components/navbar";
import Description from "../components/description";
import { Button, Intent } from "@blueprintjs/core";
import { CopyBlock, nord, a11yLight } from "react-code-blocks";
import Spacer from "../components/spacer";
import Container from "../components/container";
import "../index.css";

/** This component is the convolutional neural network chapter on the website. */

const objectives = [
  {
    obj:
      "Compare and contrast a convoluted neural network with a traditional neural network.",
    tag: "#build-model",
  },
  {
    obj:
      "Identify the additional layers in a convolution	al neural network. Explain what these new layers do and describe their effect on accuracy and loss.",
    tag: "#build-model",
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

const loadDataOutput = `plt.imshow(training_imgs[0]) 
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
  tf.keras.layers.Conv2D(32, (3,3), activation='relu',  input_shape=(28,28,1)),
  tf.keras.layers.MaxPooling2D((2,2)),
  tf.keras.layers.Conv2D(32, (3,3), activation='relu'),
  tf.keras.layers.MaxPooling2D((2,2)),
  tf.keras.layers.Flatten(),
  tf.keras.layers.Dense(128, activation='relu'),
  tf.keras.layers.Dense(10, activation='softmax')

])

model.compile(optimizer='sgd', loss='categorical_crossentropy', metrics=['accuracy'])

model.summary()`;

const createModelOutput = `Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
conv2d (Conv2D)              (None, 26, 26, 32)        320       
_________________________________________________________________
max_pooling2d (MaxPooling2D) (None, 13, 13, 32)        0         
_________________________________________________________________
conv2d_1 (Conv2D)            (None, 11, 11, 32)        9248      
_________________________________________________________________
max_pooling2d_1 (MaxPooling2 (None, 5, 5, 32)          0         
_________________________________________________________________
flatten (Flatten)            (None, 800)               0         
_________________________________________________________________
dense (Dense)                (None, 128)               102528    
_________________________________________________________________
dense_1 (Dense)              (None, 10)                1290      
=================================================================
Total params: 113,386
Trainable params: 113,386
Non-trainable params: 0
_________________________________________________________________`;

const trainModel = `hist = model.fit(training_imgs, training_labels, verbose=1, epochs=10, validation_split=0.3)`;

const trainModelOutput = `Epoch 1/10
1313/1313 [==============================] - 32s 24ms/step - loss: 1.3343 - accuracy: 0.5147 - val_loss: 0.7141 - val_accuracy: 0.7113
Epoch 2/10
1313/1313 [==============================] - 37s 28ms/step - loss: 0.6276 - accuracy: 0.7628 - val_loss: 0.6143 - val_accuracy: 0.7521
Epoch 3/10
1313/1313 [==============================] - 40s 30ms/step - loss: 0.5220 - accuracy: 0.8068 - val_loss: 0.4902 - val_accuracy: 0.8232
Epoch 4/10
1313/1313 [==============================] - 33s 25ms/step - loss: 0.4784 - accuracy: 0.8264 - val_loss: 0.4602 - val_accuracy: 0.8304
Epoch 5/10
1313/1313 [==============================] - 40s 31ms/step - loss: 0.4412 - accuracy: 0.8408 - val_loss: 0.4395 - val_accuracy: 0.8433
Epoch 6/10
1313/1313 [==============================] - 32s 24ms/step - loss: 0.4094 - accuracy: 0.8519 - val_loss: 0.4337 - val_accuracy: 0.8396oss: 0.4094 
Epoch 7/10
1313/1313 [==============================] - 31s 23ms/step - loss: 0.3872 - accuracy: 0.8612 - val_loss: 0.4047 - val_accuracy: 0.8548
...`;

const evaluateModel = `from sklearn.metrics import classification_report

testingPredictions = model.predict(test_imgs)
testingPredictions = list(testingPredictions.argmax(axis=-1))
confidence_scores = model.predict(test_imgs, batch_size=32)
np.set_printoptions(suppress=True)
print(confidence_scores)
`;

const evaluateModelOutput = `
[0.00000709 0.00000001 0.00000064 ... 0.15176192 0.0010076  0.841376  ]
 [0.00011659 0.         0.99974793 ... 0.         0.00000351 0.        ]
 [0.00000001 0.9999989  0.00000001 ... 0.         0.00000001 0.        ]
 ...
 [0.00085989 0.00000001 0.00061305 ... 0.00000297 0.99482006 0.00000001]
 [0.00000125 0.99861014 0.00000136 ... 0.00000053 0.00000133 0.00000171]
 [0.00031977 0.00000504 0.00055092 ... 0.6822022  0.03808242 0.00122679]`;

const buttonGroup = (
  <div className='button-group'>
    <Button
      className='primary-button'
      intent={Intent.PRIMARY}
      text={
        <a
          href='https://github.com/laurajjiang/capstone_ai_education/blob/main/notebooks/c_neural_network_img.ipynb'
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
          4.{index}
          <h3>{obj.obj}</h3>
        </div>
      </a>
    );
  });
}

const introBlock = (
  <div id='introduction'>
    It's time to introduce a new spin on a familiar model by creating a
    convolutional neural network (CNN). The convolution in a convolutional
    neural network comes from how the network processes input and transforms it
    for the next layer. Convolutional neural networks are most commonly used for
    image classification or recognition.
    <Spacer space='1vh' />
    We'll dive a bit more in-depth on the new layers in a convolutional neural
    network when we get to building our model. The rest of this page will follow
    similiarly from the previous chapter, so the explanations for many pieces
    will be minimal.
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
    Again, we will be using the same FashionMNIST dataset as the previous
    chapter for consistency. We can see the same preview of a sample image from
    the dataset.
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
  </div>
);

const manipDataBlock = (
  <div id='explore_data'>
    <h1>Preparing and manipulating the data for our model</h1>
    Since we are starting from scratch again, the images have to scaled down and
    eliminated of any RGB. This dataset is already split up into a training and
    test set for us so we do not need to manually perform any separation, just
    vectorization.
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
    This model looks quite a bit different from our previous model but the
    structure to a CNN is fairly standardized, so once you've built one it
    should be easy enough to build another.
    <Spacer space='1vh' />
    The first layer is a convolutional layer. For the given line{" "}
    <code>
      tf.keras.layers.Conv2D(32, (3,3), activation='relu',
      input_shape=(28,28,1))
    </code>
    , the first two arguments are for the filter and convolution size
    respectively. The filter integer determines the number of output nodes. The
    most common convolution filter size is 3x3, so we've continued to use a 3x3
    filter here. Like every other non-output layer, we use the ReLU activation
    function. Lastly, our input shape is determined by the images we're passing
    to the model. Earlier, these were resized down to 28x28 pixels so our input
    size is (28,28, 1).
    <Spacer space='1vh' />
    The next layer is a pooling layer. There are two types of pooling: max
    pooling and average pooling. Pooling layers take the output from the
    previous layer and flatten that output into a single neuron, viewing the
    input image through a specified tile size (in our case, 2x2). Max pooling
    takes the max value from each tile while average pooling takes the average
    value from each tile.
    <Spacer space='1vh' />
    Once we've set up our convolutional and pooling layers, we then need to
    flatten the image so that it is no longer two-dimensional. The two dense
    layers at the end are for actually predicting which class an image belongs
    to, with the final output layer being the same number as the total number of
    classes.
    <Spacer space='1vh' />
    Using two convolution and pooling layers is not set in stone. You'll likely
    have to do some more research and experimentation to figure out what is
    right for you. You can see how the shape of the image changes throughtout
    each layer though to get a better idea of how these convolutional and max
    pooling layers interact with the input.
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
    We now have our model in hand and can start to train with model on our
    training dataset.
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
      chapter 4 - convolutional neural networks for image classification
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
        onClick={(e) => (window.location.href = "/chapter3")}
      />
      <Button
        className='primary-button'
        intent={Intent.PRIMARY}
        icon='arrow-right'
        text='Next chapter'
        onClick={(e) => (window.location.href = "/chapter5")}
      />
    </div>
  </>
);

export default function ConvolutionalNN() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={pageContent} />
      </div>
    </div>
  );
}
