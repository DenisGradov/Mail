import { useLoaderStore } from '../../Store/Loader.js';

function Loader() {
  const { isLoading } = useLoaderStore();

  return (
    <div
      className={`
        fixed top-0 left-0 w-full h-full flex items-center justify-center z-50
        bg-black bg-opacity-60 transition-opacity duration-300
        ${isLoading ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="loader"></div>
      <style>{`
        .loader {
          border: 8px solid #f3f3f3;
          border-top: 8px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Loader;
