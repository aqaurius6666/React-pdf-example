import React, { useEffect, useState, useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import axios from 'axios'
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Test() {
  const [data, setData] = useState(null)
  const [dataId, setDataId] = useState(0)

  const getPDF = async (dataId, startPage) => {
    console.log(`http://localhost:2999/api/readManga/${dataId}/${startPage}`)
    return axios.get(`http://localhost:2999/api/readManga/${dataId}/${startPage}`)
      .then(res => res.data)
      .then(data => Uint8Array.from(data.data.data))
  }
  useEffect(() => {
    getPDF(dataId, 0).then(data => setData(data))
  }, [dataId])
  const nextChap = () => {
    setDataId((dataId + 1 + 4) % 4)
  }
  const preChap = () => {
    setDataId((dataId - 1 + 4) % 4)
  }
  return (
    <Render data={data} preChap={preChap} nextChap={nextChap}/>
  )
}

function Render({ data, preChap, nextChap }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedPageNumber, setRenderedPageNumber] = useState(null);
  const [isShow, setIsShow] = useState(false)
  const file = useMemo(() => {
    setPageNumber(1)
    setRenderedPageNumber(null)
    setIsShow(false)
    return {data}
  }, [data])

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }
  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
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
      if (pageNumber > 1) previousPage()
      else console.log("At 1")
    }
    if (relativeX > d * 2 && relativeX < d * 3) {
      console.log("RIGHT")
      if (pageNumber < numPages) nextPage()
      else console.log(`At ${numPages}`)
    }
    if (relativeX > d * 1 && relativeX < d * 2) {
      console.log("Mid")
      setIsShow(true)
      setTimeout(() => setIsShow(false), 2000)
    }

  }
  const isLoading = renderedPageNumber !== pageNumber;

  return (
    <React.Fragment>
      {isShow && <div className="overlay">
        <p>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </p>
        <button type="button" onClick={preChap}>
          Pre
        </button>
        <button type="button" onClick={nextChap}>
          Next
        </button>
      </div>}
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        {isLoading && renderedPageNumber ? (
          <Page
            key={renderedPageNumber}
            className="prevPage"
            pageNumber={renderedPageNumber}
            width="400"
            onClick={handleOnClick}
          />
        ) : null}
        <Page
          key={pageNumber}
          pageNumber={pageNumber}
          onRenderSuccess={() => setRenderedPageNumber(pageNumber)}
          width="400"
          onClick={handleOnClick}
        />
      </Document>

    </React.Fragment>
  );
}

export default Test;
