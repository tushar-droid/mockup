// import React, { useEffect, useRef, useState } from "react";
// import "./floatingElements.css";
// import { useDraggable } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities";
// const FloatingElements = ({ itemName }) => {
//   const { attributes, listeners, setNodeRef, transform } = useDraggable({
//     id: itemName,
//   });

//   const style = {
//     transform: CSS.Translate.toString(transform),
//   };

//   return (
//     <div
//       className="floating-elements"
//       ref={setNodeRef}
//       {...listeners}
//       {...attributes}
//       id={itemName}
//       style={style}
//     >
//       {itemName}
//     </div>
//   );
// };

// export default FloatingElements;

import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import "./floatingElements.css";

const FloatingElements = ({
  itemName,
  innerRef,
  id,
  initialLeft,
  initialTop,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: `${initialLeft}px`,
    top: `${initialTop}px`,
  };

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        innerRef?.(el); // Pass to parent
      }}
      {...listeners}
      {...attributes}
      style={style}
      className="floating-elements"
    >
      {itemName}
    </div>
  );
};

export default FloatingElements;
