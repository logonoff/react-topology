import { ComponentType } from 'react';
import Point from './geom/Point';
import Dimensions from './geom/Dimensions';
import Rect from './geom/Rect';
import { Padding, Translatable } from './geom/types';
import { LayoutOptions } from './layouts/LayoutOptions';

// x, y
export type PointTuple = [number, number];

export interface Layout {
  layout(): void;
  stop(): void;
  destroy(): void;
  getLayoutOptions?: () => LayoutOptions;
}

export interface Model {
  graph?: GraphModel;
  nodes?: NodeModel[];
  edges?: EdgeModel[];
}

export enum AnchorEnd {
  target,
  source,
  both
}

export interface NodeStyle {
  padding?: Padding;
}

export enum TopologyQuadrant {
  upperLeft = 'upperLeft',
  upperRight = 'upperRight',
  lowerLeft = 'lowerLeft',
  lowerRight = 'lowerRight'
}

export enum NodeShape {
  circle = 'circle', // backward compatibility
  ellipse = 'ellipse',
  rect = 'rect',
  rhombus = 'rhombus',
  trapezoid = 'trapezoid',
  hexagon = 'hexagon',
  octagon = 'octagon',
  stadium = 'stadium'
}

export enum NodeStatus {
  default = 'default',
  info = 'info',
  success = 'success',
  warning = 'warning',
  danger = 'danger'
}

export enum EdgeStyle {
  default = 'default',
  solid = 'solid',
  dotted = 'dotted',
  dashed = 'dashed',
  dashedMd = 'dashedMd',
  dashedLg = 'dashedLg',
  dashedXl = 'dashedXl'
}

export enum EdgeAnimationSpeed {
  none = 'none',
  slow = 'slow',
  mediumSlow = 'mediumSlow',
  medium = 'medium',
  mediumFast = 'mediumFast',
  fast = 'fast'
}

export enum EdgeTerminalType {
  none = 'none',
  directional = 'directional',
  directionalAlt = 'directionalAlt',
  circle = 'circle',
  square = 'square',
  cross = 'cross'
}

export enum LabelPosition {
  top,
  left,
  right,
  bottom
}

export enum BadgeLocation {
  inner,
  below
}

export enum ModelKind {
  graph = 'graph',
  node = 'node',
  edge = 'edge'
}

export interface ElementModel {
  id: string;
  type: string;
  label?: string;
  visible?: boolean;
  children?: string[];
  data?: any;
  style?: { [key: string]: any };
}

export interface NodeModel extends ElementModel {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  group?: boolean;
  shape?: NodeShape;
  status?: NodeStatus;
  collapsed?: boolean;
  labelPosition?: LabelPosition;
}

export interface EdgeModel extends ElementModel {
  source?: string;
  target?: string;
  edgeStyle?: EdgeStyle;
  animationSpeed?: EdgeAnimationSpeed;
  bendpoints?: PointTuple[];
}

// Scale extent: [min scale, max scale]
export type ScaleExtent = [number, number];

export enum ScaleDetailsLevel {
  high = 'high',
  medium = 'medium',
  low = 'low'
}

export interface ScaleDetailsThresholds {
  low: number;
  medium: number;
}

type Never<Type> = { [K in keyof Type]?: never };
type EitherNotBoth<TypeA, TypeB> = (TypeA & Never<TypeB>) | (TypeB & Never<TypeA>);

interface ViewPaddingPixels {
  padding: number;
}
interface ViewPaddingPercentage {
  paddingPercentage: number;
}

export type ViewPaddingSettings = EitherNotBoth<ViewPaddingPixels, ViewPaddingPercentage>;

export interface GraphModel extends ElementModel {
  layout?: string;
  x?: number;
  y?: number;
  scale?: number;
  scaleExtent?: ScaleExtent;
  layers?: string[];
}

export interface Anchor {
  getLocation(reference: Point): Point;
  getReferencePoint(): Point;
}

export interface GraphElement<E extends ElementModel = ElementModel, D = any> extends WithState {
  destroy(): void;
  getKind(): ModelKind;
  getLabel(): string;
  setLabel(label: string): void;
  getOrderKey(): number[];
  hasController(): boolean;
  getController(): Controller;
  setController(controller?: Controller): void;
  getGraph(): Graph;
  getParent(): GraphElement;
  hasParent(): boolean;
  setParent(parent: GraphElement | undefined): void;
  getId(): string;
  setId(id: string): void;
  getType(): string;
  setType(type: string): void;
  setVisible(visible: boolean): void;
  isVisible(): boolean;
  getData(): D | undefined;
  setData(data: D | undefined): void;
  getChildren(): GraphElement[];
  insertChild(child: GraphElement, index: number): void;
  appendChild(child: GraphElement): void;
  removeChild(child: GraphElement): void;
  remove(): void;
  setModel(model: E): void;
  toModel(): ElementModel;
  raise(): void;
  getStyle<T extends {}>(): T;
  translateToAbsolute(t: Translatable): void;
  translateFromAbsolute(t: Translatable): void;
  translateToParent(t: Translatable): void;
  translateFromParent(t: Translatable): void;
}

export interface Node<E extends NodeModel = NodeModel, D = any> extends GraphElement<E, D> {
  getAnchor(end: AnchorEnd, type?: string): Anchor;
  setAnchor(anchor: Anchor, end?: AnchorEnd, type?: string): void;
  getNodes(): Node[];
  // TODO return an immutable bounds, position, dimensions?
  getBounds(): Rect;
  setBounds(bounds: Rect): void;
  getPosition(): Point;
  setPosition(location: Point): void;
  getDimensions(): Dimensions;
  setDimensions(dimensions: Dimensions): void;
  isGroup(): boolean;
  setGroup(group: boolean): void;
  isCollapsed(): boolean;
  setCollapsed(collapsed: boolean): void;
  getLabelPosition(): LabelPosition;
  setLabelPosition(position: LabelPosition): void;
  getNodeShape(): NodeShape;
  setNodeShape(shape: NodeShape): void;
  getNodeStatus(): NodeStatus;
  setNodeStatus(shape: NodeStatus): void;
  getSourceEdges(): Edge[];
  getTargetEdges(): Edge[];
  getAllNodeChildren(leafOnly?: boolean): Node[]; // Return all children regardless of collapse status or child groups' collapsed status
  getPositionableChildren(): Node[]; // Return all children that can be positioned (collapsed groups are positionable)
  isDimensionsInitialized(): boolean;
  isPositioned(): boolean;
}

export interface Edge<E extends EdgeModel = EdgeModel, D = any> extends GraphElement<E, D> {
  getSource(): Node;
  setSource(source: Node): void;
  getTarget(): Node;
  getEdgeStyle(): EdgeStyle;
  setEdgeStyle(edgeStyle: EdgeStyle): void;
  getEdgeAnimationSpeed(): EdgeAnimationSpeed;
  setEdgeAnimationSpeed(speed: EdgeAnimationSpeed): void;
  setTarget(target: Node): void;
  getSourceAnchorNode(): Node;
  getTargetAnchorNode(): Node;
  getStartPoint(): Point;
  setStartPoint(x?: number, y?: number): void;
  getEndPoint(): Point;
  setEndPoint(x?: number, y?: number): void;
  getBendpoints(): Point[];
  setBendpoints(points: Point[]): void;
  removeBendpoint(point: Point | number): void;
}

export interface Graph<E extends GraphModel = GraphModel, D = any> extends GraphElement<E, D> {
  getNodes(): Node[];
  getEdges(): Edge[];
  getBounds(): Rect;
  setBounds(bounds: Rect): void;
  getPosition(): Point;
  setPosition(location: Point): void;
  getDimensions(): Dimensions;
  setDimensions(dimensions: Dimensions): void;
  getScaleExtent(): ScaleExtent;
  setScaleExtent(scaleExtent: ScaleExtent): void;
  getScale(): number;
  setScale(scale: number): void;
  setDetailsLevelThresholds(settings: ScaleDetailsThresholds | undefined): void;
  getDetailsLevelThresholds(): Readonly<ScaleDetailsThresholds> | undefined;
  getDetailsLevel(): ScaleDetailsLevel;
  getLayout(): string | undefined;
  setLayout(type: string | undefined): void;
  layout(): void;
  getLayoutOptions?: () => LayoutOptions;
  getLayers(): string[];
  setLayers(layers: string[]): void;

  // viewport operations
  reset(): void;
  scaleBy(scale: number, location?: Point): void;
  fit(padding?: number, node?: Node): void;
  centerInView(nodeElement: Node): void;
  panIntoView(element: Node, options?: { offset?: number; minimumVisible?: number }): void;
  zoomToSelection(startPoint: Point, endPoint: Point): void;
  nodesInSelection(startPoint: Point, endPoint: Point): Node[];
  isNodeInView(element: Node, options?: { padding: number }): boolean;
  expandAll(): void;
  collapseAll(): void;
}

export const isGraph = (element: GraphElement): element is Graph => element && element.getKind() === ModelKind.graph;

export const isNode = (element: GraphElement): element is Node => element && element.getKind() === ModelKind.node;

export const isEdge = (element: GraphElement): element is Edge => element && element.getKind() === ModelKind.edge;

export type EventListener<Args extends any[] = any[]> = (...args: Args) => void;

export interface State {
  [key: string]: any;
}

export interface WithState {
  getState<S extends {} = {}>(): S;
  setState(state: State): void;
}

export type LayoutFactory = (type: string, graph: Graph) => Layout | undefined;

export type ComponentFactory = (
  kind: ModelKind,
  type: string
) => ComponentType<{ element: GraphElement | Graph | Edge | Node }> | undefined;

export type ElementFactory = (kind: ModelKind, type: string) => GraphElement | undefined;

export interface Controller extends WithState {
  getStore<S extends {} = {}>(): S;
  fromModel(model: Model, merge?: boolean): void;
  toModel(): Model;
  hasGraph(): boolean;
  getGraph(): Graph;
  setGraph(graph: Graph): void;
  getLayout(type: string | undefined): Layout | undefined;
  setFitToScreenOnLayout(fitToScreen: boolean, padding?: number): void;
  getElementById(id: string): GraphElement | undefined;
  getNodeById(id: string): Node | undefined;
  getEdgeById(id: string): Edge | undefined;
  addElement(element: GraphElement): void;
  removeElement(element: GraphElement): void;
  getComponent(kind: ModelKind, type: string): ComponentType<{ element: GraphElement | Graph | Edge | Node }>;
  registerLayoutFactory(factory: LayoutFactory): void;
  registerComponentFactory(factory: ComponentFactory): void;
  registerElementFactory(factory: ElementFactory): void;
  addEventListener<L extends EventListener = EventListener>(type: string, listener: L): Controller;
  removeEventListener(type: string, listener: EventListener): Controller;
  fireEvent(type: string, ...args: any): void;
  getElements(): GraphElement[];
  setRenderConstraint(constrained: boolean, viewPadding?: ViewPaddingSettings): void;
  shouldRenderNode(node: Node): boolean;
}

export interface ElementEvent {
  target: GraphElement;
}
export type ElementVisibilityChangeEvent = ElementEvent & { visible: boolean };

export type ElementChildEventListener = EventListener<[ElementEvent & { child: GraphElement }]>;
export type ElementVisibilityChangeEventListener = EventListener<[ElementVisibilityChangeEvent]>;

export type NodeCollapseChangeEventListener = EventListener<[{ node: Node }]>;

export type GraphLayoutEndEventListener = EventListener<[{ graph: Graph }]>;

export type ModifierKey = 'ctrlKey' | 'shiftKey' | 'altKey';

export type GraphAreaDraggingEvent = EventListener<[{ graph: Graph; isDragging: boolean }]>;
export type GraphAreaSelectedEventListener = EventListener<
  [{ graph: Graph; modifier: ModifierKey; startPoint: Point; endPoint: Point }]
>;

export const ADD_CHILD_EVENT = 'element-add-child';
export const ELEMENT_VISIBILITY_CHANGE_EVENT = 'element-visibility-change';
export const REMOVE_CHILD_EVENT = 'element-remove-child';
export const NODE_COLLAPSE_CHANGE_EVENT = 'node-collapse-change';
export const NODE_POSITIONED_EVENT = 'node-positioned';
export const GRAPH_LAYOUT_END_EVENT = 'graph-layout-end';
export const GRAPH_POSITION_CHANGE_EVENT = 'graph-position-change';
export const GRAPH_AREA_DRAGGING_EVENT = 'graph-area-dragging';
export const GRAPH_AREA_SELECTED_EVENT = 'graph-area-selected';
