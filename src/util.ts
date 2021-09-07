import { DOMParser, Node } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

/**
 * nodeの親子関係で最も子に位置するNodeのtextContentを取得します
 *
 * @param node Node
 * @returns string
 */
export const recurNode = (node: Node): string => {
  if (node.hasChildNodes()) {
    recurNode(node.firstChild);
  }

  return node.textContent;
};

/**
 * URLから指定されたエンコーディング形式でDOMオブジェクトを返却します
 *
 * @param arrayBuffer BufferSource
 * @param encoding string
 * @returns Promise<HTMLDocument>
 */
export const fetchDom = async (url: string, encoding: string) => {
  const res = await fetch(url);
  const buf = (await res.arrayBuffer());
  const html = new TextDecoder(encoding).decode(buf).replace(/<img.*?>/g, "");
  const dom = new DOMParser().parseFromString(html, "text/html");
  if (!dom) throw new Error("Couldn't parse text/html to dom");

  return dom;
};

/**
 * 指定したミリ秒だけ処理を待機します。
 * 
 * @param ms number
 * @returns void
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));