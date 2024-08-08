import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import BlogCard from './BlogCard'; // Importar el nuevo componente de tarjeta
import './BlogManager.css'; // Estilos específicos para el componente de gestor de blogs

const BlogManager = () => {
    const [blogs, setBlogs] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [contentImage1, setContentImage1] = useState('');
    const [contentImage2, setContentImage2] = useState('');
    const [autor, setAutor] = useState('');
    const [editingBlog, setEditingBlog] = useState(null);
    const [uploadStage, setUploadStage] = useState(0);

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
            const images = [headerImage, contentImage1, contentImage2];
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/blog/createPost`, { title, content, images, autor }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setBlogs([...blogs, response.data]);
            setTitle('');
            setContent('');
            setHeaderImage('');
            setContentImage1('');
            setContentImage2('');
            setAutor('');
            setUploadStage(0);
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditBlog = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const images = [headerImage, contentImage1, contentImage2];
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
            setHeaderImage('');
            setContentImage1('');
            setContentImage2('');
            setAutor('');
            setEditingBlog(null);
            setUploadStage(0);
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
        setHeaderImage(blog.images[0] || '');
        setContentImage1(blog.images[1] || '');
        setContentImage2(blog.images[2] || '');
        setAutor(blog.autor);
        setEditingBlog(blog);
    };

    const handleImageUpload = async (fileList) => {
        const file = fileList[0];
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/image/upload`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const imageUrl = response.data.url;
        if (uploadStage === 0) {
            setHeaderImage(imageUrl);
            setUploadStage(1);
        } else if (uploadStage === 1) {
            setContentImage1(imageUrl);
            setUploadStage(2);
        } else if (uploadStage === 2) {
            setContentImage2(imageUrl);
            setUploadStage(3); // Upload completed
        }
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

    const handleViewBlog = (blog) => {
        // Lógica para ver el blog completo (por ejemplo, redirigir a una página de detalles)
    };

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
                    <label>{uploadStage === 0 ? 'Upload Header Image' : uploadStage === 1 ? 'Upload Content Image 1' : 'Upload Content Image 2'}</label>
                    <input type="file" onChange={(e) => handleImageUpload(e.target.files)} />
                </div>
                <div>
                    <label>Header Image URL:</label>
                    <input
                        type="text"
                        value={headerImage}
                        readOnly
                    />
                </div>
                <div>
                    <label>Content Image 1 URL:</label>
                    <input
                        type="text"
                        value={contentImage1}
                        readOnly
                    />
                </div>
                <div>
                    <label>Content Image 2 URL:</label>
                    <input
                        type="text"
                        value={contentImage2}
                        readOnly
                    />
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
            <div className="blog-cards-container">
                {blogs.map(blog => (
                    <BlogCard 
                        key={blog._id} 
                        blog={blog} 
                        onView={handleViewBlog} 
                        onEdit={startEditing} 
                        onDelete={handleDeleteBlog} 
                    />
                ))}
            </div>
        </div>
    );
};

export default BlogManager;
