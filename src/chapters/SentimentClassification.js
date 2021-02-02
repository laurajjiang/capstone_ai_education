import React from "react";
import Navigation from "../components/navbar";
import Footer from "../components/footer";
import Description from "../components/description";
import { Callout, Button, Intent } from "@blueprintjs/core";
import { CopyBlock, nord, a11yLight } from "react-code-blocks";
import Spacer from "../components/spacer";
import ConfusionMatrix from "../components/confusionMatrix";
import Container from "../components/container";

const importCode = `!pip3 install nltk
!pip3 install ipywidgets
!pip3 install tensorflow
!pip3 install keras
!pip install tensorflow

import sys
import string
from scipy import sparse
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from IPython.display import display
import ipywidgets as widgets`;

const peekData = `['Wow... Loved this place.',
'Not tasty and the texture was just nasty.',
'Stopped by during the late May bank holiday off Rick Steve recommendation '
'and loved it.',
'The selection on the menu was great and so were the prices.',
'Now I am getting angry and I want my damn pho.',
"Honeslty it didn't taste THAT fresh.)",
'The potatoes were like rubber and you could tell they had been made up ahead '
'of time being kept under a warmer.',
'The fries were great too.',
'A great touch.',
'Service was very prompt.']
Corresponding sentiments:
[1, 0, 1, 1, 0, 0, 0, 1, 1, 1]
`;

const naiveBayesCode = `def __init__(self):
self.priorPositive = None  # Probability that a review is positive
self.priorNegative = None  # Probability that a review is negative
self.positiveLogConditionals = None
self.negativeLogConditionals = None

def computePriorProbabilities(self, labels):
self.priorPositive = len([y for y in labels if y == 1]) / len(labels)
self.priorNegative = 1 - self.priorPositive

def computeConditionProbabilities(self, examples, labels, dirichlet=1):
_, vocabularyLength = examples.shape

# How many of each word are there in all of the positive reviews
positiveCounts = np.array([dirichlet for _ in range(vocabularyLength)])
# How many of each word are there in all of the negative reviews
negativeCounts = np.array([dirichlet for _ in range(vocabularyLength)])

# Here's how to iterate through a spare array
coordinates = examples.tocoo()  # Converted to a coordinate format
for exampleIndex, featureIndex, observationCount in zip(coordinates.row, coordinates.col, coordinates.data):
    # For sentence {exampleIndex}, for word at index {featureIndex}, the word occurred {observationCount} times
    if labels[exampleIndex] == 1:
        positiveCounts[featureIndex] += observationCount
    else:
        negativeCounts[featureIndex] += observationCount

# [!] Make sure to use the logs of the probabilities
positiveReviewCount = len([y for y in labels if y == 1])
negativeReviewCount = len([y for y in labels if y == 0])

# We are using bernoulli NB (single occurance of a word)
self.positiveLogConditionals = np.log(positiveCounts) - np.log(positiveReviewCount + dirichlet*2)
self.negativeLogConditionals = np.log(negativeCounts) - np.log(negativeReviewCount + dirichlet*2)

# This works for multinomial NB (multiple occurances of a word)
# self.positiveLogConditionals = np.log(positiveCounts) - np.log(sum(positiveCounts))
# self.negativeLogConditionals = np.log(negativeCounts) - np.log(sum(negativeCounts))

# Calculate all of the parameters for making a naive bayes classification
def fit(self, trainingExamples, trainingLabels):
# Compute the probability of positive/negative review
self.computePriorProbabilities(trainingLabels)

# Compute
self.computeConditionProbabilities(trainingExamples, trainingLabels)

def computeLogPosteriors(self, sentence):
return ((np.log(self.priorPositive) + sum(sentence * self.positiveLogConditionals)),
        (np.log(self.priorNegative) + sum(sentence * self.negativeLogConditionals)))

# Have the model try predicting if a review if positive or negative
def predict(self, examples):
totalReviewCount, _ = examples.shape
conf_list = []

predictions = np.array([0 for _ in range(totalReviewCount)])

for index, sentence in enumerate(examples):
    logProbabilityPositive, logProbabilityNegative = self.computeLogPosteriors(
        sentence)
    #conf_list.append([np.exp(logProbabilityPositive), np.exp(logProbabilityNegative)])
    conf_list.append([logProbabilityPositive, logProbabilityNegative])
    predictions[index] = 1 if logProbabilityPositive > logProbabilityNegative else 0

return conf_list, predictions`;

const training = `nbClassifier = NaiveBayesClassifier()
nbClassifier.fit(training, trainingLabels)
train_confidence_scores, trainingPredictions = nbClassifier.predict(training)
test_confidence_scores, testingPredictions = nbClassifier.predict(testing)
`;

const accuracy = `Training accuracy: 0.9519038076152304
Testing accuracy: 0.7947686116700201`;

const buttonGroup = (
  <div style={{ display: "flex", justifyContent: "space-between" }}>
    <Button
      className='bp3-large'
      intent={Intent.OUTLINE}
      text='View on GitHub'
      style={{ maxWidth: "50%", margin: "1em" }}
    />
    <Button
      className='bp3-large'
      intent={Intent.OUTLINE}
      text='Download notebook'
      style={{ maxWidth: "50%", margin: "1em" }}
    />
    <Button
      className='bp3-large'
      intent={Intent.OUTLINE}
      text='View in Google Colab'
      style={{ maxWidth: "50%", margin: "1em" }}
    />
  </div>
);

const pretext = (
  <>
    Text classification is the process of assigning tags or categories to text
    according to its content. It’s one of the fundamental tasks in natural
    language processing.
    <Spacer space='1vh' />
    The text we want to classify is given as input to an algorithm, the
    algorithm will then analyze the text’s content, and then categorize the
    input as one of the tags or categories previously given. Simply put, the
    flow looks like: input -> classifying algorithm -> classification of input.
    <Spacer space='1vh' />
    Some real life examples of sentiment classification include how does the
    writer of the sentence feel about what they are writing about - do they
    think positively or negatively of the subject? An example is restaurant
    reviews topic labeling: given sentences and a set of topics, which topic
    does this sentence fall under? Another example: is this essay about history?
    Math? etc.?
    <Spacer space='1vh' />
    Say a restaurant wants to evaluate their ratings but they don’t want to read
    through all of them. Therefore, they want to use a computer algorithm to do
    all their work. They simply want to know if the customer’s review is
    positive or negative.
    <Spacer space='1vh' />
    Here’s an example of a customer’s review and a simple way an algorithm could
    classify their review:
    <Spacer space='1vh' />
    Input: “The food here was too salty and too expensive.”
    <Spacer space='1vh' />
    Algorithm: Goes through every word in the sentence and counts how many
    positive words and how many negative words are in the sentence.
    <Spacer space='1vh' />
    “The, food, here, was, too, and” are all neutral words. <br /> “Salty,
    expensive” are negative words. <br /> Negative words: 2. Positive words: 0.
    <Spacer space='1vh' />
    The model would classify this as a negative review, because there are more
    negative words (2) than positive (0). However, this algorithm obviously
    doesn’t work in a lot of cases. For example, “The food here was good, not
    expensive and not salty” would be classified as negative but it’s actually a
    positive review. Language and text can get very complicated which makes
    creating these algorithms difficult. Some things that make language
    difficult could be words that have multiple meanings, negation words (words
    such as not), slang, etc.
    <Spacer space='1vh' />
  </>
);

const setUp = (
  <>
    Let's move to creating our own model for sentiment classification. This page
    will walk you through three different models.
    <Spacer space='1vh' />
    <h1>Set up data and imports</h1>
    This section of code is to import any necessary Python libraries that we'll
    need for the rest of this notebook. Some packages may need to be installed
    since they are not built in to Python 3:
    <Spacer space='1vh' />
    <CopyBlock
      text={importCode}
      language='python'
      theme={nord}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
  </>
);

const exploreData = (
  <>
    <Spacer space='1vh' />
    Let's take a look at what kind of data we'll be feeding into our model. The
    training file is a series of restaurant reviews pulled from Yelp:
    <Spacer space='1vh' />
    <CopyBlock
      text={peekData}
      language='python'
      theme={a11yLight}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
    <Spacer space='1vh' />
  </>
);

const naiveBayesModel = (
  <>
    <h1>Creating our model</h1>
    The Naive Bayes model is a pure mathematics based model.
    <Spacer space='1vh' />
    <div style={{ overflow: "scroll", maxHeight: "50vh" }}>
      <CopyBlock
        text={naiveBayesCode}
        language='python'
        theme={nord}
        codeBlock
      />
    </div>
    <Spacer space='1vh' />
    With our model, the next step is to run the model and see what its accuracy
    is like.
    <Spacer space='1vh' />
    <CopyBlock text={training} language='python' theme={nord} codeBlock />
    <CopyBlock
      text={accuracy}
      language='python'
      theme={a11yLight}
      codeBlock
      style={{ maxWidth: "100%" }}
    />
  </>
);

const visualization = (
  <>
    <Spacer space='1vh' />
    We also can visualize the results of our model using a confusion matrix. A
    confusion matrix helps us see which results are accurately classified and
    which are mis-classified, as well as how confident the model is in its
    classifications. The one below is interactive, so you can click on each
    block to see what data falls where.
    <Spacer space='1vh' />
  </>
);

const introContent = (
  <>
    <Spacer space='1vh' />
    <div style={{ fontSize: "500%" }}>chapter 1 - sentiment classification</div>
    {buttonGroup}
    <Spacer space='1vh' />
    <Description content={pretext} />
    <Description content={setUp} />
    <Description content={exploreData} />
    <Description content={naiveBayesModel} />
    <Description content={visualization} />
    <ConfusionMatrix />
    <Spacer space='1vh' />
    <div>
      <Button
        className='bp3-large'
        intent={Intent.PRIMARY}
        icon='arrow-left'
        text='Previous chapter'
        style={{ maxWidth: "50%", margin: "5vh" }}
        onClick={(e) => (window.location.href = "/chapter0")}
      />
      <Button
        className='bp3-large'
        intent={Intent.PRIMARY}
        icon='arrow-right'
        text='Next chapter'
        style={{ maxWidth: "50%", margin: "5vh" }}
        onClick={(e) => (window.location.href = "/chapter2")}
      />
    </div>
  </>
);

export default function SentimentClassification() {
  return (
    <div>
      <Navigation />
      <Container content={introContent} />
      <Spacer space='-1vh' />
      <hr style={{ marginTop: "0px" }} />
      <Footer />
    </div>
  );
}
