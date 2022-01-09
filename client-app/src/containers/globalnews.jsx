import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import api from '../services/api';

const GlobalNews = (props) => {
    const [globalNews, setGlobalNews] = useState(
        {
            data: {},
            isFetching: true
        });
    const [title, setTitle] = useState();
    const [text, setText] = useState();
    const [reference, setReference] = useState();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getNews = () => {
        api.bng_games_fetch({
            url: "/api/News/Query?$filter=isLocal eq false",
            method: "GET"
        })
        .then(res => setGlobalNews({
                data: res.data,
                isFetching: false
        }));
    };

    useEffect(() => getNews(), []);

    const submitHandler = (event, isLocal) => {
        event.preventDefault();

        handleClose();

        var opts = {
            url: "/api/News",
            method: "POST",
            data: {
                title: title,
                text: text,
                reference: reference,
                isLocal: isLocal
            }
        }
        api.bng_games_fetch(opts)
        .then(res => {
            if (res.status == 200) {
                getNews();
            }
        })
    }

    if (globalNews.isFetching)
        return <div>...Loading</div>;
    return (
        <section>
            <div className="row">
                <div className="col-md-9 text-center bg-danger">
                    <h3>Новости игрового мира</h3>
                </div>
                <Button variant='danger' className="rounded-0 col-md-3" onClick={handleShow}>
                    Предложить новость
                </Button>

                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Новая новость</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="row">
                            <Form.Label className="col-sm-2 col-form-label">Заголовок</Form.Label>
                            <Form.Control type="text" size="35" onInput={e => setTitle(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-sm-2 col-form-label">Текст</Form.Label>
                            <Form.Control as="textarea" rows={5} cols={60} onInput={e => setText(e.target.value)}></Form.Control>
                        </Form.Group>
                        <Form.Group className="row">
                            <Form.Label className="col-sm-2 col-form-label">Ссылка</Form.Label>
                            <Form.Control type="text" size="35" onInput={e => setReference(e.target.value)}></Form.Control>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Закрыть</Button>
                    <Button variant='primary' onClick={e => submitHandler(e, false)}>Опубликовать</Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <ul className="list-group">
                {globalNews.data.map(function (value, index, array) {
                    return (
                        <li className="list-group-item" key={index}>
                            <article className="card">
                                {
                                    !value.reference ?
                                        <div>
                                            <h4 className="card-header text-center">
                                                {value.title}
                                            </h4>
                                            <div className="card-body">
                                                <p className="card-text">{value.text}</p>
                                            </div>
                                            {value.authorId &&
                                                <div className="card-footer text-muted">
                                                    {"От " + value.authorId}
                                                </div>
                                            }
                                        </div>
                                        : <div>
                                            <h4 className="card-header">
                                                <a href={value.reference}>
                                                    {value.title}
                                                </a>
                                            </h4>
                                        </div>
                                }
                            </article>
                        </li>
                    );
                })
                }
            </ul>
        </section>
    )
}

export default GlobalNews;