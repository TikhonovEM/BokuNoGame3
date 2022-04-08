import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import api from '../../services/api';
import userinfoService from '../../services/userinfo.service';

const UserLibraryInfo = (props) => {
    let [userLibraryInfo, setUserLibraryInfo] = useState({
        data: [],
        isFetching: true
    });
    let [catalogs, setCatalogs] = useState({
        data: [],
        isFetching: true
    });
    let [catalogId, setCatalogId] = useState(1);

    const userInfo = userinfoService.getInfo();

    useEffect(() => {
        if (userInfo) {
            api.bng_games_fetch({
                url: `/api/GameSummary/Query?$filter=gameId eq ${props.game.id} and UserId eq '${userInfo.id}'&$expand=Catalog`,
                method: 'GET'
            })
            .then(res => setUserLibraryInfo({
                data: res.data,
                isFetching: false
            }))

            api.bng_games_fetch({
                url: `/api/Catalog/Query`,
                method: 'GET'
            })
            .then(res => setCatalogs({
                data: res.data,
                isFetching: false
            }))
        }
    }, []);

    const submitHandler = (update) => {
        const url = update ? `/api/GameSummary/${userLibraryInfo.data[0].Id}` : '/api/GameSummary';
        const method = update ? "PUT" : "POST"        

        api.bng_games_fetch({
            url,
            method,
            data: {
                GameName: props.game.name,
                Rate: 0,
                Genre: props.game.genre,
                GameId: props.game.id,
                UserId: userInfo.id,
                CatalogId: catalogId
            }
        })
        .then(res => {
            if (res.status == 200)
                alert("done!");
        })
    }


    if (userLibraryInfo.isFetching || catalogs.isFetching)
        return <div>...Loading</div>;
    
    return (
        <div>
            {userLibraryInfo.data.length > 0 && userLibraryInfo.data[0].Catalog 
            ? <Form.Group className="form-inline text-center" method="post">
                <select className="form-control-sm mx-auto" defaultValue={userLibraryInfo.data[0].Catalog.Id} onChange={e => setCatalogId(e.target.value)}>
                    {
                        catalogs.data.map(function(value, index, array) {
                            return (<option value={value.id} key={index}>{value.name}</option>);
                        })
                    }
                </select>
                <Button variant='success' className="mx-auto" type="submit" onClick={e => submitHandler(true)}>Обновить</Button>
            </Form.Group>
            : <Form.Group className="form-inline text-center" method="post">
                <select className="form-control-sm mx-auto" onChange={e => setCatalogId(e.target.value)}>
                    {
                        catalogs.data.map(function(value, index, array) {
                            return (<option value={value.id} key={index}>{value.name}</option>);
                        })
                    }
                </select>
                <Button variant='success' className="mx-auto" type="submit"  onClick={e => submitHandler(false)}>Добавить в список</Button>
            </Form.Group>
            }
        </div>
    );
}

export default UserLibraryInfo;