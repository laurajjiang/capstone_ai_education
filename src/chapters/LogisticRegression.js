import React from "react";
import Navigation from "../components/navbar";
import Description from "../components/description";
import { Callout, Button, Intent } from "@blueprintjs/core";
import { CopyBlock, nord, a11yLight } from "react-code-blocks";
import Spacer from "../components/spacer";
import ConfusionMatrix from "../components/confusionMatrix";
import Container from "../components/container";
import "../index.css";
import data from "./predict_LR.json";

const objectives = [
  {
    obj: "Identify how linear regression applies to logistic regression.",
    tag: "#introduction",
  },
  {
    obj:
      "Describe what multi-class prediction is and how it applies to the iris data set.",
    tag: "#introduction",
  },
  {
    obj:
      "Demonstrate how to transform a given dataset to make it suitable for training/testing a model.",
    tag: "#explore_data",
  },
  {
    obj:
      "Construct a logistic regression model using an optimization and loss function.",
    tag: "#build_model",
  },
  {
    obj:
      "Assess the accuracy and predictive power of the logistic regression model with the help of the interactive confusion matrix.",
    tag: "#train_model",
  },
];

const importCode = `import numpy as np 
import matplotlib.pyplot as plt 
import pandas as pd
import tensorflow as tf
from sklearn import datasets
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
y = iris['target'].values `;

const dataManip2 = `train_data = np.random.choice(len(x), round(len(x) * 0.6), replace=False)
test_data = np.array(list(set(range(len(x))) - set(train_data)))

# separate the dataset into features and labels
x_train = x[train_data]
y_train = y[train_data]
x_test = x[test_data]
y_test = y[test_data]

# the number of labels
num_labels = 3 

# the number of features: sepal length & width, petal length & width
num_features = 4

# Convert to float32.
x_train, x_test = np.array(x_train, np.float32), np.array(x_test, np.float32)

x_train, x_test = x_train.reshape([-1, num_features]), x_test.reshape([-1, num_features])`;

const createModel = `from keras.models import Sequential
from keras.layers import Dense
from keras.regularizers import L1L2

# Set up the logistic regression model
model = Sequential()
# the number of class, Iris dataset has 3 classes
output_dim = num_labels
# input dimension = number of features your data has
input_dim = num_features

model.add(Dense(output_dim,
                input_dim = input_dim,
                activation='sigmoid'
                )) 
model.summary()`;

const createModelOutput = `Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
dense (Dense)                (None, 3)                 15        
=================================================================
Total params: 15
Trainable params: 15
Non-trainable params: 0
_________________________________________________________________`;

const lossOptimize = `opt = tf.keras.optimizers.SGD(learning_rate=learning_rate)

model.compile(optimizer=opt,
              loss='categorical_crossentropy',
              metrics=['accuracy'])`;

const trainModel = `learning_rate = 0.03
batch_size = 32
epochs_num = 500

history = model.fit(x_train, y_train, batch_size=batch_size, 
              epochs=epochs_num, validation_split=0.3)`;

const trainModelOutput = `Epoch 1/500
2/2 [==============================] - 2s 1s/step - loss: 1.0547 - accuracy: 0.3196 - val_loss: 1.0380 - val_accuracy: 0.3929
Epoch 2/500
2/2 [==============================] - 0s 54ms/step - loss: 1.0531 - accuracy: 0.3300 - val_loss: 1.0345 - val_accuracy: 0.3929
Epoch 3/500
2/2 [==============================] - 0s 51ms/step - loss: 1.0569 - accuracy: 0.3196 - val_loss: 1.0311 - val_accuracy: 0.3929
Epoch 4/500
2/2 [==============================] - 0s 54ms/step - loss: 1.0383 - accuracy: 0.3404 - val_loss: 1.0277 - val_accuracy: 0.3929
Epoch 5/500
2/2 [==============================] - 0s 59ms/step - loss: 1.0448 - accuracy: 0.3091 - val_loss: 1.0244 - val_accuracy: 0.3929
Epoch 6/500
2/2 [==============================] - 0s 55ms/step - loss: 1.0182 - accuracy: 0.3300 - val_loss: 1.0212 - val_accuracy: 0.3929
Epoch 7/500
2/2 [==============================] - 0s 56ms/step - loss: 1.0296 - accuracy: 0.3300 - val_loss: 1.0180 - val_accuracy: 0.3929
...`;

const evaluateModel = `from sklearn.metrics import classification_report
from sklearn.preprocessing import MinMaxScaler

# make a prediction
testingPredictions = model.predict(x_test)
testingPredictions = list(testingPredictions.argmax(axis=-1))

confidence_scores = model.predict(x_test, batch_size=32)
print(confidence_scores)

target_names = ['Iris-setosa', 'Iris-versicolo', 'Iris-virginica']
print(classification_report(y_test.argmax(axis=-1), 
          testingPredictions, target_names=target_names))
`;

const evaluateModelOutput = `
[0.7555258  0.3721129  0.18546638]
 [0.1302656  0.5218655  0.70985407]
 [0.7590202  0.40183365 0.17739275]
 [0.19557771 0.54194653 0.6100821 ]
 [0.74591273 0.43727338 0.19650018]
 [0.78505176 0.44534478 0.1662238 ]
 [0.7705698  0.29390693 0.17891836]
 [0.76150954 0.2678019  0.1734559 ]
 [0.11743623 0.52710533 0.725692  ]
 [0.16238195 0.5950048  0.6508205 ]
 ....`;

const finalResults = `results = model.evaluate(x_test, y_test, verbose=1)`;

const finalResultsOutput = `2/2 [==============================] - 0s 5ms/step - 
loss: 0.5311 - accuracy: 0.8333
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
          1.{index}
          <h3>{obj.obj}</h3>
        </div>
      </a>
    );
  });
}

const introBlock = (
  <div id='introduction'>
    Logistic regression is one of the fundamental classification algorithms used
    in machine learning. We use logistic regression to categorize data into
    discrete categories, typically binary data. An example of this would be
    classifying a particular email as being spam or not spam. A logistic
    regression model learns a linear relationship from a provided dataset. Then,
    from this linear regression, we apply a non-linear function (the Sigmoid
    function) so that our model returns a value between 0 and 1, representing a
    probability value. This is how linear regression is used and then
    transformed into a logistic regression model.
    <Spacer space='1vh' />
    In this chapter, we will use logistic regression for multi-categorical
    classification, categorizing iris data into three separate classes. How can
    we use logistic regression, which is typically a binary classifer, for
    multiclass classification? We split the problem up into multiple binary
    classification problems.
  </div>
);

const setupBlock = (
  <div>
    <h1>Set up libraries</h1>
    We'll first install and import any necessary Python libraries. For further
    detail and commentary on how the code functions, refer to the notebooks
    linked above.
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
    Let's load the dataset in for use. For further detail and commentary on how
    the code functions, refer to the notebooks linked above.
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
    Let's display a graph of what this dataset looks like, based off of sepal
    length and width. Keep in mind that there are 150 different iris data points
    in here:
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src='/iris-data.png' />
    </div>
  </div>
);

const manipDataBlock = (
  <div id='explore_data'>
    <h1>Preparing and manipulating the data for our model</h1>
    Before we can feed this dataset to any machine learning model, we have to do
    some pre-processing with the data.
    <Spacer space='1vh' />
    We need to split the dataset into an x-and-y-components for use in our
    model. Traditionally, all the important features valued in classification
    (petal length, sepal length, etc.) are going to be used in our x-component,
    while the target label will be the y-component.
    <Spacer space='1vh' />
    <CopyBlock
      text={dataManip}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    Now that we have both components, we need to split the dataset itself into
    two parts: a training set and a test set. These are named aptly, as the
    training set is used to initially feed to our model so it can learn what
    features correspond to which label. The test set will be used to evaluate
    our model and its accuracy on new, unseen data. We can then compare its
    predictions with the actual target label afterwards.
    <Spacer space='1vh' />
    You'll also notice that we turn our x-component into an array, or vector.
    This is an important step as the data formatting initially is of the
    incorrect shape for the model to accept, so we vectorize and reshape. The
    size of your vector is directly tied to the input layer of your machine
    learning model, which we'll be building in the next section.
    <Spacer space='1vh' />
    <CopyBlock
      text={dataManip2}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    There is a little bit more to do with our dataset called normalization,
    which is an optional step. This brings all values in our dataset to be
    within a similar range. This is most useful when you know your values are
    not already normally distributed, such as one column ranging from 1 - 100
    but another ranging from 0 - 100,000. You can view this step in the notebook
    for more detail.
  </div>
);

const buildModelBlock = (
  <div id='build_model'>
    <h1>Building our model</h1>
    We can finally build our first machine learning model. We use the Keras API,
    which you can learn more about through the Keras documentation. We will be
    using the Sigmoid function as our activation function so that our logistic
    model's output is within the range 0 - 1.
    <Spacer space='1vh' />
    There are other activation functions that are possible, so we recommend that
    you try to play around with different ones and research which best suits
    your use case.
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
    We also can add a loss function and an optimizer to our model. The loss
    function calculates how far off our model is - the lower the loss, the
    better our model's prediction is. Log loss, or categorical crossentropy loss
    is one of the most popular ones used for classification. An optimizer for
    our model interally adjusts how to weight different parameters or nodes in
    our model as it receives continuous input. Here, we use stochastic gradient
    descent (SGD), which is also a very popular choice.
    <Spacer space='1vh' />
    <CopyBlock
      text={lossOptimize}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
  </div>
);

const trainModelBlock = (
  <div id='train_model'>
    <h1>Training the model</h1>
    There are a few variables, called parameters, that are relevant to training
    our model. These are the <b>learning rate</b>, <b>batch size</b>, and{" "}
    <b>epoch</b>.
    <Spacer space='1vh' />
    The learning rate controls how much the weights or individual nodes in our
    model are adjusted with respect to the loss function and optimizer. Batch
    size determines how many samples are propogated through the model within one
    epoch. An epoch is simply one iteration over a batch of samples. Once these
    are declared, we can train our model using the <code>model.fit()</code>{" "}
    function.
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
    We can view how our model improved over the course of the training. There
    are some trends that you can notice, but more generally that the more epochs
    we run through the training dataset, the better the accuracy and lower the
    loss. At some points though, the accuracy does flatten out.
    <Spacer space='1vh' />
    <div style={{ display: "flex", justifyContent: "center" }}>
      <img src='/lr_graph.png' />
    </div>
  </div>
);

const evaluateModelBlock = (
  <div>
    <h1>Evaluating the model</h1>
    We now have successfully trained our model with some data. Remember the
    other part of the dataset that we reserved earlier? We now use it to
    evaluate our model and see how accurate the model is on data it hasn't seen
    before.
    <Spacer space='1vh' />
    <CopyBlock
      text={evaluateModel}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
    Below is a vector of the predictions output by the model. The index with the
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
  </div>
);

const visualizationBlock = (
  <div>
    <h1>Intepreting the results</h1>
    We can visualize the results of our model using a confusion matrix. A
    confusion matrix helps us see which results are accurately classified and
    which are mis-classified, as well as how confident the model is in its
    classifications. The one below is interactive, so you can click on each
    block to see what data falls where and adjust the slider to include
    less-confident predictions.
    <Spacer space='1vh' />
  </div>
);

const pageContent = (
  <>
    <Spacer space='1vh' />
    <div className='title'>chapter 1 - logistic regression</div>
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
    <ConfusionMatrix data={data} />
    <Spacer space='1vh' />
    <div>
      <Button
        className='primary-button'
        intent={Intent.PRIMARY}
        icon='arrow-left'
        text='Previous chapter'
        onClick={(e) => (window.location.href = "/chapter0")}
      />
      <Button
        className='primary-button'
        intent={Intent.PRIMARY}
        icon='arrow-right'
        text='Next chapter'
        onClick={(e) => (window.location.href = "/chapter2")}
      />
    </div>
  </>
);

export default function LogisticRegression() {
  return (
    <div>
      <Navigation />
      <div className='container'>
        <Container content={pageContent} />
      </div>
    </div>
  );
}
