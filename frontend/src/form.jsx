import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';

function TableData() {
    const [studentData, setStudentData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [city, setCity] = useState('');

    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // Fetch data from the backend
    useEffect(() => {
        axios.get('http://localhost:8080/api/users')
            .then(response => {
                setStudentData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was an error fetching the student data:', error);
                setLoading(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newStudent = { id, name, email, city };

        // Send POST request to backend
        axios.post('http://localhost:8080/api/users', newStudent)
            .then((response) => {
                setStudentData([...studentData, response.data]); // Update table with new data
                // Clear form inputs
                setId('');
                setName('');
                setEmail('');
                setCity('');
            })
            .catch((error) => {
                console.error('Error adding student:', error);
            });
    };

    const resetForm = () => {
        setId('');
        setName('');
        setEmail('');
        setCity('');
        setIsEdit(false);
        setEditId(null);
    };

    // Handle submission for PUT (Update)
    const handleEditSubmit = (e) => {
        e.preventDefault();
        const updatedStudent = { id, name, email, city };

        axios.put(`http://localhost:8080/api/users/${editId}`, updatedStudent)
            .then(response => {
                setStudentData(studentData.map(student =>
                    student.id === editId ? response.data : student
                ));
                resetForm();
            })
            .catch(error => {
                console.error('Error updating student:', error);
            });
    };

    const deleteData = (id) =>{
        axios.delete(`http://localhost:8080/api/users/${id}`)
            .then(response => {
                // Handle successful deletion, e.g., update state
                setStudentData(prevData => prevData.filter(item => item.id !== id));
            })
            .catch(error => {
                console.error("There was an error deleting the data!", error);
            });
    }

    const handleEditClick = (student) => {
        setIsEdit(true); // Enable edit mode
        setEditId(student.id); // Store the ID of the student being edited
        setId(student.id); // Populate form with existing values
        setName(student.name);
        setEmail(student.email);
        setCity(student.city);
    };
    

    // Render the table rows
    const tableRows = studentData.map((info) => (
        <tr key={info.id}>
            <td>{info.id}</td>
            <td>{info.name}</td>
            <td>{info.email}</td>
            <td>{info.city}</td>
            <td>
                <Button onClick= {() => deleteData(info.id)} variant="primary">
                        Delete
                </Button></td>
            <td>
            <Button onClick={() => handleEditClick(info)} variant="primary">
                Edit
            </Button>
                
            </td>
        </tr>
    ));

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <h2>{isEdit ? "Edit Data" : "Add Data"}</h2>
                <Form onSubmit={isEdit ? handleEditSubmit : handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="number"
                            name="id"
                            placeholder="ID"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            disabled={isEdit} // Disable ID input when editing
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            name="city"
                            placeholder="City"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {isEdit ? "Update" : "Submit"}
                    </Button>
                    {isEdit && (
                        <Button
                            variant="secondary"
                            className="ms-2"
                            onClick={resetForm}
                        >
                            Cancel
                        </Button>
                    )}
                </Form>
            </div>
            <div>
                <h3>Student Table</h3>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>City</th>
                            <th>Delete</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>{tableRows}</tbody>
                </table>
            </div>
        </>
    );
    
}

export default TableData;
