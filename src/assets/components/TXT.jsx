import { useEffect } from 'react'
import React from 'react'
import { dataToTxt, getDimentionsOfData, getRootFromData, detailsOfRectangle, dataToMyFormat,myFormtToTheirs } from './Functions'
export const TXT = ({ Rectangles }) => {
  const [txt, setTxt] = React.useState('')
  const [details, setDetails] = React.useState('')
  const [dim, setDim] = React.useState('')
  const [Myformat, setMyFormat] = React.useState('')
  const [TheirFormat,setTheirFormat] = React.useState()
  useEffect(() => {
    if (Rectangles !== null) {
      let Rot = getRootFromData(Rectangles)
      let myF = dataToMyFormat(Rot,Rectangles)
      setTxt(dataToTxt(Rectangles).map(row => row.join('')).join('\n'));
      setDetails(detailsOfRectangle(Rectangles))
      setDim(getDimentionsOfData(Rot, Rectangles))
      setMyFormat(myF)
      setTheirFormat(myFormtToTheirs(myF))
    }
  }, [Rectangles]);

  return (
    <div style={{ textAlign: 'center', minHeight :'80vh'}} >
      <pre>
        {txt}
      </pre>
      {Rectangles && (
        <div>
          width : {dim.width} <br></br>
          length : {dim.length}<br></br>
          length Scale : {details.lengthScale}<br></br>
          width Scale : {details.widthScale}<br></br>
          Rectangles :
          {Rectangles.map((obj, index) => (
            <div key={index} style={{ padding: '10px' }}>
              <p>{obj.name}: <strong>Length:</strong> {obj.length}<strong> Width:</strong> {obj.width}</p>
            </div>
          ))}
          <b>My Format :</b> {Myformat}<br></br>
          <b>Their Format :</b>{TheirFormat}
        </div>
      )}
    </div>
  )
}
