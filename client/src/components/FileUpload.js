import React, {Fragment, useState} from 'react'
import axios from 'axios'
import Message from './Message'
import ProgressBar from './ProgressBar'

const FileUpload = () => {
    const [file, setFile] = useState('')
    const [filename, setFilename] = useState('Choose a file');
    const [uploadedFile, setUploadedFile] = useState({fileName:'', filePath:''}) 
    const [message, setMessage] = useState('');
    const [uloadPercentage, setUploadPercentage] = useState(0);


    const onChange = (e) =>{
        setFile(e.target.files[0])
        setFilename(e.target.files[0].name)
    }

    const close = () =>{
      setMessage('')
    }
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file)

  
          // await axios.post('/upload', formData, {
          //   headers :{
          //     "Content-Type" : "multipart/form-data"
          //   }
          // }).then(({data}) => {console.log(data.fileName)}).catch((err) =>{console.log(err)})


        try {
            const res = await axios.post('/upload', formData,{
                headers : {
                    'Content-Type':'multipart/form-data'
                },
                onUploadProgress: progressEvent => {
                  setUploadPercentage(parseInt((Math.round(progressEvent.loaded * 100)/progressEvent.total)))
                  setTimeout(()=>{
                    setUploadPercentage(0)
                  },10000)

                }
                // clear percentage
            })
            
            const {fileName, filePath} = res.data
            
            setUploadedFile({fileName, filePath})
            setMessage('File Uploaded');
        } catch (error) {
            if(error.response.status === 500){
                setMessage('Something Went Wrong With The Server ...!!')
            }else{
                setMessage(error.response.data.msg)
            }
        }

    }
    return (
        <Fragment>
          {message ? <Message msg={message} close={close}/> : null}
          <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
      
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <ProgressBar  percentage={uloadPercentage}/>
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
     
      {uploadedFile ? <div className="row mt-4">
        <div className="col-md-6 m-auto">
          <h3 className="text-center">{uploadedFile.fileName}</h3>
          <img style={{width: '100%'}} src={uploadedFile.filePath} alt={uploadedFile.fileName}/>
          </div>
        </div> :
        <div className="row mt-4">
        <h3 className="text-center">No file uploaded</h3>
        </div>}
        </Fragment>
    )
}

export default FileUpload

     
