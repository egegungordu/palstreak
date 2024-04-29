"use client";

import { cn } from "@/lib/utils";
import { useAnimationFrame } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

function useMousePosition() {
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      position.current = { x: e.clientX, y: e.clientY };
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return position;
}

export default function NavbarGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCount = useRef(0);
  const dir = useRef(1);
  const align = useRef(1);
  const trailStack = useRef<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);
  const [showCanvas, setShowCanvas] = useState(false);
  const mousePosition = useMousePosition();
  const { resolvedTheme = "" } = useTheme();

  useEffect(() => {
    setTimeout(() => {
      setShowCanvas(true);
    }, 1000);
  }, []);

  useAnimationFrame((ts, delta) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    frameCount.current++;

    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(-16, -180);
    ctx.rotate(0.45);

    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 20; j++) {
        ctx.fillStyle = resolvedTheme === "light" ? "#ddd" : "#333";
        ctx.strokeStyle = resolvedTheme === "light" ? "#888" : "#777";
        // ctx.globalAlpha = 1;
        for (let k = 0; k < trailStack.current.length; k++) {
          if (trailStack.current[k].x === i && trailStack.current[k].y === j) {
            // ctx.fillStyle = "#38bdf8";
            // ctx.globalAlpha = 1 - k / trailStack.current.length / 1.1;
            break;
          }
        }
        const xOffset = frameCount.current / 20;

        const realMouseX =
          mousePosition.current.x - canvas.getBoundingClientRect().left;
        const realMouseY =
          mousePosition.current.y - canvas.getBoundingClientRect().top;
        // radian to degree
        const angleDeg = 0.45 * (180 / Math.PI);
        const translatedMouseX = realMouseX + 16;
        const translatedMouseY = realMouseY + 180;
        const rotatedMouseX =
          Math.cos(angleDeg) * (translatedMouseX - 16) -
          Math.sin(angleDeg) * (translatedMouseY - 180) +
          16;
        const rotatedMouseY =
          Math.sin(angleDeg) * (translatedMouseX - 16) +
          Math.cos(angleDeg) * (translatedMouseY - 180) +
          180;
        const rectX = (i * 12 + i * 4 + xOffset) % (40 * 16);
        const rectY = j * 12 + j * 4;
        const distance = Math.sqrt(
          (rotatedMouseX - rectX) ** 2 + (rotatedMouseY - rectY) ** 2,
        );
        // ctx.globalAlpha = Math.max(0, 1 - Math.min(1, distance / 100) + 0.7);

        ctx.beginPath();
        ctx.roundRect(rectX, rectY, 12, 12, [3]);
        ctx.stroke();
        ctx.fill();
      }
    }

    if (frameCount.current % 10 === 0) {
      const head = trailStack.current[0];
      const newHead = {
        x: dir.current === 1 ? head.x + align.current : head.x,
        y: dir.current === -1 ? head.y + align.current : head.y,
      };

      if (newHead.x < 0) {
        newHead.x = 40 - 1;
      } else if (newHead.x >= 40) {
        newHead.x = 0;
      }

      if (newHead.y < 0) {
        newHead.y = 20 - 1;
      } else if (newHead.y >= 20) {
        newHead.y = 0;
      }

      trailStack.current.unshift(newHead);

      if (trailStack.current.length > 64) {
        trailStack.current.pop();
      }
    }

    if (frameCount.current % 23 === 0) {
      align.current = Math.random() < 0.5 ? -1 : 1;
    }
    if (frameCount.current % 31 === 0) {
      dir.current = Math.random() < 0.5 ? -1 : 1;
    }
  });

  return (
    <div
      className={cn(
        "opacity-0 -translate-x-4 absolute w-96 h-full left-0 -z-10 transition-all duration-700 ease-in-out",
        {
          "opacity-100 translate-x-0": showCanvas,
        },
      )}
    >
      <canvas
        style={{
          maskImage: "linear-gradient(150deg, black, transparent 60%)",
        }}
        ref={canvasRef}
        className="w-full h-full"
        width={384}
        height={48}
      />
    </div>
  );
}
