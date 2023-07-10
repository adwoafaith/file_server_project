import axios from 'axios';
import React from 'react';
import { useState } from 'react';

const Dashboard = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [myFile, setMyFile]=useState('')

    const getFile = (e) => {
    }

    const handleSubmit = async () => {
        const formdata = new FormData()
        formdata.append('myFile', document.getElementById('file').files[0])
        formdata.append('title', title)
        formdata.append('description', description)
        formdata.append('myFile',myFile)

        console.log(formdata)
        const res = await axios.post('http://localhost:8000/upload/addFile', formdata, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Accept': 'application/json'
            }
        })
        console.log(res)
    }

    return (
        <>
        <form className='dash-form'> 
        {localStorage.getItem('role') === "admin"?
        <div className='table-inner'>
            <input type="text" placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder='Description' onChange={(e) => setDescription(e.target.value)} />
            <input type="file" onChange={getFile} id='file' />
            <input type="submit" onClick={handleSubmit} />
            <div className='tables-inner' style={{width:"auto"}}>
             <h3>welcome user</h3>
                <table style={{width:500}}>
                <tr>
                    <th>Title</th>
                    <th>description</th>

                </tr>
               
            </table>

            </div>
            </div>: null

            
       }

        </form>
        </>
    );
}

export default Dashboard