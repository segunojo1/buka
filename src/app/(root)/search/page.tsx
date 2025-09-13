import React, { useState } from "react";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  
  return (
    <div className="min-h-screen bg-background">

      <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Amala Spots Near You
          </h1>
          <p className="text-lg opacity-90">
            Found {searchResults.length} spots in Lagos, Nigeria
          </p>
        </div>
      </div>

    </div>
  );
};

export default Search;
