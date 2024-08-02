import {useEffect, useState} from 'react';
import '../assets/css/components/Reviews.css';
export default function Reviews({ mediatype, id, language }) {
    const [reviews, setReviews] = useState([]);
    const fetchReviews= async () => {
        try {
            let url = new URL(`http://127.0.0.1:8080/api/TmdbData/reviews?MediaType=${mediatype}&id=${id}&Language=${language}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setReviews(data);
        } catch {
            console.error('Error fetching reviews');
            setReviews([]);
        }
    }
    useEffect(() => {
        fetchReviews();
    },[mediatype, id, language]);

    if (reviews.length === 0) {
        return null;
    }

    return (
        <div className="section" id="reviews">
            <div className="content">
                <h2>Reviews</h2>
                <div className="intro">
                    {reviews.map((review, index) => {
                        const options = { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric', 
                            hour: 'numeric', 
                            minute: 'numeric'
                        };
                        const createdDateString = new Date(review.created_at).toLocaleString('en-US', options);
                        const updatedDateString = review.updated_at ? new Date(review.updated_at).toLocaleString('en-US', options) : null;
                        return (
                            <div key={index} className="review">
                                <h4>{review.author}</h4>
                                <p>Posted: {createdDateString}</p>
                                {
                                    updatedDateString && updatedDateString !== createdDateString ? (
                                        <p>Updated: {updatedDateString}</p>
                                    ) : null
                                }
                                {review.author_details.rating &&(
                                    <p>Rating : {review.author_details.rating/2} /5</p>
                                )}
                                <p>{review.content}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}