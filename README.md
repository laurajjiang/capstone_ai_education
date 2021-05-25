# Interactive Visualization for AI Education

Senior Capstone, Group 21

Artificial intelligence and machine learning is becoming increasingly popular and present in tons of different industries and systems around the world. There currently lacks beginner friendly resources that both teach and tie multiple AI/ML concepts together. Through this project, we created a new web and notebook-based tool to provide users with both a high-level and optional in-depth (hands-on programming) experience of building three different machine learning models for varied use cases. The materials are organized by topic, introducing increasingly more complex concepts to users as they move through the site.

The current state of the project supports multi-categorical classificaion using logistic regression and a neural network, image classification using a neural network and a convolutional neural network, and text (sentiment) classification using a neural network. There is an interactive confusion matrix supported for each model as well as unique interactive visualizations for the text classification section.

In order to interact with the notebooks, we recommend that you clone this Github repo to your local machine and follow the [Running the Notebooks](#running-the-notebooks) setup process as described below. 

## Built With 

* [React](https://reactjs.org/)
* [d3.js](https://d3js.org/)
* Python & [Tensorflow](https://www.tensorflow.org/overview)
* [Jupyter](https://jupyter.org/)

## Running the Project

There are two components to this project: the site, bootstrapped with [Create React App](https://github.com/facebook/create-react-app), and the notebooks which are ideally run on the Jupyter platform. This repository is home to both of these components as well. You can find the notebooks inside the `/notebooks` folder. Please clone this repo to your machine, then follow the steps as described below. 

### Running the Site

## Available Scripts

### `npm install -g yarn`
If you don't have yarn, please install yarn with this npm command.

`yarn install`
Before run the yarn script, please install packages with this command.

In the project directory, you can run:

`yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

`yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Running the Notebooks

To run the notebooks locally and to view all the integrated visualiations properly, make sure that you have Jupyter installed. You can find Jupyter installation instructions [here](https://jupyter.org/install.html). 

Once Jupyter has been successfully installed, navigate to the directory where the notebooks are located and run the command `jupyter notebook`. An instance of JupyterLab will spin up, and you can view and change any of the notebooks as desired. 

You may view a [detail guide](https://docs.google.com/document/d/1h76vgy_LERoE-vHN1l1jOaTV0jHh6Q-2yGn7WjvXubw/edit?usp=sharing) written by one of our team members on how to set up your Python environment to be compatible with the notebooks that we've provided.

## Software Architecture 

There is no back-end aspect to this project, just the two stand-alone aspects of the site and notebooks. As such, the architecture for this project is not incredibly complicated. There is also no state management involved with the React site. 

## Authors

* **Thuy-Vy Nguyen** - [thuyvyng](https://github.com/thuyvyng)
* **Laura Jiang** - [laurajjiang](https://github.com/laurajjiang)
* **Junhyeok (Derek) Jeong** - [wnsgur4322](https://github.com/wnsgur4322)
* **Owen Markley** - [MarkleyO](https://github.com/MarkleyO)

## Contributing

If you are externally interested in contributing to the project, feel free to fork the project directory from master. When you have a change that you are interested in merging, submit a pull request so that your changes may be reviewed. 
