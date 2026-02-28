import { type Node, type Edge } from '@vue-flow/core';

interface ViewportInfo {
  x: number;
  y: number;
  zoom: number;
  width: number;
  height: number;
}

const BUFFER_MULTIPLIER = 1.5;

export function isNodeInViewport(node: Node, viewport: ViewportInfo): boolean {
  const nodeWidth = node.dimensions?.width || 240;
  const nodeHeight = node.dimensions?.height || 80;

  const bufferWidth = viewport.width * BUFFER_MULTIPLIER;
  const bufferHeight = viewport.height * BUFFER_MULTIPLIER;

  const viewportLeft = -viewport.x / viewport.zoom - (bufferWidth - viewport.width) / 2;
  const viewportTop = -viewport.y / viewport.zoom - (bufferHeight - viewport.height) / 2;
  const viewportRight = viewportLeft + bufferWidth / viewport.zoom;
  const viewportBottom = viewportTop + bufferHeight / viewport.zoom;

  const nodeRight = node.position.x + nodeWidth;
  const nodeBottom = node.position.y + nodeHeight;

  return !(
    node.position.x > viewportRight ||
    nodeRight < viewportLeft ||
    node.position.y > viewportBottom ||
    nodeBottom < viewportTop
  );
}

export function filterVisibleNodes(nodes: Node[], edges: Edge[], viewport: ViewportInfo): Node[] {
  const visibleNodeIds = new Set<string>();

  nodes.forEach(node => {
    if (isNodeInViewport(node, viewport)) {
      visibleNodeIds.add(node.id);
    }
  });

  edges.forEach(edge => {
    const sourceVisible = visibleNodeIds.has(edge.source);
    const targetVisible = visibleNodeIds.has(edge.target);

    if (sourceVisible && !targetVisible) {
      visibleNodeIds.add(edge.target);
    } else if (targetVisible && !sourceVisible) {
      visibleNodeIds.add(edge.source);
    }
  });

  return nodes.filter(node => visibleNodeIds.has(node.id));
}
