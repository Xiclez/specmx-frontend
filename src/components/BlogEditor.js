import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useParams, useNavigate } from 'react-router-dom';
import './BlogEditor.css'; // Estilos específicos para el editor de blogs

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [contentImage1, setContentImage1] = useState('');
    const [contentImage2, setContentImage2] = useState('');
    const [autor, setAutor] = useState('');
    const [uploadStage, setUploadStage] = useState(0);

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/posts/${id}`);
                const blog = response.data;
                setTitle(blog.title);
                setContent(blog.content);
                setHeaderImage(blog.images[0] || '');
                setContentImage1(blog.images[1] || '');
                setContentImage2(blog.images[2] || '');
                setAutor(blog.autor);
            };
            fetchBlog();
        }
    }, [id]);

    const handleSaveBlog = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const images = [headerImage, contentImage1, contentImage2];

        try {
            if (id) {
                await axios.put(`${process.env.REACT_APP_API_URL}/api/blog/posts/${id}`, { title, content, images, autor }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            } else {
                await axios.post(`${process.env.REACT_APP_API_URL}/api/blog/createPost`, { title, content, images, autor }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
            }
            navigate('/blog');
        } catch (err) {
            console.error(err);
        }
    };

    const handleImageUpload = async (fileList) => {
        const file = fileList[0];
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/helper/uploadFile`, formData, {
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

    return (
        <div className="blog-editor-container">
            <h2>{id ? 'Edit Blog' : 'Create Blog'}</h2>
            <form onSubmit={handleSaveBlog}>
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
                <button type="submit">{id ? 'Update Blog' : 'Create Blog'}</button>
            </form>
        </div>
    );
};

export default BlogEditor;
