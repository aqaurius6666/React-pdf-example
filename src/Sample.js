import React, { useState } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import './sample.css';
import pdf from '../src/sample.pdf'
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function Render() {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [renderedPageNumber, setRenderedPageNumber] = useState(null);

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
        }
    }
    const isLoading = renderedPageNumber !== pageNumber;
    return (
        <React.Fragment>
            <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
               { isLoading && renderedPageNumber ? <Page
                    key={renderedPageNumber}
                    className={`prevPage ${(renderedPageNumber > pageNumber ? 'animation-to-right' : 'animation-to-left')}`}
                    pageNumber={renderedPageNumber}
                    width="400"
                    onClick={handleOnClick}
                /> : null}
                <Page
                    key={pageNumber}
                    pageNumber={pageNumber}
                    onRenderSuccess={() => {
                        setRenderedPageNumber(pageNumber)
                    }}
                    width="400"
                    onClick={handleOnClick}
                    
                />
            </Document>
        </React.Fragment>
    );
}

export default Render;
