"use client";

import SearchAmalaForm from "../search-amala-form";

const SearchAmala = () => {
  return (
    <section className="p-10 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Start Your Amala Journey
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search by location, chat with our AI, or explore featured spots
        </p>
      </div>

      <SearchAmalaForm />
    </section>
  );
};

export default SearchAmala;
