import { useState, useEffect } from "react";
import { MobileNav } from "./MobileNav";
import { MainNav } from "./MainNav";
import { useLocation } from "react-router-dom";

export const Header = ({ onStartTour }: { onStartTour?: () => void }) => {
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();

    // Function to check the screen width and update the state
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);  // assuming <= 768px is mobile
    };

    // Check screen size on initial load and when resized
    useEffect(() => {
        handleResize(); // Check on initial load
        window.addEventListener("resize", handleResize); // Listen for window resize

        // Cleanup listener when component unmounts
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Listen for tour events from IndexPage
    useEffect(() => {
        const handleStartTour = () => {
            if (onStartTour) {
                onStartTour();
            } else {
                // Dispatch event that IndexPage can listen to
                window.dispatchEvent(new CustomEvent('startTour'));
            }
        };

        window.addEventListener('requestTour', handleStartTour);
        return () => window.removeEventListener('requestTour', handleStartTour);
    }, [onStartTour]);

    const handleTourClick = () => {
        if (location.pathname === '/') {
            // Dispatch event for IndexPage to listen to
            window.dispatchEvent(new CustomEvent('startTour'));
        }
    };

    return (
        <div className="pt-6">
            <div className="container flex flex-wrap justify-between items-center">
                {isMobile ? <MobileNav /> : <MainNav onStartTour={handleTourClick} />}
            </div>
        </div>
    );
};
