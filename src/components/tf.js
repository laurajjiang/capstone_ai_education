import React from "react";
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis'

const IMAGE_SIZE = 784;
const NUM_CLASSES = 10;
const NUM_DATASET_ELEMENTS = 65000;

const NUM_TRAIN_ELEMENTS = 55000;
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

const MNIST_IMAGES_SPRITE_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png';
const MNIST_LABELS_PATH =
    'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8';

/**
 * A class that fetches the sprited MNIST dataset and returns shuffled batches.
 *
 * NOTE: This will get much easier. For now, we do data fetching and
 * manipulation manually.
 */

window.tf = tf;
window.tfvis = tfvis;
var data = 0;
var model = 0;

export class MnistData {
  constructor() {
    this.shuffledTrainIndex = 0;
    this.shuffledTestIndex = 0;
  }

  async load() {
    console.log("MNIST load ...");
    // Make a request for the MNIST sprited image.
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const imgRequest = new Promise((resolve, reject) => {
      img.crossOrigin = '';
      img.onload = () => {
        img.width = img.naturalWidth;
        img.height = img.naturalHeight;

        const datasetBytesBuffer =
            new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4);

        const chunkSize = 5000;
        canvas.width = img.width;
        canvas.height = chunkSize;

        for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
              datasetBytesBuffer, i * IMAGE_SIZE * chunkSize * 4,
              IMAGE_SIZE * chunkSize);
          ctx.drawImage(
              img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width,
              chunkSize);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          for (let j = 0; j < imageData.data.length / 4; j++) {
            // All channels hold an equal value since the image is grayscale, so
            // just read the red channel.
            datasetBytesView[j] = imageData.data[j * 4] / 255;
          }
        }
        this.datasetImages = new Float32Array(datasetBytesBuffer);

        resolve();
      };
      img.src = MNIST_IMAGES_SPRITE_PATH;
    });

    const labelsRequest = fetch(MNIST_LABELS_PATH);
    const [imgResponse, labelsResponse] =
        await Promise.all([imgRequest, labelsRequest]);

    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer());

    // Create shuffled indices into the train/test set for when we select a
    // random dataset element for training / validation.
    this.trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS);
    this.testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS);

    // Slice the the images and labels into train and test sets.
    this.trainImages =
        this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS);
    this.trainLabels =
        this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS);
    this.testLabels =
        this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS);
  }

  nextTrainBatch(batchSize) {
    return this.nextBatch(
        batchSize, [this.trainImages, this.trainLabels], () => {
          this.shuffledTrainIndex =
              (this.shuffledTrainIndex + 1) % this.trainIndices.length;
          return this.trainIndices[this.shuffledTrainIndex];
        });
  }

  nextTestBatch(batchSize) {
    return this.nextBatch(batchSize, [this.testImages, this.testLabels], () => {
      this.shuffledTestIndex =
          (this.shuffledTestIndex + 1) % this.testIndices.length;
      return this.testIndices[this.shuffledTestIndex];
    });
  }

  nextBatch(batchSize, data, index) {
    const batchImagesArray = new Float32Array(batchSize * IMAGE_SIZE);
    const batchLabelsArray = new Uint8Array(batchSize * NUM_CLASSES);

    for (let i = 0; i < batchSize; i++) {
      const idx = index();

      const image =
          data[0].slice(idx * IMAGE_SIZE, idx * IMAGE_SIZE + IMAGE_SIZE);
      batchImagesArray.set(image, i * IMAGE_SIZE);

      const label =
          data[1].slice(idx * NUM_CLASSES, idx * NUM_CLASSES + NUM_CLASSES);
      batchLabelsArray.set(label, i * NUM_CLASSES);
    }

    const xs = tf.tensor2d(batchImagesArray, [batchSize, IMAGE_SIZE]);
    const labels = tf.tensor2d(batchLabelsArray, [batchSize, NUM_CLASSES]);

    return {xs, labels};
  }
}

export function getModel() {
  console.log("getModel ..");
  model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [28, 28, 1],
    kernelSize: 5,
    filters: 8,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  model.add(tf.layers.conv2d({
    kernelSize: 5,
    filters: 16,
    strides: 1,
    activation: 'relu',
    kernelInitializer: 'varianceScaling'
  }));

  model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));
  model.add(tf.layers.flatten());

  model.add(tf.layers.dense({
    units: 10,
    kernelInitializer: 'varianceScaling',
    activation: 'softmax'
  }));

  const LEARNING_RATE = 0.15;
  const optimizer = tf.train.sgd(LEARNING_RATE);

  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

export async function loadData() {
  data = new MnistData();
  await data.load();
  return data;
}

async function initData() {
  //data = await loadData();
  data = new MnistData();
  await data.load();
  
  const surface = tfvis.visor().surface({
    name: 'Surface',
    tab: 'Input Data'
  });

  const drawArea = surface.drawArea; // Get the examples

  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];

  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      return examples.xs.slice([i, 0], [1, examples.xs.shape[1]]).reshape([28, 28, 1]);
    }); // Create a canvas element to render each example

    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px;';
    tf.browser.toPixels(imageTensor, canvas);
    drawArea.appendChild(canvas);
    imageTensor.dispose();
  }
  console.log("loadData done");
}

function initModel() {
  console.log("initModel ...");
  window.model = getModel();
}

// doesn't work (fix later)
function example_button() {
  document.querySelector('#show-examples').addEventListener('click', async (e) => {
  // Get a surface
    console.log("show example")
    const surface = tfvis.visor().surface({
      name: 'Surface',
      tab: 'Input Data'
    });
    const drawArea = surface.drawArea; // Get the examples

    const examples = data.nextTestBatch(20);
    const numExamples = examples.xs.shape[0];

    for (let i = 0; i < numExamples; i++) {
      const imageTensor = tf.tidy(() => {
        return examples.xs.slice([i, 0], [1, examples.xs.shape[1]]).reshape([28, 28, 1]);
      }); // Create a canvas element to render each example

      const canvas = document.createElement('canvas');
      canvas.width = 28;
      canvas.height = 28;
      canvas.style = 'margin: 4px;';
      tf.browser.toPixels(imageTensor, canvas);
      drawArea.appendChild(canvas);
      imageTensor.dispose();
      }
    
    e.target.disabled = true;
  });
}

function visor() {
  document.querySelector('#show-visor').addEventListener('click', () => {
    const visorInstance = tfvis.visor();
    if (!visorInstance.isOpen()) {
      visorInstance.toggle();
    }
  });

  document.querySelector('#make-surface').addEventListener('click', () => {
    tfvis.visor().surface({name: 'Surface', tab: 'Input Data'});
  });
  
}

function load_data() {
  document.querySelector('#load-data').addEventListener('click', async (e) => {
    console.log("Data initializing ...");
    await initData();
    console.log("Data initializaed !");
    //document.querySelector('#show-examples').disabled = false;
    document.querySelector('#start-training-1').disabled = false;
    //document.querySelector('#start-training-2').disabled = false;
    e.target.disabled = true;
  });

}

async function train(model, data, fitCallbacks) {
  console.log("training ..");
  const BATCH_SIZE = 64;
  const trainDataSize = 500;
  const testDataSize = 100;
  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(trainDataSize);
    return [d.xs.reshape([trainDataSize, 28, 28, 1]), d.labels];
  });
  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(testDataSize);
    return [d.xs.reshape([testDataSize, 28, 28, 1]), d.labels];
  });
  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: 10,
    shuffle: true,
    callbacks: fitCallbacks
  });
}

async function vis_train(){
  const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
  const container = {
    name: 'show.fitCallbacks',
    tab: 'Training',
    styles: {
      height: '1000px'
    }
  };
  const callbacks = tfvis.show.fitCallbacks(container, metrics);
  console.log("vis_train()");
  return train(model, data, callbacks);
}

function show_train(){
  document.querySelector('#start-training-1').addEventListener('click', async (e) => {
    console.log("set up vis ..")
    vis_train()
    console.log("training done !")
    document.querySelector('#show-accuracy').disabled = false;
    document.querySelector('#show-confusion').disabled = false;
  });
}

const classNames = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

function doPrediction(testDataSize = 500) {
  const testData = data.nextTestBatch(testDataSize);
  const testxs = testData.xs.reshape([testDataSize, 28, 28, 1]);
  const labels = testData.labels.argMax([-1]);
  const preds = model.predict(testxs).argMax([-1]);
  testxs.dispose();
  return [preds, labels];
}

async function showAccuracy() {
  const [preds, labels] = doPrediction();
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = {
    name: 'Accuracy',
    tab: 'Evaluation'
  };
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);
  labels.dispose();
}

async function showConfusion() {
  const [preds, labels] = doPrediction();
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = {
    name: 'Confusion Matrix',
    tab: 'Evaluation'
  };
  tfvis.render.confusionMatrix(container, {
    values: confusionMatrix,
    tickLabels: classNames
  });
  labels.dispose();
}

function show_eval(){
  document.querySelector('#show-accuracy').addEventListener('click', async (e) => {
    console.log("calling accuracy function ..")
    showAccuracy()
  });
}

function show_confusion(){
  document.querySelector('#show-confusion').addEventListener('click', async (e) => {
    console.log("calling confusion chart function ..")
    showConfusion()
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initModel();
});

  function TfVis() {
    return(
      <section>
      <h2>Chapter 1</h2>
      <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
       Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
       sunt in culpa qui officia deserunt mollit anim id est laborum.
      </span>
      <div>
      <button onClick={visor} id="show-visor" style={{margin: '10px'}}>Load Tensorflow Visor</button>
      </div>
      <span>
        <ul>
          <li>
            <strong>`</strong> (backtick): Shows or hides the visor</li>
          <li>
            <strong>~</strong> (tilde, shift+backtick): Toggles betweeen the two sizes the visor supports</li>
        </ul>
      </span>
      <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      </span>
      <div>
      <button onClick={visor} id='make-surface' style={{margin: '10px'}}>Make a surface</button>
      </div>
      <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      </span>
      <div>
      <button onClick={load_data} id='load-data' style={{margin: '10px'}}>Load MNIST data</button>
      </div>
      <h3>Train Model</h3>
      <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      </span>
      <div>
      <button onClick={show_train} id='start-training-1' style={{margin: '10px'}} disabled>Train Model</button>
      </div>
      <h3>Test Model</h3>
      <span>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
       quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      </span>
      <div>
      <button onClick={show_eval} id='show-accuracy' style={{margin: '10px'}} disabled>Test Model</button>
      <button onClick={show_confusion} id='show-confusion' style={{margin: '10px'}} disabled>Draw Confusion</button>
      </div>
      </section>
    )
  }

export default TfVis;