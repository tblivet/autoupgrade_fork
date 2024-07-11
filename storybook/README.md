# Storybook overview

This mini-project provides an overview of the different components of the interface of the "Update assistant" module
in different versions of Prestashop.

## Prerequisites

- PHP >= 8.2
- Composer - [Download Composer](https://getcomposer.org/)
- Node.js >= 19 - [Download Node.js](https://nodejs.org/)

## Install project dependencies

**Install PHP dependencies**

To install the necessary PHP dependencies, run the following command:

```shell
$ composer install
```

**Install Node dependencies**

To install the necessary Node.js dependencies, run the following command:

```shell
$ npm install
```

## Start Local Environment

**Start Local PHP Server**

To start a local PHP server, use the following command:

```shell
$ php -S localhost:8003 -t public/
```

**Start Storybook**

To start Storybook, use the following command:

```shell
$ npm run storybook
```

Once started, you can access Storybook at: http://localhost:6006/

## Build and start environment with docker

### Build Custom Docker Image

To build the Docker image, run the following command:

```shell
$ docker build -f .docker/Dockerfile -t autoup-storybook .
```

### Install Project Dependencies with Docker

**Install PHP Dependencies**

Run the following command to install PHP dependencies via Docker:

```shell
$ docker run -u 1000:1000 --rm --interactive --tty -v "$PWD"/../:/app -w /app/storybook composer install
```

**Install Node dependencies**

Run the following command to install Node.js dependencies via Docker:

```shell
$ docker run -u 1000:1000 -it --rm -v "$PWD":/var/www/html -w /var/www/html autoup-storybook npm install
```

### Start Docker environment

**Start Symfony Server**

To start the Symfony server via Docker, use the following command:

```shell
$ docker run -p 8003:8000 -it --rm -v "$PWD"/../:/var/www/html -w /var/www/html/storybook autoup-storybook symfony server:start
```

**Start Storybook**

To start Storybook via Docker, use the following command:

```shell
$ docker run -u 1000:1000 -p 6006:6006 -it --rm -v "$PWD":/var/www/html -w /var/www/html autoup-storybook npm run storybook
```

Once started, you can access Storybook at: http://localhost:6006/

## Lint project files

To lint project files, use the following command:

```shell
$ npm run lint
```
