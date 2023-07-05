import axios from 'axios';
import React from 'react'
import { useState } from 'react';

const Dashboard = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const getFile = (e) => {
    }

    const handleSubmit = () => {
        const formdata = new FormData()
        formdata.append('file', document.getElementById('file').files[0])
        formdata.append('title', title)
        formdata.append('description', description)

        console.log(formdata)
        axios.post('http://localhost:8000/upload/addFile', formdata, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
    }

    return (
        <>
            <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
            <input type="file" onChange={getFile} id='file' />
            <input type="submit" onClick={handleSubmit} />
        </>
    );
}

export default Dashboard