import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import ListingItem from '../components/ListingItem';

export const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error("Error fetching offer listings:", error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error("Error fetching rent listings:", error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching sale listings:", error);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Top Banner */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-7xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find Your Next <span>Perfect</span>
          <br />
          Place With Ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm mt-2">
          ZAIN's Estate is the best to find your next perfect place to live.
          <br />
          We have a wide range of properties for sale and rent...
        </div>
        <Link className='text-xs sm:text-sm text-blue-800 font-bold hover:underline' to="/search">
          Lets get started...
        </Link>
      </div>

      {/* Swiper - Rendered only if offers exist */}
      {offerListings && offerListings.length > 0 && (
        <Swiper navigation={true} modules={[Navigation]}>
          {offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover"
                }}
                className="h-[500px]"
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Listing Results */}
      <div className="max-w-7xl mx-auto p-3 flex flex-col gap-8 my-10">
        
        {/* Offers */}
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
              <Link to="/search?offer=true" className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
                Show more offers
              </Link>
            </div>
            {/* FIX: Changed from 'flex' to 'grid' for perfect columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Rent */}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
              <Link to="/search?type=rent" className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
                Show more places for rent
              </Link>
            </div>
            {/* FIX: Consistent grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}

        {/* Sale */}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
              <Link to="/search?type=sale" className='text-xs sm:text-sm text-blue-800 font-bold hover:underline'>
                Show more places for sale
              </Link>
            </div>
            {/* FIX: Consistent grid layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};