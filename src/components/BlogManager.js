import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import './BlogManager.css'; // Estilos específicos para el componente de gestor de blogs

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [autor, setAutor] = useState('');
    const [editingBlog, setEditingBlog] = useState(null);

    const fetchBlogs = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/posts`);
        setBlogs(response.data);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleAddBlog = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/blog/createPost`, { title, content, images, autor }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogs([...blogs, response.data]);
            setTitle('');
            setContent('');
            setImages([]);
            setAutor('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditBlog = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/posts/${editingBlog._id}`, { title, content, images, autor }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updatedBlogs = blogs.map(blog =>
                blog._id === editingBlog._id ? response.data : blog
            );
            setBlogs(updatedBlogs);
            setTitle('');
            setContent('');
            setImages([]);
            setAutor('');
            setEditingBlog(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteBlog = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/blog/posts/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const startEditing = (blog) => {
        setTitle(blog.title);
        setContent(blog.content);
        setImages(blog.images);
        setAutor(blog.autor);
        setEditingBlog(blog);
    };

    const handleImageUpload = async (files) => {
        const uploads = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'your_cloudinary_upload_preset'); // Cambia esto a tu upload preset

            const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloudinary_cloud_name/image/upload', formData);
            return response.data.secure_url;
        });

        const uploadedImages = await Promise.all(uploads);
        setImages([...images, ...uploadedImages]);
    };

    const handleFileUpload = async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const fileContent = e.target.result;
                setContent(fileContent);
            };
            reader.readAsText(file);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleFileUpload, accept: ['.pdf', '.docx', '.txt'] });

    return (
        <div className="blog-manager-container">
            <h2>Blog Manager</h2>
            <form onSubmit={editingBlog ? handleEditBlog : handleAddBlog}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <ReactQuill value={content} onChange={setContent} />
                </div>
                <div>
                    <label>Image URLs:</label>
                    <input
                        type="text"
                        value={images.join(', ')}
                        readOnly
                    />
                    <input type="file" onChange={(e) => handleImageUpload(e.target.files)} multiple />
                </div>
                <div>
                    <label>Author:</label>
                    <input
                        type="text"
                        value={autor}
                        onChange={(e) => setAutor(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">{editingBlog ? 'Update Blog' : 'Add Blog'}</button>
            </form>
            <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <p>Drag & drop a file here, or click to select files</p>
            </div>
            <ul>
                {blogs.map(blog => (
                    <li key={blog._id}>
                        <h3>{blog.title}</h3>
                        <p>{blog.content}</p>
                        {blog.images.map((image, index) => (
                            <img key={index} src={image} alt={`Blog ${index}`} />
                        ))}
                        <p><strong>Author:</strong> {blog.autor}</p>
                        <button onClick={() => startEditing(blog)}>Edit</button>
                        <button onClick={() => handleDeleteBlog(blog._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlogManager;
