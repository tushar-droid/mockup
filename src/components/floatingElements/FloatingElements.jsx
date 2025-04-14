import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import "./floatingElements.css";
import { motion } from "framer-motion";

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
  const randomDuration = 4 + Math.random() * 2; // Random between 4s and 6s
  const randomDelay = Math.random() * 2; // Random delay from 0 to 2s

  return (
    <div
      ref={(el) => {
        setNodeRef(el);
        innerRef?.(el); // Pass to parent
      }}
      {...listeners}
      {...attributes}
      style={style}
      className="floating-wrapper"
    >
      <motion.div
        className="floating-elements"
        animate={{
          y: [0, -10, 0],
          x: [0, 5, -5, 0],
        }}
        transition={{
          duration: randomDuration, // Random duration
          delay: randomDelay, // Random delay
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {itemName}
      </motion.div>
    </div>
  );
};

export default FloatingElements;
