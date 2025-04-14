import "./background.css";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useRef, useMemo } from "react";
import FloatingElements from "../floatingElements/FloatingElements";

const Background = () => {
  const items = [
    "Apple",
    "Backpack",
    "Chair",
    "Lamp",
    "Notebook",
    "Cup",
    "Shoes",
    "Clock",
    "Bicycle",
    "Pen",
    "Hat",
    "Glasses",
    "Plant",
    "Keyboard",
    "Mug",
  ];

  // Track refs for each draggable element
  const itemRefs = useRef({});
  const positionRef = useRef({ left: 0, top: 0 });

  const { setNodeRef } = useDroppable({
    id: "background",
  });

  const randomPositions = useMemo(() => {
    return items.reduce((acc, item) => {
      const maxLeft = window.innerWidth - 100;
      const maxTop = window.innerHeight - 100;
      acc[item] = {
        left: Math.random() * maxLeft,
        top: Math.random() * maxTop,
      };
      return acc;
    }, {});
  }, []);

  const handleDragStart = (ev) => {
    const id = ev.active.id;
    const el = itemRefs.current[id];
    if (el) {
      const { left, top } = el.getBoundingClientRect();

      positionRef.current.left = left;
      positionRef.current.top = top;
    }
  };

  const handleDragEnd = (ev) => {
    const id = ev.active.id;
    const el = itemRefs.current[id];
    if (el) {
      const delta = ev.delta;

      const newLeft = Math.min(
        positionRef.current.left + delta.x,
        window.innerWidth - 100
      );
      const newTop = positionRef.current.top + delta.y;

      el.style.position = "absolute";
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      modifiers={[restrictToParentElement]}
    >
      <div className="background" id="background" ref={setNodeRef}>
        {items.map((item) => (
          <FloatingElements
            key={item}
            itemName={item}
            innerRef={(el) => {
              itemRefs.current[item] = el;
            }}
            initialLeft={randomPositions[item].left}
            initialTop={randomPositions[item].top}
            id={item}
          />
        ))}
      </div>
    </DndContext>
  );
};

export default Background;
