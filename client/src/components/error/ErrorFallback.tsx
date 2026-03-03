interface Props {
  error?: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<Props> = ({ error, resetError }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong 😢
        </h2>

        <p className="text-gray-600 mb-6">
          {error?.message || "An unexpected error occurred."}
        </p>

        <button
          onClick={resetError}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorFallback;