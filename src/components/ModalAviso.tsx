import React from "react";
import Modal from "react-modal";
import { MdCheckCircle, MdErrorOutline } from "react-icons/md";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

interface ModalAvisoProps {
  mensagem: string;
  isOpen: boolean;
  onClose: () => void;
  sucesso?: boolean; // tornando sucesso opcional
}

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    padding: "20px",
    width: "300px",
    textAlign: "center",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  },
};

const ModalAviso: React.FC<ModalAvisoProps> = ({
  mensagem,
  isOpen,
  onClose,
  sucesso = false, // definindo false como padrão caso sucesso não seja fornecido
}) => {
  const router = useRouter();

  const handleCloseModal = () => {
    onClose();
    router.push("/clientes/listar-clientes");
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Aviso"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-center items-center mb-4"
      >
        <div
          className={`rounded-full bg-${sucesso ? "green" : "red"}-200 p-2 mr-2`}
        >
          {sucesso ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <MdCheckCircle className="text-green-500" size={32} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <MdErrorOutline className="text-red-500" size={32} />
            </motion.div>
          )}
        </div>
        <h2 className="text-lg font-semibold">{sucesso ? "Sucesso" : "Erro"}</h2>
      </motion.div>
      <p>{mensagem}</p>
      <button
        onClick={handleCloseModal}
        className="mt-4 py-2 px-4 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:outline-none focus:bg-gray-300"
      >
        Fechar
      </button>
    </Modal>
  );
};

export default ModalAviso;
