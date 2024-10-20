import React from 'react';
import '../assets/css/ShowList.css';

// eslint-disable-next-line react/prop-types
const ShowList = ({ shows, selectedShow, setSelectedShow }) => {
    return (
        <div className="show-list-container">
            <table className="show-table">
                <thead>
                    <tr>
                        <th>TITULO</th>
                        <th>FECHA Y HORA</th>
                        <th>LUGARES DISPONIBLES</th>
                    </tr>
                </thead>
                <tbody>
                    {shows.map((show, index) => (
                        <tr
                            key={index}
                            className={selectedShow === show ? 'selected-row' : ''}
                            onClick={() => setSelectedShow(show)}
                        >
                            <td>{show.title}</td>
                            <td>{`${show.date} ${show.time}`}</td>
                            <td>{show.availableSeats}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowList;

