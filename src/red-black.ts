import { Maybe, isNone, None, Some } from "./maybe"
// Red Black Tree impl
// Binary search + black or red
// Root is always black
// new node is always red
// no red-red parent-child
//number of black nodes from root to node
//with less than 2 children is same

type Comparator<T> = (first: T, second: T) => -1 | 0 | 1
type Comparable = number | string

type BTree<K, T> = Maybe<BTNode<K, T>>

type BTNode<K, T> = {
  key: K,
  value: T
  parent: BTree<K, T>
  left: BTree<K, T>
  right: BTree<K, T>
}

type search = <K extends Comparable, T>(tree: BTree<K, T>) => (key: K) => Maybe<T>
type insert = <K extends Comparable, T>(tree: BTree<K, T>) => (key: K) => (value: T) => BTree<K, T>
type remove = <K extends Comparable, T>(tree: BTree<K, T>) => (key: K) => BTree<K, T>
type traverse = <K extends Comparable, T, U>(fn: (key: K, value: T) => U) => (tree: BTree<K, T>) => Tree<K, U>

type newNode = <K, T>(key: K, value: T, parent: Maybe<BTNode<K, T>>) => BTNode<K, T>
const newNode: newNode
= (key, value, parent) => {
  return { 
    key: key,
    value: value,
    parent: parent,
    left: None(),
    right: None()
  }
}

const insert: insert
  = tree => key => value => {
    if (isNone(tree)) {
      
    }
  }