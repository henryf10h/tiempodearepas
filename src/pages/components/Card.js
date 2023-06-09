const Card = ({ name, description, imageUrl }) => {
     return (
       <div className="w-full md:w-1/2 lg:w-1/2 mx-auto bg-slate-600 rounded-xl shadow-md overflow-hidden mt-8 mb-8">
         <div className="flex flex-col items-center p-4">
           <div className="w-75 h-90 bg-neutral-400 flex items-center justify-center mb-4">
             <img className="max-w-full max-h-full object-contain m-6" src={imageUrl} alt="NFT Image" />
           </div>
 
           <div className="text-center bg-transparent p-2 mb-4">
             <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{name || "Enter name"}</div>
           </div>
           <div className="text-center bg-transparent p-2 mb-4">
             <p className="mt-2 text-gray-500">{description || "Enter description"}</p>
           </div>
           <a href="#" className="btn btn-primary mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out">
             Go somewhere
           </a>
         </div>
       </div>
     );
   };

   export default Card;