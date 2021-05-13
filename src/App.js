import './App.css';
import { Document, Page, pdfjs } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useState } from 'react';
const samples = ['AFISH_sample_210224.pdf', 'TEN0_sample_210224.pdf', 'TEN1_sample_210224.pdf', 'TEN2_sample_210224.pdf']
function App() {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isShow, setIsShow] = useState(false)
  const [pageId, setPageId] = useState(0)
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
    const { offsetLeft, offsetWidth } = target
    if (target.nodeName !== "CANVAS") {
      console.log("Out")
      return
    }
    const d = Math.floor(offsetWidth / 3)
    const relativeX = pageX - offsetLeft
    if (relativeX > 0 && relativeX < d) {
      console.log("LEFT")
      if (pageNumber > 1) setPageNumber(pageNumber - 1)
      else console.log("At 1")
    }
    if (relativeX > d * 2 && relativeX < d * 3) {
      console.log("RIGHT")
      if (pageNumber < numPages) setPageNumber(pageNumber + 1)
      else console.log(`At ${numPages}`)
    }
    if (relativeX > d * 1 && relativeX < d * 2) {
      console.log("Mid")
      setIsShow(true)
      setTimeout(() => setIsShow(false), 2000)
    }

  }
  return (
    <div className="App">
      { isShow && <div className="row overlay">
        <button onClick={() => {
          setPageId((pageId - 1 + samples.length) % samples.length)
          setPageNumber(1)
        }}>
          Previous
      </button>
        <button onClick={() => {
          setPageId((pageId + 1 + samples.length) % samples.length)
          setPageNumber(1)
        }}>
          Next
      </button>
      </div>}
      <Document file={samples[pageId]} onLoadSuccess={onDocumentLoadSuccess}>

        <Page className="my-class" onClick={handleOnClick} height="1000" renderTextLayer={false} pageNumber={pageNumber} onLoadSuccess={removeTextLayerOffset} />
      </Document>
    </div>
  );
}

export default App;
