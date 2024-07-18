import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DragPosters from "../components/DragPosters";
import '../assets/css/pages/Person.css';

export default function Person() {
    const {id} = useParams();
    const [person, setPerson] = useState({});
    const fetchInfos = async () => {
        let url = new URL(`http://127.0.0.1:5252/api/TmdbData/person?id=${id}&Language=en`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPerson(data);
    }
    useEffect(() => {
        fetchInfos();
    },[id]);
    return (
        <div className="section" id="biography">
            <div className="content">
                <div className="intro">
                    <div className="description">
                        <h2>{person.name}</h2>
                        {person.also_known_as && person.also_known_as.length>0 ? (
                        <>
                            <h4>Also known as:</h4>
                            <div className='style-button-container'>
                                {person.also_known_as.map((name, index) => (
                                <button key={index} className='style-button'>{name}</button>
                                ))}
                            </div>
                        </>
                        ):null}
                        <h4>Born in {person.place_of_birth} the {person.birthday}</h4>
                        {person.deathday && <h4>Died the {person.deathday}</h4>}
                        <p>Best known for his {person.known_for_department && person.known_for_department.toLowerCase()}</p>
                        <p>{person.biography}</p>
                        {person.popularity && person.popularity!==0 && <p>Popularity: {Math.round(person.popularity*10)/10}</p>}
                    </div>
                    <a href={person.homepage} className="profile-container" target="_blank">
                        <img src={person.profile_path} alt={person.name} draggable="false"/>
                    </a>
                </div>
                {person.movie_cast && 
                    <DragPosters
                        title="In those Movies"
                        posters={person.movie_cast}
                    />
                }
                {person.tv_cast && 
                    <DragPosters
                        title="In those Series"
                        posters={person.tv_cast}
                    />
                }
            </div>
        </div>
    );
}