import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ZI8-MJ1auAuVH9-dEyFjeaUsW-LyM_ztdg&s';

  return (
    <div className=''>
        <Link to={`/listing/${listing._id}`}>
            <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                    // Added optional chaining (?.) to prevent crashes
                    src={listing.imageUrls?.[0] || defaultImage}
                    alt="Listing"
                    // Added onError to handle broken links
                    onError={(e) => { e.target.src = defaultImage }}
                    className="w-full h-[320px] sm:h-[220px] object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4 flex flex-col gap-1">
                    <h2 className="truncate w-full sm:w-[330px] text-xl font-semibold text-gray-800">{listing.name}</h2>
                    <div className="flex items-center gap-1 mt-2">
                        <MdLocationOn className="inline text-gray-500" />
                        <p className="inline text-gray-500 w-full truncate">{listing.address}</p>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                   <p className="text-lg font-bold mt-2">
                       ${listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')} 
                       {listing.type === 'rent' ? ' / month' : ''}
                    </p>
                    <div className="text-slate-700 flex items-center gap-4 mt-2">
                        <div className="font-bold text-xs">
                            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
                        </div>
                        <div className="font-bold text-xs">
                            {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    </div>
  )
}