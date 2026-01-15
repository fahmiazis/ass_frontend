import React, { useState, useRef, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import FormIo from './Pengadaan/FormIo'

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`
const {REACT_APP_BACKEND_URL} = process.env
const filePict = ['png', 'jpg', 'jpeg', 'bmp']

export default function AllPages(props) {
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef(null)
  const contentRef = useRef(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setIsLoaded(true)
  }

  // Center content on load
  useEffect(() => {
    if (isLoaded && containerRef.current && contentRef.current) {
      // Reset position to center
      setPosition({ x: 0, y: 0 })
    }
  }, [isLoaded, numPages])

  const { pdf, dataFile, noDoc, noTrans, detailForm, tipe } = props
  const genData = dataFile === undefined ? ['file.pdf'] : dataFile.path.split('/')
  const cekDoc = genData[genData.length - 1].split('.')
  const cekPr = genData.find(item => item === 'printPR')
  const pathData = genData[genData.length - 1]

  // Handle mouse wheel zoom dengan Ctrl
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault()
        e.stopPropagation()
        
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        const newScale = Math.min(Math.max(0.5, scale + delta), 3)
        
        setScale(newScale)
      } else {
        e.stopPropagation()
      }
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      container.removeEventListener('wheel', handleWheel)
    }
  }, [scale])

  // Handle mouse drag untuk pan
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    })
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      e.preventDefault()
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Reset zoom dan position
  const handleDoubleClick = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  return (
    <>
      {cekDoc.length !== 0 && filePict.find(item => item === cekDoc[cekDoc.length - 1].toString().toLowerCase()) !== undefined ? (
        <div
          ref={containerRef}
          style={{
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            justifyContent: 'center'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
        >
          <div
            ref={contentRef}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center top',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              display: 'inline-block',
              userSelect: 'none'
            }}
          >
            <img 
              className="imgPdf" 
              src={`${REACT_APP_BACKEND_URL}/uploads/${pathData}`}
              draggable="false"
              style={{ 
                display: 'block',
                pointerEvents: 'none'
              }}
            />
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            {Math.round(scale * 100)}% | Ctrl+Scroll: Zoom | Drag: Pan | DblClick: Reset
          </div>
        </div>
      ) : cekDoc.length !== 0 && (cekDoc[cekDoc.length - 1].toString().toLowerCase() === 'pdf' || cekPr !== undefined) ? (
        <div
          ref={containerRef}
          style={{
            width: '100%',
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#525659',
            display: 'flex',
            justifyContent: 'center'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDoubleClick}
        >
          <div
            ref={contentRef}
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center top',
              cursor: isDragging ? 'grabbing' : 'grab',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              userSelect: 'none'
            }}
          >
            <Document
              file={tipe !== 'pengadaan' ? pdf : noDoc === noTrans ? dataFile.path : pdf}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div style={{ 
                  padding: '20px', 
                  textAlign: 'center', 
                  color: 'white' 
                }}>
                  Loading PDF...
                </div>
              }
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page 
                  key={`page_${index + 1}`} 
                  pageNumber={index + 1}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  loading=""
                  style={{
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </Document>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            userSelect: 'none',
            pointerEvents: 'none',
            zIndex: 1000
          }}>
            {Math.round(scale * 100)}% | Ctrl+Scroll: Zoom | Drag: Pan | DblClick: Reset
          </div>
        </div>
      ) : 'File cannot show, please download this file'}
    </>
  )
}