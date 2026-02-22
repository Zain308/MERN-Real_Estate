import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules'; // SwiperCore.use is no longer needed
import 'swiper/css/bundle';

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return; // Stops the function execution here if there's an error
                }
                
                setListing(data);
                setLoading(false);
                setError(false);
                
            } catch (error) {
                setError(true);    
                setLoading(false);
            }
        };
        fetchListing(); 

    }, [params.listingId]);

  return (
    <main>
        {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
        {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}
        {listing && !loading && !error &&
            <>
                <Swiper navigation modules={[Navigation]}> {/* Added modules prop here */}
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div 
                                className="h-[550px]" 
                                style={{ background: `url(${url}) center no-repeat`, backgroundSize: 'cover' }}
                            ></div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </>
        }
    </main>
  );
}