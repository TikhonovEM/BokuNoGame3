import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Modal, Form } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import userinfoService from '../services/userinfo.service';
import api from '../services/api';
import UserLibrary from './userlibrary';

const Profile = (props) => {

    let params = useParams();

    let [pageState, setPageState] = useState({
        data: {},
        isFetching: true
    });
    let [nickname, setNickname] = useState(null);
    let [fullName, setFullName] = useState(null);
    let [email, setEmail] = useState(null);
    let [birthDate, setBirthDate] = useState(null);
    let [gameSummariesToRender, setGameSummariesToRender] = useState([]);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const userInfo = userinfoService.getInfo();

    
    useEffect(() => {
        const opts = {
            url: "/api/Profile/" + params.username,
            method: 'GET'
        };
        api.bng_accounts_fetch(opts)
            .then(result => setPageState({
                data: result.data,
                isFetching: false
            }));
    }, []);

    useEffect(() => {
        if (pageState.data.gameSummaries) {
            filterGameSummaries(2);
        }
    }, [pageState])

    const exportLibraries = (event) => {
        alert("Coming Soon...");
    }

    const importLibraries = (event) => {
        alert("Coming Soon...");
    }

    const loadPhoto = (event) => {
        var formData = new FormData();
        var photo = document.getElementById("profile-photo-file").files[0];
        formData.append("file", photo);
        fetch("/api/Account/LoadPhoto", {
            method: "POST",
            body: formData
        }).then(response => {
            if (response.status == 200) {
                response.json().then(res => {
                    this.setState({
                        data: res
                    })
                });
            }
        });
    }

    const submitHandler = (event) => {
        event.preventDefault();
        console.log()
        api.bng_accounts_fetch({
            url: "/api/Profile/Edit",
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + userInfo.jwtToken,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "nickname": nickname,
                "fullName": fullName,
                "email": email,
                "birthDate": birthDate === "" ? null : birthDate
            })
        })
        .then(res => {
            if (res.status == 200) {
                alert("Профиль обновлен!");
                handleClose();
                setPageState({
                    data: res.data,
                    isFetching: false
                });
            }
        });
    }

    const filterGameSummaries = (catalogId) => {
        setGameSummariesToRender(pageState.data.gameSummaries.filter(gs => gs.catalogId == catalogId));
    }
    
    if (pageState.isFetching)
        return <div>...Loading</div>;
    return (
            <div className="container emp-profile">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-img">
                            {
                                (userInfo != null && userInfo.username === params.username)
                                    ? <form id="profile-photo" encType="multipart/form-data" method="post">
                                        <div className="file">
                                            <label>
                                                <input type="file" id="profile-photo-file" name="file" accept="image/*" style={{ display: "none" }} onChange={loadPhoto} />
                                                <img src={"data:image;base64," + pageState.data.user.photo} alt="" style={{ maxWidth: "300px", maxHeight: "400px" }} />
                                            </label>
                                        </div>
                                    </form>
                                    : <img src={"data:image;base64," + pageState.data.user.photo} alt="" style={{ maxWidth: "300px", maxHeight: "400px" }} />
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="profile-head">
                            <h5>
                                {pageState.data.user.nickname}
                            </h5>
                            <h6>
                                Профиль
                            </h6>
                            <Tabs>
                                <TabList>
                                    <Tab style={{minWidth: "50%"}}>Основная информация</Tab>
                                    <Tab style={{minWidth: "50%"}}>Дополнительно</Tab>
                                </TabList>

                                <TabPanel>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>User Id</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{pageState.data.user.userName}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Полное имя</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{pageState.data.user.fullName} </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{pageState.data.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Дата рождения</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{new Date(pageState.data.user.birthDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                                <TabPanel>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>С нами с </label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{new Date(pageState.data.user.registrationDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Игр в библиотеке</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{pageState.data.gameSummaries.length}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Оставлено отзывов</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>230</p>
                                            </div>
                                        </div>
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                    </div>
                    {(userInfo != null && userInfo.username === params.username) &&
                        <div className="col-md-2">
                            <Button className="btn btn-info w-100" onClick={handleShow}>
                                Изменить профиль
                            </Button>
                            <Button className="btn btn-info" onClick={exportLibraries}>
                                Экспортировать библиотеку
                            </Button>
                            <form className="form-inline" method="post" encType="multipart/form-data" id="import-lib">
                                <div className="import">
                                    <label>
                                        <input className="btn btn-info" type="file" id="jsonfile" name="jsonfile" style={{ display: "none" }} onChange={importLibraries} />
                                        <span className="btn btn-info">Импортировать библиотеку</span>
                                    </label>
                                </div>
                            </form>
                            <Modal
                                show={show}
                                onHide={handleClose}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Данные профиля</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="row">
                                        <Form.Label className="col-sm-4 col-form-label">Никнейм</Form.Label>
                                        <Form.Control type="text" size="35" onInput={e => setNickname(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <Form.Label className="col-sm-4 col-form-label">Полное имя</Form.Label>
                                        <Form.Control type="text" size="35" onInput={e => setFullName(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <Form.Label className="col-sm-4 col-form-label">Email</Form.Label>
                                        <Form.Control type="email" size="35" onInput={e => setEmail(e.target.value)}></Form.Control>
                                    </Form.Group>
                                    <Form.Group className="row">
                                        <Form.Label className="col-sm-4 col-form-label">Дата рождения</Form.Label>
                                        <Form.Control type="date" size="35" onInput={e => setBirthDate(e.target.value)}></Form.Control>
                                    </Form.Group>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant='secondary' onClick={handleClose}>Закрыть</Button>
                                    <Button variant='primary' onClick={submitHandler}>Обновить</Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    }
                </div>

                <br />
                <Tabs defaultIndex={1} onSelect={(index, lastIndex, event) => filterGameSummaries(index + 1)}>
                    <TabList>
                        {pageState.data.catalogs.map(function (value, index, array) {
                            return (<Tab style={{minWidth: `${100 / array.length}%`}} key={value.id}>{value.name}</Tab>);
                        })
                        }
                    </TabList>

                    {pageState.data.catalogs.map(function (value, index, array) {
                            return (
                                <TabPanel key={value.id}></TabPanel>
                            );
                        })
                    }

                </Tabs>
                <UserLibrary gameSummaries={gameSummariesToRender} />
            </div>
        );
}
export default Profile;