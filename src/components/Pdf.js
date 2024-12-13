import React, { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import FormIo from './Pengadaan/FormIo'

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
const {REACT_APP_BACKEND_URL} = process.env
const filePict = ['png', 'jpg', 'jpeg', 'bmp']

export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  const { pdf, dataFile, noDoc, noTrans, detailForm } = props
  const genData = dataFile === undefined ? ['file.pdf'] : dataFile.path.split('/')
  const cekDoc = genData[genData.length - 1].split('.')
  const cekPr = genData.find(item => item === 'printPR')
  console.log(cekDoc)
  console.log(cekDoc[cekDoc.length - 1])
  return (
    cekDoc.length !== 0 && filePict.find(item => item === cekDoc[cekDoc.length - 1].toString().toLowerCase()) !== undefined ? 
    <div>
      <img className="imgPdf" src={`${REACT_APP_BACKEND_URL}/${dataFile.path}`} />
    </div>
    : cekDoc.length !== 0 && cekDoc[cekDoc.length - 1].toString().toLowerCase() === 'pdf' || cekPr !== undefined ? 
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
        <iframe id="scaled-frame" 
        src={noDoc === noTrans ? dataFile.path : pdf}
        // src={pdf} 
        className='pdfDiv' />
        {/* <iframe id="scaled-frame" src={pdf} className='pdfDiv' /> */}
      </div>
    // : dataFile.path === (detailForm !== undefined ? detailForm.no_ref : null) ? 
    // <div >
    //   <FormIo className="docForm" detailForm={detailForm} tipe='access' /> 
    // </div>
    :'File cannot show, please download this file'
  )
}
