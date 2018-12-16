import { Maybe, isNone, None, Some, unwrap } from "./maybe"
// Red Black Tree impl
// Binary search + black or red
// Root is always black
// new node is always red
// no red-red parent-child
//number of black nodes from root to node
//with less than 2 children is same

type Comparator<T> = (first: T, second: T) => -1 | 0 | 1
type Comparable = number | string

export type BTree<K, T> = Maybe<BTNode<K, T>>

type BTNode<K, T> = {
  key: K,
  value: T
  left: BTree<K, T>
  right: BTree<K, T>
}


type has = <K extends Comparable, T>(tree: BTree<K, T>) => (key: K) => boolean

type traverse = <K extends Comparable, T, U>(fn: (key: K, value: T) => U) => (tree: BTree<K, T>) => BTree<K, U>

type newNode = <K, T>(key: K, value: T, left: BTree<K, T>, right: BTree<K, T>) => BTNode<K, T>
const newNode: newNode
= (key, value, left, right) => {
  return { 
    key: key,
    value: value,
    left: left,
    right: right
  }
}

type empty = () => BTree<any, any>
export const empty: empty
  = () => None()

type singleton = <K extends Comparable, T>(key: K) => (value: T) => BTree<K, T>
export const singleton: singleton
  = key => value => Some(newNode(key, value, None(), None()))


type insert = <K extends Comparable, T>(key: K) => (value: T) => (tree: BTree<K, T>) => BTree<K, T>
export const insert: insert
  = k => v => t => {
    if (isNone(t)) {
      return Some(newNode(k, v, None(), None()))
    }
    const node = unwrap(t)
    if (k < node.key) {
      return Some(newNode(node.key, node.value, insert(k)(v)(node.left), node.right))
    }
    if (k > node.key) {
      return Some(newNode(node.key, node.value, node.left, insert(k)(v)(node.left)))
    }
    return t
  }

type get = <K extends Comparable, T>(key: K) => (tree: BTree<K, T>) =>  Maybe<T>
export const get: get
  = k => t => {
    if (isNone(t)) {
      return t
    }
    const node = unwrap(t)
    if (k < node.key) {
      return get(k)(node.left)
    }
    if (k > node.key) {
      return get(k)(node.right)
    }
    return Some(node.value)
  }

type remove = <K extends Comparable, T>(key: K) => (tree: BTree<K, T>) => BTree<K, T>
export const remove: remove
  = k => t => {
    if (isNone(t)) {
      return t
    }
    const node = unwrap(t)
    if (k < node.key) {
      
    }
    if (k > node.key) {
      
    }
  }