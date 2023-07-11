import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import './style.css'

const Dashboard = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState([])
    const [fullScreenImage, setFullScreenImage] = useState(null);

    const handleImageClick = (event) => {
        const imageUrl = event.target.src;
        setFullScreenImage(imageUrl);
    };

    const handleCloseClick = () => {
        setFullScreenImage(null);
    };

    useEffect(() => {
        axios.get('http://localhost:8000/findfile', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                setFiles(res.data.response)
            })
            .catch(err => console.error(err))
    }, [])

    const handleSubmit = async () => {
        const formdata = new FormData()
        formdata.append('myFile', document.getElementById('file').files[0])
        formdata.append('title', title)
        formdata.append('description', description)

        await axios.post('http://localhost:8000/upload/addFile', formdata, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
    }

    return (
        <>
            <form className='dash-form'>
                <h1>Upload a file</h1>
                {localStorage.getItem('role') === "admin" ?
                    <>
                        <div className='form-section'>
                            <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                                <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
                                <input type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
                                <input type="file" id='file' />
                            </div>
                            <input type="submit" id={'submit'} onClick={handleSubmit} />
                        </div>
                        <div className='table'>
                            <div className='table-row'>
                                <h2>Title</h2>
                                <h2>Description</h2>
                                <h2>Image File</h2>
                            </div>
                            {
                                files.map((file, index) =>
                                    <div className='table-row' key={index}>
                                        <span>{file.title}</span>
                                        <span>{file.description}</span>
                                        <div className='file-image'>
                                            <div className='image'>
                                                <img src={`data:image/${file.filename.split('.')[1]};base64,${file.myFile}`} alt="" onClick={handleImageClick} />
                                            </div>
                                            <button>Preview</button>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </>
                    : null
                }
            </form>
            {fullScreenImage && (
                <div className="fullscreen-overlay" onClick={handleCloseClick}>
                    <img src={fullScreenImage} alt="Full Screen" className="fullscreen-image" />
                </div>
            )}
        </>
    );
}

export default Dashboard