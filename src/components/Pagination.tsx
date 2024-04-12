import { FC } from 'react';
import { BsChevronDoubleLeft, BsChevronDoubleRight, BsChevronLeft, BsChevronRight } from 'react-icons/bs';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number; // Garantindo que totalRecords seja passado como prop
  onNextPage: () => void;
  onPrevPage: () => void;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalRecords,
  onNextPage,
  onPrevPage,
  onPageChange,
}) => {

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex justify-between items-center mx-4 mt-4 mb-4">
      {totalRecords > 0 && (
        <div className="mr-4">
          <p className="text-gray-700 text-lg">Registros carregados: <span className="font-bold italic">{totalRecords}</span></p>
        </div>
      )}
      <div className="flex items-center">
        <button
          type="button"
          className={`bg-teal-600 rounded text-white text-sm py-2 px-4 mr-2 ${isFirstPage ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-900'}`}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(1);
          }}
          disabled={isFirstPage}
        >
          <BsChevronDoubleLeft />
        </button>
        <button
          type="button"
          className={`bg-teal-600 rounded text-white text-sm py-2 px-4 mr-2 ${isFirstPage ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-900'}`}
          onClick={(e) => {
            e.preventDefault();
            onPrevPage();
          }}
          disabled={isFirstPage}
        >
          <BsChevronLeft />
        </button>
        <p className="text-gray-700 mr-2 text-sm">Página {currentPage} de {totalPages}</p>
        <button
          type="button"
          className={`bg-teal-600 rounded text-white text-sm py-2 px-4 mr-2 ${isLastPage ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-900'}`}
          onClick={(e) => {
            e.preventDefault();
            onNextPage();
          }}
          disabled={isLastPage}
        >
          <BsChevronRight />
        </button>
        <button
          type="button"
          className={`bg-teal-600 rounded text-white text-sm py-2 px-4 ${isLastPage ? 'opacity-70 cursor-not-allowed' : 'hover:bg-teal-900'}`}
          onClick={(e) => {
            e.preventDefault();
            onPageChange(totalPages);
          }}
          disabled={isLastPage}
        >
          <BsChevronDoubleRight />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
