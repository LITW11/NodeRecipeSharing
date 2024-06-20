import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeCard from "../components/RecipeCard.jsx";
import { useNavigate } from 'react-router-dom';

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const AddRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState(['']);
    const [steps, setSteps] = useState(['']);
    const [isPublic, setIsPublic] = useState(false);
    const [image, setImage] = useState(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState(-1);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    let imageDataUrl = '';
    if (image) {
        imageDataUrl = URL.createObjectURL(image);
    }

    useEffect(() => {
        const loadCategories = async () => {
            const { data } = await axios.get('/api/categories/getall');
            setCategories(data);
        }

        loadCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const imageBase64 = await toBase64(image);
        await axios.post('/api/recipes/add', { title, categoryId: selectedCategoryId, ingredients, steps, isPublic, imageBase64 });        
        navigate('/');
    };

    const handleIngredientChange = (index, event) => {
        const values = [...ingredients];
        values[index] = event.target.value;
        setIngredients(values);
    };

    const handleStepChange = (index, event) => {
        const values = [...steps];
        values[index] = event.target.value;
        setSteps(values);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, '']);
    };

    const addStepField = () => {
        setSteps([...steps, '']);
    };

    const handleImageUpload = (event) => {
        setImage(event.target.files[0]);
    };

    return (
        <div className="container mt-5 d-flex">
            <div className="card shadow-sm" style={{ maxWidth: '600px', width: '100%', borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                    <h2 className="mb-4 text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#343a40' }}>Add a New Recipe</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Recipe Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category" className="form-label">Category</label>
                            <select
                                className="form-select"
                                id="category"
                                value={selectedCategoryId}
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                            >
                                <option value="-1">Select a category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="ingredients" className="form-label">Ingredients</label>
                            {ingredients.map((ingredient, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    className="form-control mb-2"
                                    value={ingredient}
                                    onChange={(e) => handleIngredientChange(index, e)}
                                />
                            ))}
                            <button type="button" className="btn btn-success" onClick={addIngredientField}>Add Ingredient</button>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="steps" className="form-label">Steps</label>
                            {steps.map((step, index) => (
                                <textarea
                                    key={index}
                                    className="form-control mb-2"
                                    rows="3"
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e)}
                                ></textarea>
                            ))}
                            <button type="button" className="btn btn-info" onClick={addStepField}>Add Step</button>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                id="image"
                                onChange={handleImageUpload}
                            />
                        </div>
                        {imageDataUrl && <img src={imageDataUrl} alt="Recipe" className="img-fluid mb-3" style={{ maxHeight: '200px', borderRadius: '10px' }} />}
                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="isPublic"
                                checked={isPublic}
                                onChange={(e) => setIsPublic(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="isPublic">
                                Share this recipe publicly
                            </label>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" style={{ marginTop: '10px' }}>Add Recipe</button>
                    </form>
                </div>
            </div>

            <div className="card shadow-sm ms-4" style={{ position: 'sticky', top: '20px', maxWidth: '400px', width: '100%', height: 'fit-content', borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                <div className="card-body" style={{ padding: '20px' }}>
                    <h3 className="text-center" style={{ fontFamily: 'Arial, sans-serif', color: '#343a40' }}>Recipe Preview</h3>
                    <RecipeCard
                        title={title}
                        image={imageDataUrl}
                        category={categories.find(c => c.id == selectedCategoryId)?.name}
                        ingredients={ingredients}
                        steps={steps}
                        isPublic={isPublic}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddRecipe;
