import React from 'react';
import './BlogCard.css'; 

const BlogCard = ({ blog, onView, onEdit, onDelete }) => {
    return (
        <div className="blog-card">
            <img src={blog.images[0]} alt={blog.title} className="blog-card-image" />
            <div className="blog-card-content">
                <h3>{blog.title}</h3>
                <p>{blog.content.substring(0, 100)}...</p>
                <p><strong>Author:</strong> {blog.autor}</p>
                <div className="blog-card-actions">
                    <button onClick={() => onView(blog)}>View</button>
                    <button onClick={() => onEdit(blog)}>Edit</button>
                    <button onClick={() => onDelete(blog._id)}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default BlogCard;
