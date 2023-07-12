import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import './style.css'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate()
    const [files, setFiles] = useState([])
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [shareScreen, setshareScreen] = useState(false);
    const [reciepient, setReciepient] = useState('');
    const [imageIndex, setImageIndex] = useState('');
    const [fileId, setFileId] = useState('');

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

    const handleShare = (index, id) => {
        setImageIndex(index)
        setFileId(id)
        setshareScreen(!shareScreen)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        navigate('/login')
    }

    const shareFile = () => {
        axios.post(`${process.env.REACT_APP_BASE_URL}/sendEmail/${fileId}`, { email: reciepient }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
            .then(res => {
                setshareScreen(false)
                alert(res.data.message)
                setReciepient('')

            })
            .catch(err => console.error(err))
    }

    return (
        <>
            <button className='logout' onClick={handleLogout}>Logout</button>
            <form className='dash-form' onSubmit={(e) => e.preventDefault()}>
                <h1>Welcome </h1>
                <>
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
                                        <button onClick={() => handleShare(index, file._id)} style={{ cursor: 'pointer' }}>Share</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </>
            </form>
            {fullScreenImage && (
                <div className="fullscreen-overlay" onClick={handleCloseClick}>
                    <img src={fullScreenImage} alt="Full Screen" className="fullscreen-image" />
                </div>
            )}
            {shareScreen && (
                <div className="fullscreen-overlay">
                    <span onClick={() => setshareScreen(!shareScreen)} className='close'>X</span>
                    <div className='share-window'>
                        <h2>Share a file with your friends and network</h2>
                        <div style={{ display: 'flex', gap: 15, justifyContent: 'space-between' }}>
                            <input type="email" placeholder="Please enter reciepient's email address" value={reciepient} onChange={(e) => setReciepient(e.target.value)} />
                            <button className='shareBtn' onClick={shareFile} >Share</button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0' }}>
                            <img src={`${document.getElementById(imageIndex).src}`} alt="" width={300} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Dashboard