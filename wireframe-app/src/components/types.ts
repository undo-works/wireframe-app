// キャンバス関連の共通型定義。
export type CanvasUnit = "px" | "mm" | "pt";

export type CanvasSpec = {
  width: number;
  height: number;
  unit: CanvasUnit;
  background: string;
};

export type NodeType = "rect" | "ellipse" | "line" | "text";

export type NodeStyle = {
  fill: string;
  stroke: string;
  opacity: number;
};

export type NodeText = {
  value: string;
  size: number;
  color: string;
};

export type Frame = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type CanvasNode = {
  id: string;
  type: NodeType;
  name: string;
  frame: Frame;
  rotation: number;
  style: NodeStyle;
  text?: NodeText;
};

export type PageData = {
  id: string;
  name: string;
  nodes?: CanvasNode[];
};

export type ProjectData = {
  id: string;
  name: string;
  canvas: CanvasSpec;
  pages: PageData[];
  activePageId: string;
};
