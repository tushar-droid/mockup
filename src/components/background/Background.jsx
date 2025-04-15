import "./background.css";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useRef, useMemo, useState, useLayoutEffect } from "react";
import FloatingElements from "../floatingElements/FloatingElements";
import CenterBlob from "../CenterBlob/CenterBlob";

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
  const blobContainer = useRef(null);
  const [testPositions, setTestPositions] = useState(null);
  const { setNodeRef } = useDroppable({
    id: "background",
  });

  useLayoutEffect(() => {
    console.log("Layout affect ran");

    const test = () => {
      return items.reduce((acc, item) => {
        const maxLeft = window.innerWidth - 100;
        const maxTop = window.innerHeight - 100;
        acc[item] = {
          left: Math.random() * maxLeft,
          top: Math.random() * maxTop,
        };
        return acc;
      }, {});
    };
    setTestPositions(test);
  }, []);

  const randomPositions = useMemo(() => {
    //Returns an object with items as keys and all values are also objects with left and right as keys and random left and right positions as values
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
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        modifiers={[restrictToParentElement]}
      >
        <CenterBlob blobContainer={blobContainer} />
        <div className="background" id="background" ref={setNodeRef}>
          {testPositions &&
            items.map((item) => (
              <FloatingElements
                key={item}
                itemName={item}
                innerRef={(el) => {
                  itemRefs.current[item] = el;
                  console.log(testPositions);
                }}
                // initialLeft={randomPositions[item].left}
                // initialTop={randomPositions[item].top}
                initialLeft={testPositions[item].left}
                initialTop={testPositions[item].top}
                id={item}
              />
            ))}
        </div>
      </DndContext>
    </>
  );
};

export default Background;
