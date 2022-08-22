# ArchUtils

#### ArchUtils is a responsive web application which aims to provide some utilities to architects. It provides functionalities such as converting _.dxf_ files to _.svg_, generating displacement maps (height maps) from files (.dxf & .svg ) given that their content follows a topographic map structure, and interactive visualizations of your displacement maps. It uses React for front-end side, NodeJs+express for back-end side and python for some of the scripts.

|                              Desktop View                               |                                  Mobile View                                   |
| :---------------------------------------------------------------------: | :----------------------------------------------------------------------------: |
| <img src="./readme resources/landing page screenshot.png" width="70%"/> | <img src="./readme resources/landing page mobile screenshot.png" width="35%"/> |

---

## Install and Run:

1. Install & build React Applicaiton

- Install react application dependencies

  ```bash
  cd arch-utils
  npm install
  ```

- Build the application
  ```bash
  npm run build
  ```

After successfull completion, you should now have a _build_ folder located inside _arch-utils_ folder.

2. Install & run NodeJs server

- Install python modules that are required for the python scripts:
  ```bash
  cd arch-utils-backend
  pip install -r requirements.txt
  ```
- Install Nodejs npm dependencies
  ```bash
  npm install
  ```
- Start NodeJs server
  ```bash
  npm start
  ```

After these steps you can reach the site by visiting _http://localhost:8080/_ on your web browser.

---

## Run Server and Client Separately Using Docker:

- **React Application**:
  - To create image:
    ```bash
    cd arch-utils
    docker build -f Dockerfile -t client .
    ```
  - To create and run container:
    ```bash
    docker run -it -p 3000:3000 client
    ```
    React Application will start at _http://localhost:3000_ on your machine.
- **NodeJs Server**:
  - To create image:
    ```bash
    cd arch-utils-backend
    docker build -f Dockerfile -t server .
    ```
    - To create and run container:
    ```bash
    docker run -it -p 8080:8080 server
    ```
    NodeJs server will start at port 8080 on your machine.
    - **Note** that it won't be able to serve react application since this container won't have _arch-utils/build_ folder in its _WORKDIR_.

---

## Run Server and Client Together using Docker:

This builds React application and then serves the application using nodeJs server which also serves the API end-points. It will build the react application first and then only start the nodeJs server.

```bash
docker build -t server .
docker run -it -p 8080:8080 server
```

---

## Versions:

Versions of the technologies used during development could be found below:

```bash
node --version
v16.17.0
```

```bash
python --version
3.7.11
```

---

## Project Structure:

- **arch-utils**:
  React application containing front-end code.
- **arch-utils-backend**:
  NodeJs server containing back-end code. It contains API end-points, and serves react application's (arch-utils) build.

---
