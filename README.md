# Heightmap Generator From Input Contour Map

Given a contour file in the _.dxf_ format, this code generates a visual height map for terrain generation purposes and displays it in a web page.

---

## To run:

1. Convert **.dxf** extension file which you want to generate the heatmap for to **.svg** file format doing the following:

   - To convert _.dxf_ format to _.svg_ format:

     ```bash
     cd temp/dxf2svg
     ```

     ```bash
     python dxf2svg.py IsohipsTest.dxf(<i.e target .dxf file>)
     ```

2. Start the web page for visualizing the generated heightmap in the browser:

   ```bash
   cd ExtractCoordinates
   ```

   - Render the index.html page in your preferred browser.

   **Note:** If you are using Vs Code, you can use the _Live Server_ extension for ease.

---

## Side Notes:

- To install python requirements:

  ```bash
  pip install requirements.txt
  ```

- To Generate requirements.txt file for python:

  **Note**: This is for dev purposes only.

  ```bash
  pip freeze > requirements.txt
  ```
