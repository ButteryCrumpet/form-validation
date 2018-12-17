import { Maybe, isNone, None, Some, unwrap, andThen, map as map_maybe } from "./maybe"

type Comparator<T> = (first: T, second: T) => -1 | 0 | 1

export type BTree<K, T> = Maybe<BTNode<K, T>>

type BTNode<K, T> = {
  key: K,
  value: T
  left: BTree<K, T>
  right: BTree<K, T>
}


type has = <K, T>(tree: BTree<K, T>) => (key: K) => boolean

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
export const empty: empty = () => None()


type singleton = <K, T>(key: K) => (value: T) => BTree<K, T>
export const singleton: singleton
  = key => value => Some(newNode(key, value, None(), None()))


type insert = <K>(key: K) => <T>(value: T) => (tree: BTree<K, T>) => BTree<K, T>
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


type get = <K>(key: K) => <T>(tree: BTree<K, T>) => Maybe<T>
export const get: get = k => andThen(_get(k))

type _get = <K>(key: K) => <T>(node: BTNode<K, T>) => Maybe<T>
const _get: _get
  = k => n => {
    if (k < n.key) {
      return get(k)(n.left)
    }
    if (k > n.key) {
      return get(k)(n.right)
    }
    return Some(n.value)
  }


type remove = <K>(key: K) => <T>(tree: BTree<K, T>) => BTree<K, T>
export const remove: remove = k => andThen(_remove(k))

type _remove = <K>(key: K) => <T>(tree: BTNode<K, T>) => BTree<K, T>
const _remove: _remove
  = k => n => {
    if (k < n.key) {
      return Some(newNode(n.key, n.value, remove(k)(n.left), n.right))
    }
    if (k > n.key) {
      return Some(newNode(n.key, n.value, n.left, remove(k)(n.left)))
    }
    return None()
  }


type fold = <K, T, U>(fn: (key: K, value: T, acc: U) => U) => (start: U) => (tree: BTree<K, T>) => U
export const foldl: fold
  = fn => a => t => {
    if (isNone(t)) {
      return a
    }
    const node = unwrap(t)
    return foldl(fn)(fn(node.key, node.value, foldl(fn)(a)(node.left)))(node.right)
  }


export const foldr: fold
= fn => a => t => {
  if (isNone(t)) {
    return a
  }
  const node = unwrap(t)
  return foldr(fn)(fn(node.key, node.value, foldr(fn)(a)(node.right)))(node.left)
}

type map = <K, T, U>(fn: (key: K, value: T) => U) => (tree: BTree<K, T>) => BTree<K, U>
export const map: map
= fn => map_maybe(node => {
    const left = map(fn)(node.left)
    const val = fn(node.key, node.value)
    const right = map(fn)(node.right)
    return newNode(node.key, val, left, right)
  })
