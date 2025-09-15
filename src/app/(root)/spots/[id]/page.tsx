import Maps from "@/components/maps";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const SpotId = () => {
  return (
    <main className="flex-1">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <MainCard />
          </div>
          <SpotLocation />
          <ReviewForm />
          <AllReviews />
        </div>
      </div>
    </main>
  );
};

export default SpotId;

export const MainCard = () => {
  return (
    <div>
      <Card>
        <div className="h-64 w-full bg-[#000] bg-cover bg-center"></div>
        <div className="p-6 space-y-4">
          <h2 className="font-ojuju text-4xl font-bold text-stone-800">
            Mama's Kitchen
          </h2>
          <p className="text-stone-600">Cozy spot</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-500">
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star</span>
                <span className="material-symbols-outlined">star_half</span>
              </div>
              <p className="text-stone-600 font-medium">
                4.5{" "}
                <span className="text-sm text-stone-500">(258 reviews)</span>
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
              <p className="text-sm font-medium text-green-700">Quiet</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const SpotLocation = () => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-white p-6 space-y-4">
      <h3 className="font-ojuju text-2xl font-bold text-stone-800">Location</h3>
      <div className="h-64 rounded-lg overflow-hidden relative">
        <Maps />
        <div className="absolute inset-0 bg-black/10 "></div>
      </div>
      <Button className="w-full flex items-center justify-center gap-x-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors">
        <span className="material-symbols-outlined text-base">near_me</span>
        <span>Open in Google Maps</span>
      </Button>
    </div>
  );
};

export const ReviewForm = () => {
  return (
    <div className="rounded-xl shadow-lg bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-ojuju text-2xl font-bold text-stone-800">
          Your Review
        </h3>
        <Button className="text-sm font-medium text-red-600 hover:text-red-800 flex items-center gap-1">
          <span className="material-symbols-outlined !text-base">delete</span>
          Delete
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-1 text-amber-500">
          {[0, 1, 2, 3, 4, 5].map((star) => (
            <Button>
              <span className="material-symbols-outlined !text-3xl">star</span>
            </Button>
          ))}
        </div>
        <Textarea className="form-textarea w-full rounded-lg border-stone-200 bg-stone-50 p-3 text-stone-900 placeholder-stone-500 focus:border-amber-500 focus:ring-amber-500"></Textarea>
        <Button className="w-full flex items-center justify-center gap-x-2 rounded-lg bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-700 transition-colors">
          <span>Submit Review</span>
        </Button>
      </div>
    </div>
  );
};

export const AllReviews = () => {
  return (
    <div className="rounded-xl shadow-lg bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-ojuju text-2xl font-bold text-stone-800">
          Reviews
        </h3>
        <Button className="text-sm font-medium text-amber-600 hover:text-amber-800">
          View All
        </Button>
      </div>
      <div className="space-y-6">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </div>
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2">
          <Button className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 disabled:opacity-50">
            <span className="material-symbols-outlined">chevron_left</span>
          </Button>
          {[1, 2, 3].map((star) => (
            <Button className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white text-sm font-bold">
              {star}
            </Button>
          ))}
          <Button className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100">
            <span className="material-symbols-outlined">chevron_right</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const ReviewCard = () => {
  return (
    <div>
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-black bg-cover bg-center flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-stone-800">Segun Ojo</h4>
            <div className="flex text-amber-500">
              {[0, 1, 2, 3, 4, 5].map((star) => (
                <span className="material-symbols-outlined !text-base">
                  star
                </span>
              ))}
            </div>
          </div>
          <p>2 days ago</p>
          <p className="mt-2 text-stone-700">
            The best jollof rice in town! The atmosphere is so welcoming and the
            staff are incredibly friendly. A must-visit.
          </p>
        </div>
      </div>
    </div>
  );
};
