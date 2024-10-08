// import React from 'react'
import "./home.css";
import Header from "../../components/Header/Header";
import CardEvent from "../../components/Card/CardEvent";
import Footer from "../../components/Footer/Footer";

import { deleteEvent, getEventos } from "../../service/eventAPI.ts";
import {useEffect, useState} from "react";
import ModalEvent from "../../components/ModalEvent/ModalEvent.tsx";
import ViewEvent from "../ViewEvent/ViewEvent.tsx";
import {getLoggedUser} from "../../service/userAPI.ts";
import {useNavigate} from "react-router-dom";

export default function Home() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const data = await getEventos();
                setEventos(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchLoggedUser = async () => {
            try {
                const user = await getLoggedUser();
                setLoggedUserId(user.id);
            } catch (error) {
                setError("Erro ao buscar usuário logado");
            }
        };


        fetchEventos();
        fetchLoggedUser();
    }, []);

    const handleEventClick = (event) => {
        console.log(event)
        setSelectedEvent(event);
        navigate(`/events/view/${event.id}`, { state: { eventId: event.id } });
    };

    if (loading) {
        return <p>Carregando eventos...</p>;
    }

    if (error) {
        return <p>Erro ao carregar eventos: {error}</p>;
    }

    async function handleEdit(idEvento: bigint) {
        navigate(`edit/${idEvento}`);
    }

    async function handleDelete(idEvento: bigint) {
        try {
            await deleteEvent(idEvento);
            setEventos((prevEventos) => prevEventos.filter(event => event.id !== idEvento));
        } catch (error) {
            console.error("Erro ao excluir evento:", error);
        }
    }

    return (
        <>
            <Header />
            <div id="container-page" className="container-home">
                <div className="content-styles-home">
                    <div className="container-cards-event">
                        {eventos.length > 0 ? (
                            eventos.map((event: any) => (
                                <CardEvent
                                    key={event.id}
                                    id={event.id}
                                    title={event.title}
                                    image={event.eventImage}
                                    dateTime={event.eventDate}
                                    localEvent={event.location}
                                    onClick={() => handleEventClick(event)} // Chama a função ao clicar
                                    onEdit={() => handleEdit(event.id)}
                                    onDelete={() => handleDelete(event.id)}
                                    showEditDelete={event.creatorId === loggedUserId}
                                />
                            ))
                        ) : (
                            <p>Nenhum evento disponível.</p>
                        )}
                    </div>
                    <div className="area-home">
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    );
}
