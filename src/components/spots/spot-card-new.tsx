import { Utensils } from "lucide-react";
import React from "react";

const SpotCardNew = () => {
  return (
    <div className="max-w-[500px]">
      <div className="group flex cursor-pointer gap-4 rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-all hover:shadow-lg hover:border-amber-500">
        {/* <div
          class="h-24 w-24 flex-shrink-0 rounded-lg bg-cover bg-center"
          style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDtogQN5KmSC24VQxD6WNqhP_c287Bx7Biw9ybiNWY03_ybi4_m9sg90nRg2XL4ZO2yK8CuiwbAyQFj1I-wHkWCng1MlBi-rkg64rdc-G9MRZCkWu_EYCz_Fg1GzQkPdbTTcz1UpNNETXitY9MUcg8awAyZNRI2EHbR0ZPOpreUroZhtGHvKDIJDYVqiAQUkB_k9CkAk1nnXOGjHGGdVo_zTVc7ovEj_v_LRvNyzjiAgruVXL5nHwbvZXOvKv6y-AtXhyN-MQhY4mKp')"
        ></div> */}
              <Utensils className="text-primary/40 h-20 w-20 flex-shrink-0 rounded-lg bg-cover bg-center" />

        <div className="flex-1">
          <h3 className="font-bold text-stone-800">Mama's Kitchen</h3>
          <div className="flex items-center gap-1 text-sm text-stone-500">
            <span>4.5</span>
            <div className="flex text-amber-500">
              <span className="material-symbols-outlined !text-base">star</span>
              <span className="material-symbols-outlined !text-base">star</span>
              <span className="material-symbols-outlined !text-base">star</span>
              <span className="material-symbols-outlined !text-base">star</span>
              <span className="material-symbols-outlined !text-base">
                star_half
              </span>
            </div>
            <span className="text-xs">(123)</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium text-green-700">Quiet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotCardNew;
