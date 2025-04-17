import "./background.css";
import { DndContext } from "@dnd-kit/core";
import { useDroppable } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useRef, useEffect, useState, useLayoutEffect } from "react";
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
    "Towel",
    "Camera",
    "Spoon",
    "Phone",
  ];

  // Track refs for each draggable element
  const itemRefs = useRef({});
  const positionRef = useRef({ left: 0, top: 0 });
  const blobContainer = useRef();
  const [randomPositions, setrandomPositions] = useState(null);
  const { setNodeRef } = useDroppable({
    id: "background",
  });

  useLayoutEffect(() => {
    //Assigns random positions to all the items
    const blobRectangle = blobContainer.current.getBoundingClientRect();
    const blobPosition = {
      top: blobRectangle.top,
      bottom: blobRectangle.bottom,
      left: blobRectangle.left,
      right: blobRectangle.right,
    };

    // const initializePositions = () => {
    //   return items.reduce((acc, item) => {
    //     const maxLeft = window.innerWidth - 100;
    //     const maxTop = window.innerHeight - 100;
    //     let tempLeft = Math.random() * maxLeft;
    //     let tempTop = Math.random() * maxTop;
    //     while (
    //       (tempLeft >= blobPosition.left - 50 &&
    //         tempLeft <= blobPosition.right + 50) ||
    //       (tempTop >= blobPosition.bottom - 50 &&
    //         tempTop <= blobPosition.top + 50)
    //     ) {
    //       tempLeft = Math.random() * maxLeft;
    //       tempTop = Math.random() * maxTop;
    //     }

    //     acc[item] = {
    //       left: tempLeft,
    //       top: tempTop,
    //     };
    //     return acc;
    //   }, {});
    // };
    const initializePositions = () => {
      const totalSpots = 25;
      const gridSize = 5;
      const padding = 100;
      const cellWidth = (window.innerWidth - padding * 2) / gridSize;
      const cellHeight = (window.innerHeight - padding * 2) / gridSize;

      const safeSpots = [];

      // Pre-filter cells based on cell vs blob intersection
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = padding + col * cellWidth;
          const y = padding + row * cellHeight;

          const cellLeft = x;
          const cellRight = x + cellWidth;
          const cellTop = y;
          const cellBottom = y + cellHeight;

          const overlapsBlob = !(
            cellRight < blobPosition.left - 50 ||
            cellLeft > blobPosition.right + 50 ||
            cellBottom < blobPosition.top - 50 ||
            cellTop > blobPosition.bottom + 50
          );

          if (!overlapsBlob) {
            safeSpots.push({ x, y });
          }
        }
      }

      // Shuffle and assign cells
      const shuffledSpots = safeSpots.sort(() => 0.5 - Math.random());
      const usedSpots = shuffledSpots.slice(0, items.length);

      return items.reduce((acc, item, index) => {
        const spot = usedSpots[index];

        let left, top;
        let tries = 0;
        const maxTries = 10;
        const blobPadding = 50;

        if (spot) {
          // Try jittered positions within the cell that don't overlap the blob
          do {
            left = spot.x + Math.random() * (cellWidth - 50);
            top = spot.y + Math.random() * (cellHeight - 50);
            tries++;
          } while (
            left >= blobPosition.left - blobPadding &&
            left <= blobPosition.right + blobPadding &&
            top >= blobPosition.top - blobPadding &&
            top <= blobPosition.bottom + blobPadding &&
            tries < maxTries
          );
        }

        // If no valid spot found or no cell available, fallback to fully random (but still blob-safe)
        if (!spot || tries === maxTries) {
          let fallbackTries = 0;
          do {
            left = Math.random() * (window.innerWidth - 100);
            top = Math.random() * (window.innerHeight - 100);
            fallbackTries++;
          } while (
            left >= blobPosition.left - blobPadding &&
            left <= blobPosition.right + blobPadding &&
            top >= blobPosition.top - blobPadding &&
            top <= blobPosition.bottom + blobPadding &&
            fallbackTries < maxTries
          );
        }

        acc[item] = { left, top };
        return acc;
      }, {});
    };

    setrandomPositions(initializePositions);
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
          {randomPositions &&
            items.map((item) => (
              <FloatingElements
                key={item}
                itemName={item}
                innerRef={(el) => {
                  itemRefs.current[item] = el;
                }}
                // initialLeft={randomPositions[item].left}
                // initialTop={randomPositions[item].top}
                initialLeft={randomPositions[item].left}
                initialTop={randomPositions[item].top}
                id={item}
              />
            ))}
        </div>
      </DndContext>
    </>
  );
};

export default Background;
