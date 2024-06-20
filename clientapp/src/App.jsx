import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import AddRecipe from './Pages/AddRecipe';
import { AuthContextComponent } from './AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Logout from './Pages/Logout';
import CategoryList from './Pages/CategoryList';

const App = () => {
    return (
        <AuthContextComponent>
            <Layout>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/Login' element={<Login />} />
                    <Route path='/add-recipe' element={
                        <PrivateRoute>
                            <AddRecipe />
                        </PrivateRoute>
                    } />
                    <Route path='/categories' element={
                        <PrivateRoute>
                            <CategoryList />
                        </PrivateRoute>
                    } />
                    <Route path='/logout' element={<Logout />} />
                </Routes>
            </Layout>
        </AuthContextComponent>
    );
}

export default App;