/**
 * A BidirectionalMap is a Map that allows lookup by both key and value.
 *
 * Keys and values must be unique:
 * - Setting an existing key updates its value.
 * - Setting an existing value updates its key.
 *
 * @experimental **UNSTABLE**: New API, yet to be vetted.
 * 
 * @typeParam K The type of the keys in the map.
 * @typeParam V The type of the values in the map.
 *
 * @example Usage
 * ```ts
 * import { BidirectionalMap } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * const map = new BidirectionalMap([["one", 1]]);
 *
 * assertEquals(map.get("one"), 1);
 * assertEquals(map.getReverse(1), "one");
 * ```
 *
 * @example Inserting a value that already exists
 * ```ts
 * import { BidirectionalMap } from "@std/data-structures";
 * import { assertEquals } from "@std/assert";
 *
 * const map = new BidirectionalMap();
 * map.set(1, "one");
 * map.set(2, "one");
 *
 * assertEquals(map.size, 1);
 * assertEquals(map.get(1), "one");
 * assertEquals(map.getReverse("one"), 2);
 *
 * @module
 */
export class BidirectionalMap<K, V> extends Map<K, V> {
    #reverseMap: Map<V, K>;

    constructor(iterable?: Iterable<readonly [K, V]> | null) {
        super();
        this.#reverseMap = new Map<V, K>();
        if (iterable) {
            for (const [key, value] of iterable) {
                this.set(key, value);
            }
        }
    }

    /**
     * Clears all entries in the BidirectionalMap.
     *
     * @example Usage
     * ```ts
     * import { BidirectionalMap } from "@std/data-structures";
     * import { assertEquals } from "@std/assert";
     *
     * const map = new BidirectionalMap([["one", 1]]);
     * map.clear();
     * assertEquals(map.size, 0);
     * ```
     */
    override clear(): void {
        super.clear();
        this.#reverseMap.clear();
    }

    /**
     * Adds a new element with a specified key and value to the BidirectionalMap. If an entry with the same key or value already exists, the entry will be updated.
     *
     * @param key The key to set.
     * @param value The value to associate with the key.
     *
     * @returns The BidirectionalMap instance.
     *
     * @example Usage
     * ```ts
     * import { BidirectionalMap } from "@std/data-structures";
     * import { assertEquals } from "@std/assert";
     *
     * const map = new BidirectionalMap();
     * map.set("one", 1);
     *
     * assertEquals(map.get("one"), 1);
     * assertEquals(map.getReverse(1), "one");
     * ```
     */
    override set(key: K, value: V): this {
        const oldValue = super.get(key);
        if (oldValue !== undefined) {
            this.#reverseMap.delete(oldValue);
        }
        const oldKey = this.#reverseMap.get(value);
        if (oldKey !== undefined) {
            super.delete(oldKey);
        }
        super.set(key, value);
        this.#reverseMap.set(value, key);
        return this;
    }

    /**
     * Returns the key associated with the specified value in the BidirectionalMap object. If no key is associated with the specified value, undefined is returned.
     *
     * @param value The value to search for.
     * @returns The key associated with the specified value, or undefined if no key is found.
     *
     * @example Usage
     * ```ts
     * import { BidirectionalMap } from "@std/data-structures";
     * import { assertEquals } from "@std/assert";
     *
     * const map = new BidirectionalMap([["one", 1]]);
     *
     * assertEquals(map.getReverse(1), "one");
     * ```
     */
    getReverse(value: V): K | undefined {
        return this.#reverseMap.get(value);
    }

    /**
     * Removes the element with the specified key. If the element does not exist, the BidirectionalMap remains unchanged.
     *
     * @param key The key of the element to remove.
     *
     * @returns true if an element in the BidirectionalMap existed and has been removed, or false if the element does not exist.
     *
     * @example Usage
     * ```ts
     * import { BidirectionalMap } from "@std/data-structures";
     * import { assertEquals } from "@std/assert";
     *
     * const map = new BidirectionalMap([["one", 1]]);
     * map.delete("one");
     *
     * assertEquals(map.size, 0);
     * ```
     */
    override delete(key: K): boolean {
        const value = super.get(key);
        if (value === undefined) return false;
        this.#reverseMap.delete(value);
        return super.delete(key);
    }

    /**
     * Removes the element with the specified value. If the element does not exist, the BidirectionalMap remains unchanged.
     *
     * @param value The value of the element to remove.
     * @returns true if an element in the BidirectionalMap existed and has been removed, or false if the element does not exist.
     *
     * @example Usage
     * ```ts
     * import { BidirectionalMap } from "@std/data-structures";
     * import { assertEquals } from "@std/assert";
     *
     * const map = new BidirectionalMap([["one", 1]]);
     *
     * map.deleteReverse(1);
     *
     * assertEquals(map.get("one"), undefined);
     * assertEquals(map.getReverse(1), undefined);
     * assertEquals(map.size, 0);
     * ```
     */
    deleteReverse(value: V): boolean {
        const key = this.#reverseMap.get(value);
        if (key === undefined) {
            return false;
        }
        super.delete(key);
        return this.#reverseMap.delete(value);
    }

    /**
     * Checks if an element with the specified value exists in the BidirectionalMap.
     *
     * @param value The value to search for.
     *
     * @returns boolean indicating whether an element with the specified value exists or not.
     *
     * @example Usage
     * ```ts
     * import { BidirectionalMap } from "@std/data-structures";
     * import { assertEquals } from "@std/assert";
     *
     * const map = new BidirectionalMap([["one", 1]]);
     *
     * assertEquals(map.hasReverse(1), true);
     * ```
     */
    hasReverse(value: V): boolean {
        return this.#reverseMap.has(value);
    }

    readonly [Symbol.toStringTag]: string = "BidirectionalMap";
}
