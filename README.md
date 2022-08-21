# ArchUtils

#### ArchUtils is a responsive web application which aims to provide some utilities to architects. It provides functionalities such as converting _.dxf_ files to _.svg_, generating displacement maps (height maps) from files (.dxf & .svg ) given that their content follows a topographic map structure, and interactive visualizations with your displacement maps. It uses React for front-end side, NodeJs+express for back-end side and python for some of the scripts.

---

## <img src="./readme resources/app screenshot.png" width="50%"/>

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
  After these steps you can reach the site by visiting "http://localhost:8080/" on your web browser.

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
