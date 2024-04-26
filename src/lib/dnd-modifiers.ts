import type { ClientRect, Modifier } from "@dnd-kit/core";
import { Transform } from "@dnd-kit/utilities";

function restrictToBoundingRectSmooth(
  transform: Transform,
  rect: ClientRect,
  boundingRect: ClientRect,
  padding: number,
  damping: number,
): Transform {
  const value = {
    ...transform,
  };

  const rectTop = rect.top + transform.y;
  const rectLeft = rect.left + transform.x;
  const rectBottom = rect.bottom + transform.y;
  const rectRight = rect.right + transform.x;
  const boundingRectTop = boundingRect.top - padding;
  const boundingRectLeft = boundingRect.left - padding;
  const boundingRectBottom = boundingRect.top + boundingRect.height + padding;
  const boundingRectRight = boundingRect.left + boundingRect.width + padding;
  if (rectTop <= boundingRectTop) {
    const overBy =
      Math.log(Math.abs(rectTop - boundingRectTop) / damping + 1) * damping;
    value.y += boundingRectTop - rectTop - overBy;
  } else if (rectBottom >= boundingRectBottom) {
    const overBy =
      Math.log(Math.abs(rectBottom - boundingRectBottom) / damping + 1) *
      damping;
    value.y += boundingRectBottom - rectBottom + overBy;
  }

  if (rectLeft <= boundingRectLeft) {
    const overBy =
      Math.log(Math.abs(rectLeft - boundingRectLeft) / damping + 1) * damping;
    value.x += boundingRectLeft - rectLeft - overBy;
  } else if (rectRight >= boundingRectRight) {
    const overBy =
      Math.log(Math.abs(rectRight - boundingRectRight) / damping + 1) * damping;
    value.x += boundingRectRight - rectRight + overBy;
  }

  return value;
}

export const createRestrictToParentElementSmooth = ({
  padding = 32,
  damping = 32,
}: {
  padding?: number;
  damping?: number;
}): Modifier => {
  return ({ containerNodeRect, draggingNodeRect, transform }) => {
    if (!draggingNodeRect || !containerNodeRect) {
      return transform;
    }

    return restrictToBoundingRectSmooth(
      transform,
      draggingNodeRect,
      containerNodeRect,
      padding,
      damping,
    );
  };
};
