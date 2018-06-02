# Setup

## Install JetBrains WebStorm IDE

https://www.jetbrains.com/webstorm/download/

## Install NVM and NodeJS

It is best to use NVM (Node Version Manager) to install and manage NodeJS. Aside from being able to use multiple versions at the same time, there is also the added benefit of not needing to use `sudo` when installing global NPM packages.

* Go to the NVM [site](https://github.com/creationix/nvm/blob/master/README.md#installation) and follow instructions to install NVM. 
* Next, install the latest version of NodeJS: `nvm install node`
  * As of time of writing, we are using NodeJS v10.3.0, NPM v6.1.0.

## Install Angular CLI

``` bash
npm install -g @angular/cli
```

## Setup MongoDB dev server

### Install VirtualBox and Vagrant

1. https://www.virtualbox.org/wiki/Downloads
2. https://www.vagrantup.com/downloads.html

We will use the VirtualBox provisioner with Vagrant, which is why it is needed.

### Download the vagrant box for MongoDB (known as MongoBox)

``` bash
cd $THIS_REPO_ROOT
git clone --recursive https://github.com/bobthecow/vagrant-mongobox.git mongobox
```






