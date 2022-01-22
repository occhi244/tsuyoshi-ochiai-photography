//
// Utilities
//

// Check the target device has mince or not.
// Dec. 19, 2021 - change from any-pointer to pointer.
// On Moto G6, any-pointer: fine matches, even though mince is not attached.
export function hasMouse(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

// Pointing device.
export const PointingDeviceTouch = "touch";
export const PointingDeviceMouse = "mouse";
export function getPointingDevice(): string {
  return hasMouse() ? PointingDeviceMouse : PointingDeviceTouch;
}

// Wheel event listener.
export class WheelEventListener {
  private lastRoutedStamp: number;
  private lastFiredStamp: number;
  private lastDelta: number;
  private isFired: boolean;
  private readonly callback: (direction: number) => void;
  private readonly listener: (wheelEvent: WheelEvent) => void;

  // constructor
  constructor(callback: (direction: number) => void) {
    this.lastDelta = 0;
    this.lastFiredStamp = 0;
    this.lastRoutedStamp = 0;
    this.isFired = false;
    this.callback = callback;

    // definition for wheel listener
    this.listener = (wheelEvent: WheelEvent) => {
      // check the last event time.
      const currentStamp = wheelEvent.timeStamp;
      const currentDelta = wheelEvent.deltaY;
      wheelEvent.preventDefault();

      // handle wheel movement.
      if (
        currentStamp - this.lastRoutedStamp > 100 ||
        Math.abs(currentDelta) - Math.abs(this.lastDelta) > 10 // for inertia scroll
      ) {
        if (currentStamp - this.lastFiredStamp > 800) {
          this.isFired = false;
        }
        if (!this.isFired) {
          this.isFired = true;
          this.lastFiredStamp = currentStamp;
          this.callback(currentDelta > 0 ? 1 : currentDelta < 0 ? -1 : 0);
        }
      }
      this.lastDelta = currentDelta;
      this.lastRoutedStamp = currentStamp;
    };
  }

  // enable/disable this wheel handler.
  public enable(isEnabled: boolean) {
    if (isEnabled) {
      window.addEventListener("wheel", this.listener, { passive: false });
    } else {
      window.removeEventListener("wheel", this.listener);
    }
  }
}

//
// touch move (swipe) event handler
//
export class TouchEventListener {
  static readonly Horizontal = "horizontal";
  static readonly Vertical = "vertical";
  private touchStart: number;
  private touchEnd: number;
  private readonly isHorizontal: boolean;
  private readonly callback: (direction: number) => void;
  private readonly startListener: (touchEvent: TouchEvent) => void;
  private readonly moveListener: (touchEvent: TouchEvent) => void;
  private readonly endListener: () => void;

  constructor(direction: string, callback: (direction: number) => void) {
    this.touchStart = 0;
    this.touchEnd = 0;
    this.isHorizontal = direction === TouchEventListener.Horizontal;
    this.callback = callback;

    this.startListener = (touchEvent: TouchEvent) => {
      this.touchStart = this.isHorizontal
        ? touchEvent.touches[0].pageX
        : touchEvent.touches[0].pageY;
      this.touchEnd = -1;
    };
    this.moveListener = (touchEvent: TouchEvent) => {
      touchEvent.preventDefault();
      this.touchEnd = this.isHorizontal
        ? touchEvent.touches[0].pageX
        : touchEvent.touches[0].pageY;
    };
    this.endListener = () => {
      if (this.touchEnd >= 0) {
        const direction = this.touchStart - this.touchEnd;
        this.callback(direction > 0 ? 1 : direction < 0 ? -1 : 0);
      }
    };
  }

  // enable/disable for window.
  public enable(isEnabled: boolean) {
    if (isEnabled) {
      window.addEventListener("touchstart", this.startListener);
      window.addEventListener("touchmove", this.moveListener, {
        passive: false
      });
      window.addEventListener("touchend", this.endListener);
    } else {
      window.removeEventListener("touchstart", this.startListener);
      window.removeEventListener("touchmove", this.moveListener);
      window.removeEventListener("touchend", this.endListener);
    }
  }

  // enable/disable for the specific element.
  public enableFor(isEnabled: boolean, htmlElement?: HTMLElement) {
    if (isEnabled) {
      htmlElement?.addEventListener("touchstart", this.startListener);
      htmlElement?.addEventListener("touchmove", this.moveListener, {
        passive: false
      });
      htmlElement?.addEventListener("touchend", this.endListener);
    } else {
      htmlElement?.removeEventListener("touchstart", this.startListener);
      htmlElement?.removeEventListener("touchmove", this.moveListener);
      htmlElement?.removeEventListener("touchend", this.endListener);
    }
  }
}
