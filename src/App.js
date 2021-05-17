import React, { useEffect, useState, useMemo } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import axios from 'axios'
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Test() {
  const [data, setData] = useState(null)
  const [dataId, setDataId] = useState(0)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(null)
  const [canNext, setCanNext] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)


  const getPDF = async (dataId, startPage) => {
    console.log(`http://localhost:2999/api/readManga/${dataId}/${startPage}`)
    return axios.get(`http://localhost:2999/api/readManga/${dataId}/${startPage}`)
      .then(res => res.data)
      .then(({ data }) => data)
  }
  useEffect(() => {
    getPDF(dataId, start).then(({ buffer, start, end, canNext }) => {
      console.log(start, end, canNext)
      setData(Uint8Array.from(buffer.data))
      setStart(start)
      setEnd(end)
      setCanNext(canNext)
    })
  }, [dataId, start])
  const nextChap = () => {
    setDataId((dataId + 1 + 4) % 4)
    setCurrentPage(1)
  }
  const preChap = () => {
    setDataId((dataId - 1 + 4) % 4)
    setCurrentPage(1)

  }
  const readNext = () => {
    if (canNext) {
      setStart(end)
      setCurrentPage(1)
    }
  }
  const readBack = () => {
    setCurrentPage(start)
    if (start - 15 < 0) setStart(0)
    else setStart(start - 15)

  }
  return (
    <Render data={data} preChap={preChap} nextChap={nextChap} readNext={readNext} readBack={readBack} currentPage={currentPage} />
  )
}

function Render({ data, preChap, nextChap, readNext, readBack, currentPage }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedPageNumber, setRenderedPageNumber] = useState(null);
  const [isShow, setIsShow] = useState(false)
  const [transitionClass, setTransitionClass] = useState()
  const file = useMemo(() => {
    setPageNumber(1)
    setRenderedPageNumber(null)
    setIsShow(false)
    return { data }
  }, [data])

  function onDocumentLoadSuccess({ numPages }) {
    console.log(11)
    setNumPages(numPages);
    setPageNumber(currentPage)
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
    setTransitionClass("")
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
      if (pageNumber === 1) readBack()
      if (pageNumber > 1) previousPage()
      else console.log("At 1")
    }
    if (relativeX > d * 2 && relativeX < d * 3) {
      console.log("RIGHT")
      if (pageNumber === numPages) readNext()
      if (pageNumber < numPages) nextPage()
      else console.log(`At ${numPages}`)
    }
    if (relativeX > d * 1 && relativeX < d * 2) {
      console.log("Mid")
      setIsShow(true)
      setTimeout(() => setIsShow(false), 2000)
    }

  }

  const callTransitionClass = () => {
    console.log(renderedPageNumber, pageNumber)
    if (renderedPageNumber < pageNumber) {
      setTransitionClass('animation-too-left')
      return
    }
    setTransitionClass('animation-too-right')
    return
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
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess} >
        {(
          <div
            style={{ position: 'absolute', width: '100%', textAlign: '-webkit-center' }}
          >
            <Page
              key={renderedPageNumber}
              className={`prevPage ${transitionClass}`}
              pageNumber={renderedPageNumber}

              width="400"
              onClick={handleOnClick}
            />
          </div>
        )}
        <div
          style={{ position: 'absolute', width: '100%', textAlign: '-webkit-center' }}
        >
          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            onRenderSuccess={() => {
              callTransitionClass()
              setRenderedPageNumber(pageNumber)
            }}
            width="400"
            onClick={handleOnClick}
          />
        </div>


      </Document>

    </React.Fragment>
  );
}

export default Test;
