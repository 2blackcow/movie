 const ErrorMessage = ({ message }) => {
    return (
      <div className="flex items-center justify-center h-48 text-red-500">
        <p>{message || '데이터를 불러오는데 실패했습니다.'}</p>
      </div>
    );
  };
  
  export default ErrorMessage;