import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await axios.get('/api/categories/getall');
            setCategories(data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await axios.post('/api/categories/add', { name: newCategory }); 
            await fetchCategories();
            setNewCategory('');
        } catch (err) {
            setError(err);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4 text-center">Categories</h2>
            <form onSubmit={handleAddCategory} className="mb-4">
                <div className="input-group">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Add new category"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Add</button>
                </div>
            </form>
            {loading ? (
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="alert alert-danger" role="alert">
                    Error loading categories: {error.message}
                </div>
            ) : (
                <ul className="list-group shadow-sm">
                    {categories.map((category) => (
                        <li key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
                            {category.name}
                            <span className="badge bg-primary rounded-pill">{category.recipeCount}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CategoryList;
