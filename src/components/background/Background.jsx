// import "./background.css";
// import { DndContext } from "@dnd-kit/core";
// import { useDroppable } from "@dnd-kit/core";
// import FloatingElements from "../floatingElements/FloatingElements";
// const Background = () => {
//   const items = ["apple", "backpack", "chair"];
//   const { isOver, setNodeRef } = useDroppable({
//     id: "background",
//   });
//   let tempLeft = 0;
//   let tempTop = 0;

//   function handleDragEnd(ev) {
//     const draggedItem = document.querySelector(`#${ev.active.id}`);

//     draggedItem.style.left = tempLeft + ev.delta.x + "px";
//     draggedItem.style.top = tempTop + ev.delta.y + "px";
//     tempLeft = 0;
//     tempTop = 0;
//   }
//   function handleDragStart(ev) {
//     const draggedItem = document.getElementById(ev.active.id);
//     tempLeft = parseInt(draggedItem.style.left ? draggedItem.style.left : 0);
//     tempTop = parseInt(draggedItem.style.top ? draggedItem.style.top : 0);
//   }

//   return (
//     <>
//       <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
//         <div className="background" id="background" ref={setNodeRef}>
//           {items.map((item) => (
//             <FloatingElements itemName={item} />
//           ))}
//         </div>
//       </DndContext>
//     </>
//   );
// };

// export default Background;

import "./background.css";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { useRef, useMemo } from "react";
import FloatingElements from "../floatingElements/FloatingElements";

const Background = () => {
  const items = ["apple", "backpack", "chair"];

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
      const newLeft = positionRef.current.left + delta.x;
      const newTop = positionRef.current.top + delta.y;

      el.style.position = "absolute";
      el.style.left = `${newLeft}px`;
      el.style.top = `${newTop}px`;
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
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
