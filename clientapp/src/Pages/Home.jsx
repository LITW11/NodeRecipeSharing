import React, { useState, useEffect } from 'react';
import RecipeCard from "../components/RecipeCard.jsx";
import axios from 'axios';

const Home = () => {

    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const loadRecipes = async () => {
            const { data } = await axios.get('/api/recipes/getallpublic');
            setRecipes(data);
        }
        loadRecipes();
    }, []);

    return (
        <div className="container mt-5" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '10px' }}>
            <div className="jumbotron bg-light p-5 rounded-lg mb-4 shadow">
                <h1 className="display-4">Welcome to Recipe Sharing App!</h1>
                <p className="lead">Explore the most delicious recipes shared by our community. Share your own recipes and get inspired by others!</p>
                <hr className="my-4" />
                <p>Here are some of the latest recipes:</p>
            </div>

            <div className="row">
                {recipes.slice(0, 9).map((recipe, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <RecipeCard
                            title={recipe.title}
                            image={`/api/recipes/image/${recipe.imageName}`}
                            category={recipe.categoryName}
                            ingredients={recipe.ingredients}
                            steps={recipe.steps}
                            isPublic={recipe.isPublic}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
