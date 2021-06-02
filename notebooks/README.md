# Notebooks Setup Guide
A more advanced User Guide / Startup Guide can be found in the following document:

https://oregonstate.app.box.com/file/817412863767



## Downloading and Installing Requirements

The basic requirements to run the notebook portion includes:
* python (any version 3+ should be sufficient)
* Jupyter Notebooks

Any version of Python >= 3.4 should also have pip installed by default, which is the package manager
we prefer to use to install the various packages used by the AI/ML models, as well as our own library we've developed.

Run these commands to ensure that the proper software is installed:
* `python --version`
* `python -m pip --version`
* `jupyter --version`

If any of these return an error of some kind, please direct yourself to the installation webpage for that software:
* [Python Installation](https://www.python.org/downloads/)
* [Pip Installation](https://pip.pypa.io/en/stable/installing/)
* [Jupyter Installation](https://jupyter.org/install)

### Installing dependent packages

Clone this repository and navigate to the 'notebooks' directory from the terminal. Ensure that the requirements.txt file is present. Then run the command `pip install -r requirements.txt`. This will install each package that this project depends on. Run the command `pip list` to see which packages are installed in the current environment. A description of all packages installed can be found in the 'User Guide' document. 

NOTE: If you are a mac user, or if packages do not show up on pip list, try using `pip3` rather than `pip`

## Proper filesystem

Ceratain portions of notebook code, and the generation and reference of .json files is dependent on how the filesystem is structured. It is vital that neither the location of the 'libraries' directory nor any of its contents are changed. Ensure the filesystem matches that seen on this repository. 

## Running Notebooks

In the terminal, enter the command `jupyter notebook`. This will open a page in the default web browser. Open one of the .ipynb files, and select the 'run' button to move through cells. If you are not directed towards a window in the browser, try visiting the address [http:://localhost:8888](http:://localhost:8888)

## Trouble Shooting
If an error message appears regarding Keras missing a module, try reinstalling tensorflow with the following command `pip install tensorflow --upgrade --force-reinstall`
