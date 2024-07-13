import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function EpisodeDetails() {
    const { serie_id, season_number, episode_number } = useParams();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const language = queryParams.get('language') || 'en';
    const [episode, setEpisode]=useState({});

    const fetchEpisode = async () => {
        const url = `http://127.0.0.1:5252/api/TmdbData/episodeDetails?serie_id=${serie_id}&season_number=${season_number}&episode_number=${episode_number}&Language=${language}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setEpisode(data);
        } catch (error) {
            console.error('Error fetching episode:', error);
            setEpisode({});
        }
    }

    useEffect(() => {
        fetchEpisode();
      }, [serie_id, season_number, episode_number]);

    function getDuration(runtime) {
        if(runtime>60){
            let min = (runtime%60).toString()
            if(min.length==1) min = "0"+min;
            return (Math.floor(runtime/60)).toString()+"h"+min;
        }else{
            return episode.runtime.toString()+"min"
        }
    }

    return (
        <div>
            <img
                src={episode.still_path}
            />
            <h3>{`Season ${episode.season_number}: Episode ${episode.episode_number}`}</h3>
            <h2>{episode.name}</h2>
            <h4>Release Date: {episode.air_date}</h4>
            <p>{episode.overview}</p>
            <p>Rating: {Math.round(episode.vote_average*100)/100}</p>
            {episode.runtime&&<h4>Duration: {getDuration(episode.runtime)}</h4>}
        </div>
    );
}