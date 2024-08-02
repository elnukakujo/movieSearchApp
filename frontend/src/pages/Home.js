import DragPosters from '../components/DragPosters';
import '../assets/css/pages/home.css'
export default function Home() {
    return (
        <div className='section' id="home">
            <div className='content'>
                <DragPosters
                url="http://127.0.0.1:8080/api/TmdbData/upcoming"
                title="Upcoming Movies"
                queryParams='Language=en&region=US'
                />
                <DragPosters
                url="http://127.0.0.1:8080/api/TmdbData/trending"
                title="Trending Now"
                queryParams='Language=en'
                toggleButton={['Day', 'Week']}
                />
                <DragPosters
                url="http://127.0.0.1:8080/api/TmdbData/top_rated"
                title="Top Rated"
                queryParams='Language=en'
                toggleButton={['Movie', 'TV']}
                />
            </div>
        </div>
    );
}