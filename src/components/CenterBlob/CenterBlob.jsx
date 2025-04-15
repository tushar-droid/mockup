import React from "react";
import "./CenterBlob.css";
import { useDroppable } from "@dnd-kit/core";
const CenterBlob = ({ children, blobContainer }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "droppable-blob",
  });

  return (
    <div className="blob-container" ref={blobContainer}>
      <div className="blob" ref={setNodeRef} id="droppable-blob">
        {children}
      </div>
    </div>
  );
};

export default CenterBlob;
