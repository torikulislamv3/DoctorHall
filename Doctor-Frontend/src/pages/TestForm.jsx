import React, { useState } from 'react'
import axios from 'axios'

export default function TestForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [speciality, setSpeciality] = useState('')
    const [experience, setExperience] = useState('')
    const [about, setAbout] = useState('')
    const [fees, setFees] = useState('')
    const [degree, setDegree] = useState('')
    const [address, setAddress] = useState('')
    const [image, setImage] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('speciality', speciality)
        formData.append('experience', experience)
        formData.append('about', about)
        formData.append('fees', fees)
        formData.append('degree', degree)
        formData.append('address', address)
        formData.append('image', image)

        try {
            const response = await axios.post(
                'http://localhost:4000/api/admin/add-doctor',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )
            console.log('Success:', response.data)
            alert('Doctor added successfully!')
        } catch (error) {
            console.error('Error:', error.message)
            alert('Something went wrong!')
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder='name' required />
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder='email' required />
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder='password' required />
            <input value={speciality} onChange={e => setSpeciality(e.target.value)} type="text" placeholder='speciality' />
            <input value={degree} onChange={e => setDegree(e.target.value)} type="text" placeholder='degree' />
            <input value={experience} onChange={e => setExperience(e.target.value)} type="text" placeholder='experience' />
            <input value={about} onChange={e => setAbout(e.target.value)} type="text" placeholder='about' />
            <input value={fees} onChange={e => setFees(e.target.value)} type="text" placeholder='fees' />
            <input value={address} onChange={e => setAddress(e.target.value)} type="text" placeholder='address' />
            <input onChange={e => setImage(e.target.files[0])} type="file" accept='image/*' required />
            <button type="submit">Send now</button>
        </form>
    )
}
