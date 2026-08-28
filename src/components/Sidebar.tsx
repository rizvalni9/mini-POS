import React from "react";
import ButtonLink from "./ui/ButtonLink";

export default function Sidebar() {
  return (
    <aside className="max-w-52 border border-gray-500 bg-white h-screen p-0">
      <div className="w-full">
        <h1 className="text-black bg-blue-600 p-2 text-center font-semibold">MiniPOS</h1>
      </div>
      <div className="w-full">
        <ButtonLink className='hover:bg-lime-200 poin not-hover:bg-lime-300 text-black cursor-pointer' judul='Header'/>
        <ButtonLink className='hover:bg-lime-900 not-hover:bg-black  text-white cursor-pointer' judul='Side Bar'/>
      </div>
    </aside>
  );
}
