import React from 'react';
import { Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

const AdminMainPage = (props) => {

    return (
        <>
            <p>Панель управления админа</p>
            <p>
                <NavLink to='/Admin/Reviews' >
                    <Button variant='danger'>Отрецензировать отзывы</Button>
                </NavLink>
            </p>
        </>
    );
}

export default AdminMainPage;