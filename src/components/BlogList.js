import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from './BlogCard';
import { useNavigate } from 'react-router-dom';
import './BlogList.css'; // Estilos específicos para el listado de blogs

const BlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const fetchBlogs = async () => {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/blog/posts`);
        setBlogs(response.data);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleViewBlog = (blog) => {
        // Lógica para ver el blog completo (por ejemplo, redirigir a una página de detalles)
    };

    const handleEditBlog = (blog) => {
        navigate(`/editor/${blog._id}`);
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

    return (
        <div className="blog-list-container">
            <h2>Blog List</h2>
            <button onClick={() => navigate('/editor')}>Create New Blog</button>
            <div className="blog-cards-container">
                {blogs.map(blog => (
                    <BlogCard 
                        key={blog._id} 
                        blog={blog} 
                        onView={handleViewBlog} 
                        onEdit={handleEditBlog} 
                        onDelete={handleDeleteBlog} 
                    />
                ))}
            </div>
        </div>
    );
};

export default BlogList;
