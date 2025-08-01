/**
 * Utility functions for safe localStorage operations
 * Handles cases where localStorage might not be available or functional
 */

export const StorageUtils = {
  /**
   * Check if localStorage is available
   */
  isAvailable() {
    try {
      return typeof Storage !== "undefined" && 
             window.localStorage !== undefined &&
             window.localStorage !== null;
    } catch (e) {
      return false;
    }
  },

  /**
   * Safely get an item from localStorage
   */
  getItem(key) {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item;
    } catch (e) {
      return null;
    }
  },

  /**
   * Safely set an item in localStorage
   */
  setItem(key, value) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Safely remove an item from localStorage
   */
  removeItem(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  /**
   * Safely parse JSON from localStorage
   */
  getJSON(key) {
    const item = this.getItem(key);
    if (!item || item === 'null' || item === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(item);
    } catch (e) {
      // Clear corrupted data
      this.removeItem(key);
      return null;
    }
  },

  /**
   * Safely stringify and store JSON in localStorage
   */
  setJSON(key, value) {
    try {
      const serialized = JSON.stringify(value);
      return this.setItem(key, serialized);
    } catch (e) {
      return false;
    }
  }
};
