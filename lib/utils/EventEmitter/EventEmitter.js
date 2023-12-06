export class EventEmitter {
  constructor(config = {}) {
    if (config.singleton && EventEmitter.sharedEventTarget) {
      // If `singleton` is set and `sharedEventTarget` already exists, use it for all instances
      this.eventTarget = EventEmitter.sharedEventTarget;
    } else {
      // Otherwise, create a new `EventTarget`
      this.eventTarget = new EventTarget();
      
      // If `singleton` is set, save the created `EventTarget` in `sharedEventTarget`
      if (config.singleton) {
        EventEmitter.sharedEventTarget = this.eventTarget;
      }
    }
  }

  on(eventName, callback) {
    this.eventTarget.addEventListener(eventName, callback);
  }

  off(eventName, callback) {
    this.eventTarget.removeEventListener(eventName, callback);
  }

  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });

    this.eventTarget.dispatchEvent(event);
  }
}
