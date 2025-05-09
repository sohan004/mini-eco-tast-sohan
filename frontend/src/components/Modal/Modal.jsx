/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { MdOutlineClose } from "react-icons/md";

const ModalPage = ({ content, setContent, width }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [element, setElement] = useState(null);

  const handleCancel = () => {
    setContent(null);
  };

  useEffect(() => {
    if (content) {
      setElement(content);
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [content]);

  return (
    <>
      <Modal
        className="relative max-w-fit px-5"
        open={isModalOpen}
        footer={null}
        closable={false}
        width={1000}
        onCancel={handleCancel}
      >
        <MdOutlineClose
          onClick={handleCancel}
          className="absolute -right-4 -top-4 cursor-pointer rounded-md border border-dashed  bg-white p-1 text-3xl text-orange-600 duration-150 hover:border-white hover:bg-orange-600 hover:text-white"
        />
        {element}
      </Modal>
    </>
  );
};

export default ModalPage;
