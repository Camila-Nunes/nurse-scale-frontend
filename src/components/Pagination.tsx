import { FC } from 'react';
import { BsChevronDoubleLeft, BsChevronDoubleRight } from 'react-icons/bs';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (pagina: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  onPageChange,
}) => {
  const maxPagesToShow = 3;

  const renderPages = () => {
    const pages = [];
    pages.push(
      <button
        key={1}
        type="button"
        className={`mx-1 p-2 rounded text-sm ${currentPage === 1 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );

    if (currentPage - maxPagesToShow > 2) {
      pages.push(<span key="ellipsis1">...</span>);
    }

    for (let i = Math.max(2, currentPage - maxPagesToShow); i <= Math.min(totalPages - 1, currentPage + maxPagesToShow); i++) {
      pages.push(
        <button
          key={i}
          type="button"
          className={`mx-1 p-2 rounded text-sm ${currentPage === i ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (currentPage + maxPagesToShow < totalPages - 1) {
      pages.push(<span key="ellipsis2">...</span>);
    }

    pages.push(
      <button
        key={totalPages}
        type="button"
        className={`mx-1 p-2 rounded text-sm ${currentPage === totalPages ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    );

    return pages;
  };

  if (totalPages === 1) {
    return null; // Retorna null se houver apenas uma página
  }

  return (
    <div className="flex justify-end mt-4 mb-4">
      <button
        type="button"
        className="bg-teal-600 rounded hover:bg-teal-900 text-white text-sm py-2 px-4 mr-2"
        onClick={(e) => {
          e.preventDefault();
          onPrevPage();
        }}
        disabled={currentPage === 1}
      >
        <BsChevronDoubleLeft />
      </button>
      <div className="flex items-center">
        <p className="text-gray-700 mr-2 text-sm">Página {currentPage} de {totalPages}</p>
        {renderPages()}
      </div>
      <button
        type="button"
        className="bg-teal-600 hover:bg-teal-900 rounded text-white text-sm py-2 px-4 mr-2"
        onClick={(e) => {
          e.preventDefault();
          onNextPage();
        }}
        disabled={currentPage === totalPages}
      >
        <BsChevronDoubleRight />
      </button>
    </div>
  );
};

export default Pagination;
