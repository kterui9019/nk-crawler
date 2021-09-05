import { Node } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
/**
 * nodeの親子関係で最も子に位置するNodeのtextContentを取得します
 * 
 * @param node Node
 * @returns string
 */
export const recurNode = (node: Node): string => {
  if (node.hasChildNodes()) {
    recurNode(node.firstChild)
  }

  return node.textContent
}

/**
 * Bufferを指定された形式でエンコーディングした文字列に変換します
 * 
 * @param arrayBuffer BufferSource
 * @param encoding string
 * @returns string
 */
export const decodeAsText = (arrayBuffer: BufferSource, encoding: string) => new TextDecoder(encoding).decode(arrayBuffer)