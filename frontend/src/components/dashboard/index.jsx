import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import './style.css'
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [files, setFiles] = useState([])
    const [fullScreenImage, setFullScreenImage] = useState(null);

    const handleImageClick = (index) => {
        const imageSrc = document.getElementById(index).src
        setFullScreenImage(imageSrc);
    };

    const handleCloseClick = () => {
        setFullScreenImage(null);
    };

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/findfile`, {
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

        await axios.post(`${process.env.REACT_APP_BASE_URL}/upload/addFile`, formdata, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <>
            <button className='logout' onClick={handleLogout}>Logout</button>
            <form className='dash-form' onSubmit={(e) => e.preventDefault()}>
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
                                                <img id={index} src={`data:image/${file?.filename?.split('.')[1]};base64,${file.myFile}`} alt="" onClick={() => handleImageClick(index)} />
                                            </div>
                                            <button onClick={() => handleImageClick(index)} style={{ cursor: 'pointer' }}>Preview</button>
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