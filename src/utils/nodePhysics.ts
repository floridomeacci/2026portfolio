import { type Node } from '@vue-flow/core';

interface PhysicsState {
  nodeId: string;
  velocityX: number;
  velocityY: number;
  isDragging: boolean;
  lastX: number;
  lastY: number;
  lastTime: number;
  rotation: number;
  targetRotation: number;
  throwTime: number;
}

const physicsStates = new Map<string, PhysicsState>();
const FRICTION = 0.95;
const MIN_VELOCITY = 0.5;
const THROW_MULTIPLIER = 2.4;
const ROTATION_EASING = 0.15;
const MAX_VELOCITY = 4500;
const GRAVITY = 800;
const GRAVITY_DURATION = 2000;
const THROW_VELOCITY_THRESHOLD = 400;
const COLLISION_RESTITUTION = 0.7;
const COLLISION_TRANSFER = 0.6;

let animationFrameId: number | null = null;
let allNodes: Node[] = [];

export function enableNodePhysics() {
  if (animationFrameId === null) {
    animationFrameId = requestAnimationFrame(updatePhysics);
  }
}

export function disableNodePhysics() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  physicsStates.clear();
  allNodes = [];
}

export function updateAllNodes(nodes: Node[]) {
  allNodes = nodes;
}

export function startNodeDrag(nodeId: string, x: number, y: number) {
  const existing = physicsStates.get(nodeId);
  physicsStates.set(nodeId, {
    nodeId,
    velocityX: 0,
    velocityY: 0,
    isDragging: true,
    lastX: x,
    lastY: y,
    lastTime: Date.now(),
    rotation: existing?.rotation || 0,
    targetRotation: existing?.targetRotation || 0,
    throwTime: 0
  });
}

export function updateNodeDrag(nodeId: string, x: number, y: number) {
  const state = physicsStates.get(nodeId);
  if (!state || !state.isDragging) return;

  const now = Date.now();
  const deltaTime = Math.max((now - state.lastTime) / 1000, 0.016);

  if (deltaTime > 0 && deltaTime < 0.1) {
    const deltaX = x - state.lastX;
    const deltaY = y - state.lastY;

    const newVelX = deltaX / deltaTime;
    const newVelY = deltaY / deltaTime;

    state.velocityX = newVelX * 0.3 + state.velocityX * 0.7;
    state.velocityY = newVelY * 0.3 + state.velocityY * 0.7;
    state.lastX = x;
    state.lastY = y;
    state.lastTime = now;
  }
}

export function endNodeDrag(nodeId: string) {
  const state = physicsStates.get(nodeId);
  if (!state) return;

  state.isDragging = false;

  const speed = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);

  if (speed > THROW_VELOCITY_THRESHOLD) {
    state.throwTime = Date.now();
    state.velocityX *= THROW_MULTIPLIER;
    state.velocityY *= THROW_MULTIPLIER;

    const finalSpeed = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);
    if (finalSpeed > MAX_VELOCITY) {
      const scale = MAX_VELOCITY / finalSpeed;
      state.velocityX *= scale;
      state.velocityY *= scale;
    }

    const angle = Math.atan2(state.velocityY, state.velocityX);
    state.targetRotation = (angle * 180 / Math.PI) + 90;
  } else {
    state.velocityX = 0;
    state.velocityY = 0;
    physicsStates.delete(nodeId);
  }
}

function checkCollision(node1: Node, node2: Node): boolean {
  const width1 = (node1.dimensions?.width || 240);
  const height1 = (node1.dimensions?.height || 80);
  const width2 = (node2.dimensions?.width || 240);
  const height2 = (node2.dimensions?.height || 80);

  const dx = (node1.position.x + width1 / 2) - (node2.position.x + width2 / 2);
  const dy = (node1.position.y + height1 / 2) - (node2.position.y + height2 / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minDistance = (Math.max(width1, height1) + Math.max(width2, height2)) / 4;

  return distance < minDistance;
}

function handleCollision(state1: PhysicsState, node1: Node, node2: Node) {
  const state2 = physicsStates.get(node2.id);

  const width1 = (node1.dimensions?.width || 240);
  const height1 = (node1.dimensions?.height || 80);
  const width2 = (node2.dimensions?.width || 240);
  const height2 = (node2.dimensions?.height || 80);

  const dx = (node1.position.x + width1 / 2) - (node2.position.x + width2 / 2);
  const dy = (node1.position.y + height1 / 2) - (node2.position.y + height2 / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance === 0) return;

  const nx = dx / distance;
  const ny = dy / distance;

  const relativeVelX = state1.velocityX - (state2?.velocityX || 0);
  const relativeVelY = state1.velocityY - (state2?.velocityY || 0);
  const velocityAlongNormal = relativeVelX * nx + relativeVelY * ny;

  if (velocityAlongNormal > 0) return;

  const impulse = -(1 + COLLISION_RESTITUTION) * velocityAlongNormal;

  state1.velocityX += impulse * nx;
  state1.velocityY += impulse * ny;

  if (state2 && !state2.isDragging) {
    state2.velocityX -= impulse * nx * COLLISION_TRANSFER;
    state2.velocityY -= impulse * ny * COLLISION_TRANSFER;
    state2.throwTime = Date.now();
  } else if (!state2) {
    const transferSpeed = Math.sqrt(
      (impulse * nx * COLLISION_TRANSFER) ** 2 +
      (impulse * ny * COLLISION_TRANSFER) ** 2
    );

    if (transferSpeed > THROW_VELOCITY_THRESHOLD * 0.5) {
      physicsStates.set(node2.id, {
        nodeId: node2.id,
        velocityX: -impulse * nx * COLLISION_TRANSFER,
        velocityY: -impulse * ny * COLLISION_TRANSFER,
        isDragging: false,
        lastX: node2.position.x,
        lastY: node2.position.y,
        lastTime: Date.now(),
        rotation: 0,
        targetRotation: Math.atan2(-impulse * ny, -impulse * nx) * 180 / Math.PI + 90,
        throwTime: Date.now()
      });
    }
  }
}

function updatePhysics() {
  const toRemove: string[] = [];
  const deltaTime = 1 / 60;
  const now = Date.now();

  physicsStates.forEach((state, nodeId) => {
    if (state.isDragging) return;

    const speed = Math.sqrt(state.velocityX ** 2 + state.velocityY ** 2);

    if (speed < MIN_VELOCITY) {
      toRemove.push(nodeId);
      return;
    }

    state.velocityX *= FRICTION;
    state.velocityY *= FRICTION;

    const timeSinceThrow = now - state.throwTime;
    if (timeSinceThrow < GRAVITY_DURATION) {
      const gravityStrength = 1 - (timeSinceThrow / GRAVITY_DURATION);
      state.velocityY += GRAVITY * deltaTime * gravityStrength;
    }

    const currentNode = allNodes.find(n => n.id === nodeId);
    if (currentNode) {
      for (const otherNode of allNodes) {
        if (otherNode.id !== nodeId && checkCollision(currentNode, otherNode)) {
          handleCollision(state, currentNode, otherNode);
        }
      }
    }

    const angle = Math.atan2(state.velocityY, state.velocityX);
    state.targetRotation = (angle * 180 / Math.PI) + 90;

    const rotationDiff = state.targetRotation - state.rotation;
    const normalizedDiff = ((rotationDiff + 180) % 360) - 180;
    state.rotation += normalizedDiff * ROTATION_EASING;
  });

  toRemove.forEach(nodeId => physicsStates.delete(nodeId));

  animationFrameId = requestAnimationFrame(updatePhysics);
}

export function getNodeVelocity(nodeId: string): { x: number; y: number; rotation: number } | null {
  const state = physicsStates.get(nodeId);
  if (!state || state.isDragging) return null;

  return {
    x: state.velocityX,
    y: state.velocityY,
    rotation: state.rotation
  };
}

export function applyPhysicsToNode(
  node: Node,
  updateCallback: (nodeId: string, position: { x: number; y: number }, rotation: number) => void
) {
  const velocity = getNodeVelocity(node.id);
  if (!velocity) return;

  const deltaTime = 1 / 60;
  const newX = node.position.x + velocity.x * deltaTime;
  const newY = node.position.y + velocity.y * deltaTime;

  updateCallback(node.id, { x: newX, y: newY }, velocity.rotation);
}
