import './App.css';
import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useState } from 'react';

function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function removeTextLayerOffset() {
    const textLayers = document.querySelectorAll(
      '.react-pdf__Page__textContent'
    );
    textLayers.forEach((layer) => {
      const { style } = layer;
      style.top = '0';
      style.left = '0';
      style.transform = '';
    });
  }
  const handleOnClick = (event) => {
    
    const { pageX, target } = event
    const {offsetLeft, offsetWidth } = target
    if (target.nodeName !== "CANVAS") {
      console.log("Out")
      return
    }
    const d = Math.floor(offsetWidth/3)
    const relativeX = pageX - offsetLeft 
    if (relativeX > 0 && relativeX < d) {
      console.log("LEFT")
      setPageNumber(pageNumber - 1)
    }
    if (relativeX > d*2 && relativeX < d*3) {
      console.log("RIGHT")
      setPageNumber(pageNumber + 1)
    }
    if (relativeX > d*1 && relativeX < d*2) console.log("Mid")

  }
  return (
    <div className="App">
      <Document file="sample.pdf" onLoadSuccess={onDocumentLoadSuccess}>
        <Page className="my-class" onClick={handleOnClick} height="1080" pageNumber={pageNumber} onLoadSuccess={removeTextLayerOffset} />
      </Document>
      <button
        onClick={() => {
          setPageNumber(pageNumber - 1);
        }}
      >
        Previous
      </button>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button
        onClick={() => {
          setPageNumber(pageNumber + 1);
        }}
      >
        Next
      </button>
    </div>
  );
}

export default App;
