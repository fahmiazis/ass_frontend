import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const {REACT_APP_BACKEND_URL} = process.env
const filePict = ['png', 'jpg', 'jpeg', 'bmp']

export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  const { pdf, dataFile } = props
  const genData = dataFile === undefined ? 'file.pdf' : dataFile.path.split('/')
  const cekDoc = genData[2].split('.')
  console.log(cekDoc)
  console.log(cekDoc[cekDoc.length - 1])
  return (
    filePict.find(item => item === cekDoc[cekDoc.length - 1]) !== undefined ? 
    <div>
      <img className="imgPdf" src={`${REACT_APP_BACKEND_URL}/${dataFile.path}`} />
    </div>
    : cekDoc[cekDoc.length - 1] === 'pdf' ? 
      // <Document
      //   file={pdf}
      //   options={{ workerSrc: "../../public/pdf.worker.js" }}
      //   onLoadSuccess={onDocumentLoadSuccess}
      // >
      //   {Array.from(new Array(numPages), (el, index) => (
      //     <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      //   ))}
      // </Document>
      <div id="wrap">
        <iframe id="scaled-frame" src={pdf} className='pdfDiv' />
      </div>
    : 'File cannot show, please download this file'
  )
}
