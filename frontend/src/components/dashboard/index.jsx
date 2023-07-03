import axios from 'axios';
import React from 'react'
import { useState } from 'react';

const Dashboard = () => {
    const [file, setFile] = useState(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const getFile = (e) => {
        const formdata = new FormData()
        setFile(formdata.get(e.target.value))
    }

    const handleSubmit = () => {
        axios.post('http://localhost:8000/upload/addFile', {title, description, file}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
    }

    return (
        <>
            <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)}/>
            <input type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)}/>
            <input type="file"  onChange={getFile} value={file}/>
            <input type="submit" onClick={handleSubmit}/>
        </>
    );
}

export default Dashboard