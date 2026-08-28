import React from 'react'

export default function ButtonLink({className , judul}: {className?:string; judul:string}) {
  return (
    <a className={`px-4 py-6 w-full mx-auto block font-bold ${className ? className: 'bg-lime-300 text-black'}`}>{judul}</a>
  )
}
