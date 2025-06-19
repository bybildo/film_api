import { useState, useEffect, useRef } from "react";
import './Film.css';
import ColorThief from 'colorthief';

function Film({ film }) {
    const [color, setColor] = useState(null);
    const [textColor, setTextColor] = useState('black');
    const path = film.poster_path ? `https://image.tmdb.org/t/p/w200${film.poster_path}` : null;
    const imgRef = useRef(null);

    const getTextColor = (rgb) => {
        if (!rgb) return 'black';
        const [r, g, b] = rgb;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? 'black' : 'white';
    };

    useEffect(() => {
        const imgElement = imgRef.current;
        if (!imgElement) return;

        function extractColor() {
            try {
                const colorThief = new ColorThief();
                const dominantColor = colorThief.getColor(imgElement);
                setColor(dominantColor);
                setTextColor(getTextColor(dominantColor)); 
            } catch (err) {
                console.error("Error extracting color:", err);
            }
        }

        if (imgElement.complete) {
            extractColor();
        } else {
            imgElement.addEventListener('load', extractColor);
            return () => imgElement.removeEventListener('load', extractColor);
        }
    }, [path]);

    return (
        <div className="filmArea">
            <div style={{ color: textColor }}>
                <h2>{film.title}</h2>
                <p>{film.overview}</p>
                <p>Рейтинг: {(film.vote_average).toFixed(2)}</p>
            </div>
            <div>
                {path ? (
                    <img
                        src={path}
                        ref={imgRef}
                        crossOrigin="anonymous"
                    />
                ) : (
                    <p>No poster available</p>
                )}
            </div>
            <img className="imageBackground" src={path} />
            <div className="background" style={{ backgroundColor: color ? `rgb(${color.join(",")})` : "transparent" }} />
        </div>
    );
}

export default Film;
