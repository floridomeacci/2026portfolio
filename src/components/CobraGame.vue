<template>
  <div class="node-wrapper" @click="handleNodeClick">
    <div v-if="!isActivated" class="car-placeholder">
      <div
        class="car-sprite-node grayscale-sprite"
        :style="{
          backgroundImage: 'url(/images/cobra%20copy.png)',
          backgroundPosition: getIdleSpritePosition()
        }"
      ></div>
      <div class="placeholder-overlay">
        <span>Connect to activate</span>
      </div>
      <Handle type="target" :position="Position.Left" class="node-handle handle-target" />
      <Handle type="source" :position="Position.Right" class="node-handle handle-source" />
    </div>

    <div v-else class="car-node-container">
      <div
        class="car-sprite-node"
        :style="{
          backgroundImage: 'url(/images/cobra%20copy.png)',
          backgroundPosition: getSpritePosition()
        }"
      ></div>
      <Handle type="target" :position="Position.Left" class="node-handle handle-target" />
      <Handle type="source" :position="Position.Right" class="node-handle handle-source" />
    </div>
  </div>

</template>

<script setup lang="ts">
import { ref, onUnmounted, inject, type Ref, computed, watch } from 'vue';
import { Handle, Position, type Node, useVueFlow } from '@vue-flow/core';

const { updateNode, findNode, addNodes, removeNodes } = useVueFlow();

const props = defineProps<{
  allNodes: Node[],
  nodeId: string,
  data: {
    label: string;
    status?: 'idle' | 'success' | 'error' | 'active';
  };
  id: string;
}>();

const emit = defineEmits<{
  nodeClick: [nodeId: string];
}>();

const isDark = inject<Ref<boolean>>('isDarkMode');

const isActivated = ref(false);
const isMoving = ref(false);
const carRotation = ref(0);
const currentDirection = ref(1);
const bullets = ref<Array<{ id: string; targetX: number; targetY: number; startX: number; startY: number; startTime: number; distance: number }>>([]);
let animationFrame: number | null = null;
let lastTime = 0;
const speed = 120;
const orbitDistance = 200;
let bulletIdCounter = 0;
let lastShootTime = 0;
const shootInterval = 300;
let targetNode: { x: number; y: number } | null = null;
let orbitAngle = 0;
let lockedTarget: { x: number; y: number; element: Element; nodeId: string } | null = null;
let spawnTime = 0;
const attackDuration = 20000;
let currentTargetIndex = 0;
let lastTargetSwitch = 0;
let isPaused = false;
let pausedTime = 0;
const targets = ['<COBRA>1<COBRA>', '<COBRA>2<COBRA>', '<COBRA>3<COBRA>', '<COBRA>4<COBRA>', '<COBRA>5<COBRA>', '<COBRA>6<COBRA>', '<COBRA>7<COBRA>', '<COBRA>8<COBRA>', '<COBRA>9<COBRA>', '<COBRA>10<COBRA>', '<COBRA>11<COBRA>', '<COBRA>12<COBRA>'];

const directionMap: { [key: number]: { row: number; col: number } } = {
  0: { row: 1, col: 2 },     // right (frame 6)
  45: { row: 2, col: 2 },    // bottom-right (frame 9)
  90: { row: 2, col: 1 },    // bottom (frame 8)
  135: { row: 2, col: 0 },   // bottom-left (frame 7)
  180: { row: 1, col: 0 },   // left (frame 4)
  225: { row: 0, col: 0 },   // top-left (frame 1)
  270: { row: 0, col: 1 },   // top (frame 2)
  315: { row: 0, col: 2 }    // top-right (frame 3)
};

const getSpritePosition = () => {
  const normalizedRotation = ((carRotation.value % 360) + 360) % 360;
  let closestAngle = 0;
  let minDiff = 360;

  for (const angle of Object.keys(directionMap).map(Number)) {
    const diff = Math.abs(normalizedRotation - angle);
    if (diff < minDiff) {
      minDiff = diff;
      closestAngle = angle;
    }
  }

  const { row, col } = directionMap[closestAngle];
  const x = col * 50;
  const y = row * 50;

  return `${x}% ${y}%`;
};

const getIdleSpritePosition = () => {
  return '100% 50%';
};

const handleNodeClick = () => {
  emit('nodeClick', props.id);

  if (!isActivated.value) {
    return;
  }

  toggleMovement();
};

const activateCobra = () => {
  isActivated.value = true;
  console.log('Cobra node activated!');

  isMoving.value = true;
  isPaused = false;
  carRotation.value = Math.random() * 360;
  lockedTarget = null;
  currentTargetIndex = 0;
  lastTargetSwitch = performance.now();
  lastTime = performance.now();
  spawnTime = performance.now();

  console.log('Cobra hunting started!');
  animate(performance.now());
};

const toggleMovement = () => {
  if (isMoving.value) {
    if (isPaused) {
      isPaused = false;
      const now = performance.now();
      const pauseDuration = now - pausedTime;
      lastTime += pauseDuration;
      lastTargetSwitch += pauseDuration;
      lastShootTime += pauseDuration;
      spawnTime += pauseDuration;

      bullets.value.forEach(bullet => {
        bullet.startTime += pauseDuration;
      });

      console.log('Cobra resumed!');
      animate(now);
    } else {
      isPaused = true;
      pausedTime = performance.now();
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      console.log('Cobra paused!');
    }
  }
};

let searchAttempted = false;

const lockOntoTarget = () => {
  if (lockedTarget) {
    return;
  }

  if (searchAttempted) {
    return;
  }

  searchAttempted = true;
  const currentTarget = targets[currentTargetIndex];

  const targetNode = props.allNodes.find(node => {
    const notes = (node.data as any).notes || '';
    return notes.includes(currentTarget) && node.id !== props.nodeId;
  });

  if (targetNode) {
    lockedTarget = { x: targetNode.position.x + 48, y: targetNode.position.y + 48, element: document.body, nodeId: targetNode.id };
    console.log(`Locked onto ${currentTarget}!`);
  } else {
    console.log(`Target ${currentTarget} not found, skipping to next...`);
    currentTargetIndex++;
    lastTargetSwitch = performance.now();
    searchAttempted = false;
  }
};

const getTargetPosition = () => {
  if (lockedTarget) {
    return { x: lockedTarget.x, y: lockedTarget.y };
  }
  return null;
};

const animate = (currentTime: number) => {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  const currentNode = findNode(props.nodeId);
  if (!currentNode) {
    console.error('Could not find node!');
    return;
  }

  if (currentTime - lastTargetSwitch >= attackDuration) {
    if (lockedTarget) {
      removeNodes([lockedTarget.nodeId]);
      console.log(`Target destroyed!`);
    }

    currentTargetIndex++;
    if (currentTargetIndex >= targets.length) {
      bullets.value = [];
      lockedTarget = null;
      console.log('All targets destroyed! Entering free roam mode...');

      // Continue to freeRoamAnimate
      animationFrame = requestAnimationFrame(freeRoamAnimate);
      return;
    }
    lockedTarget = null;
    searchAttempted = false;
    lastTargetSwitch = currentTime;
    console.log(`Switching to next target...`);
  }

  lockOntoTarget();
  targetNode = getTargetPosition();

  const currentPos = { x: currentNode.position.x + 48, y: currentNode.position.y + 48 };

  if (targetNode) {
    const dx = targetNode.x - currentPos.x;
    const dy = targetNode.y - currentPos.y;
    const dist = Math.hypot(dx, dy);

    if (dist > orbitDistance) {
      const angle = Math.atan2(dy, dx);
      const targetAngle = (angle * 180) / Math.PI;
      const angleDiff = targetAngle - carRotation.value;
      const normalizedDiff = ((angleDiff + 180) % 360) - 180;
      carRotation.value += normalizedDiff * deltaTime * 3;

      const newX = currentNode.position.x + Math.cos(angle) * speed * deltaTime;
      const newY = currentNode.position.y + Math.sin(angle) * speed * deltaTime;
      updateNode(props.nodeId, { position: { x: newX, y: newY } });
    } else {
      orbitAngle += deltaTime * 1.5;
      const orbitX = targetNode.x + Math.cos(orbitAngle) * orbitDistance;
      const orbitY = targetNode.y + Math.sin(orbitAngle) * orbitDistance;

      const toOrbitX = orbitX - currentPos.x;
      const toOrbitY = orbitY - currentPos.y;
      const angleToOrbit = Math.atan2(toOrbitY, toOrbitX);
      const targetAngle = (angleToOrbit * 180) / Math.PI;
      const angleDiff = targetAngle - carRotation.value;
      const normalizedDiff = ((angleDiff + 180) % 360) - 180;
      carRotation.value += normalizedDiff * deltaTime * 3;

      const newX = currentNode.position.x + Math.cos(angleToOrbit) * speed * deltaTime * 0.3;
      const newY = currentNode.position.y + Math.sin(angleToOrbit) * speed * deltaTime * 0.3;
      updateNode(props.nodeId, { position: { x: newX, y: newY } });
    }
  }

  if (currentTime - lastShootTime > shootInterval && lockedTarget) {
    const bulletId = `bullet-${props.nodeId}-${bulletIdCounter++}`;
    const distance = Math.hypot(lockedTarget.x - currentPos.x, lockedTarget.y - currentPos.y);

    const bulletNode: Node = {
      id: bulletId,
      type: 'bullet',
      position: { x: currentPos.x, y: currentPos.y },
      data: {},
      draggable: false,
      selectable: false,
      connectable: false
    };

    addNodes([bulletNode]);

    bullets.value.push({
      id: bulletId,
      targetX: lockedTarget.x,
      targetY: lockedTarget.y,
      startX: currentPos.x,
      startY: currentPos.y,
      startTime: currentTime,
      distance: distance
    });

    lastShootTime = currentTime;
  }

  const bulletSpeed = 500;
  const toRemove: string[] = [];
  const toUpdate: Array<{ id: string; x: number; y: number }> = [];

  for (let i = bullets.value.length - 1; i >= 0; i--) {
    const bullet = bullets.value[i];
    const elapsed = currentTime - bullet.startTime;
    const duration = (bullet.distance / bulletSpeed) * 1000;
    const progress = Math.min(elapsed / duration, 1);

    if (progress >= 1) {
      toRemove.push(bullet.id);
      bullets.value.splice(i, 1);

      if (lockedTarget) {
        const targetNodeId = props.allNodes.find(node => {
          const pos = { x: node.position.x + 48, y: node.position.y + 48 };
          return Math.hypot(pos.x - lockedTarget.x, pos.y - lockedTarget.y) < 10;
        })?.id;

        if (targetNodeId) {
          const targetNode = findNode(targetNodeId);
          if (targetNode) {
            const shakeOffset = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
            updateNode(targetNodeId, {
              position: {
                x: targetNode.position.x + shakeOffset.x,
                y: targetNode.position.y + shakeOffset.y
              }
            });

            setTimeout(() => {
              const node = findNode(targetNodeId);
              if (node) {
                updateNode(targetNodeId, {
                  position: {
                    x: node.position.x - shakeOffset.x,
                    y: node.position.y - shakeOffset.y
                  }
                });
              }
            }, 50);
          }
        }
      }
    } else {
      const newX = bullet.startX + (bullet.targetX - bullet.startX) * progress;
      const newY = bullet.startY + (bullet.targetY - bullet.startY) * progress;
      toUpdate.push({ id: bullet.id, x: newX, y: newY });
    }
  }

  if (toRemove.length > 0) {
    removeNodes(toRemove);
  }

  for (const update of toUpdate) {
    updateNode(update.id, { position: { x: update.x, y: update.y } });
  }

  animationFrame = requestAnimationFrame(animate);
};

let randomTarget = { x: 0, y: 0 };
let lastRandomTargetTime = 0;
const randomTargetInterval = 3000;

const freeRoamAnimate = (currentTime: number) => {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  const currentNode = findNode(props.nodeId);
  if (!currentNode) {
    console.error('Could not find node!');
    return;
  }

  // Generate new random target every few seconds
  if (currentTime - lastRandomTargetTime >= randomTargetInterval) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    randomTarget = {
      x: Math.random() * viewportWidth,
      y: Math.random() * viewportHeight
    };
    lastRandomTargetTime = currentTime;
  }

  const currentPos = { x: currentNode.position.x + 48, y: currentNode.position.y + 48 };
  const dx = randomTarget.x - currentPos.x;
  const dy = randomTarget.y - currentPos.y;
  const dist = Math.hypot(dx, dy);

  if (dist > 50) {
    // Move towards random target
    const angle = Math.atan2(dy, dx);
    const targetAngle = (angle * 180) / Math.PI;
    const angleDiff = targetAngle - carRotation.value;
    const normalizedDiff = ((angleDiff + 180) % 360) - 180;
    carRotation.value += normalizedDiff * deltaTime * 3;

    const newX = currentNode.position.x + Math.cos(angle) * speed * deltaTime;
    const newY = currentNode.position.y + Math.sin(angle) * speed * deltaTime;
    updateNode(props.nodeId, { position: { x: newX, y: newY } });
  } else {
    // Circle around the target
    orbitAngle += deltaTime * 1.5;
    const circleRadius = 100;
    const orbitX = randomTarget.x + Math.cos(orbitAngle) * circleRadius;
    const orbitY = randomTarget.y + Math.sin(orbitAngle) * circleRadius;

    const toOrbitX = orbitX - currentPos.x;
    const toOrbitY = orbitY - currentPos.y;
    const angleToOrbit = Math.atan2(toOrbitY, toOrbitX);
    const targetAngle = (angleToOrbit * 180) / Math.PI;
    const angleDiff = targetAngle - carRotation.value;
    const normalizedDiff = ((angleDiff + 180) % 360) - 180;
    carRotation.value += normalizedDiff * deltaTime * 3;

    const newX = currentNode.position.x + Math.cos(angleToOrbit) * speed * deltaTime * 0.3;
    const newY = currentNode.position.y + Math.sin(angleToOrbit) * speed * deltaTime * 0.3;
    updateNode(props.nodeId, { position: { x: newX, y: newY } });
  }

  animationFrame = requestAnimationFrame(freeRoamAnimate);
};

watch(() => props.data?.status, (newStatus) => {
  if (newStatus === 'active' && !isActivated.value) {
    activateCobra();
  }
}, { immediate: true });

onUnmounted(() => {
  if (animationFrame !== null) {
    cancelAnimationFrame(animationFrame);
  }
});
</script>

<style scoped>
.node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.car-node-container {
  position: relative;
  background: white;
  border: 2px solid #CBD5E1;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dark-mode .car-node-container {
  background: #525252;
  border-color: #6b6b6b;
}

.car-node-container:hover {
  border-color: #94A3B8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transform: scale(1.05);
}

.car-sprite-node {
  width: 60px;
  height: 60px;
  background-size: 300% 300%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.node-handle {
  width: 12px;
  height: 12px;
  border: 2px solid white;
  background: #94A3B8;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.node-handle.handle-source {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.node-handle.handle-target {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.node-handle:hover {
  background: #3B82F6;
  transform: translateY(-50%) scale(1.2);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.cobra-car-canvas {
  position: absolute;
  pointer-events: none;
  z-index: 9999;
  will-change: transform;
}

.car-sprite {
  width: 80px;
  height: 80px;
  background-size: 300% 300%;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.bullet-node-space {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #ef4444;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  box-shadow: 0 0 6px #dc2626;
  transform: translate(-50%, -50%);
}

.car-placeholder {
  position: relative;
  background: white;
  border: 3px dashed #CBD5E1;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: not-allowed;
  transition: all 0.3s ease;
}

.dark-mode .car-placeholder {
  background: #525252;
  border-color: #6b6b6b;
}

.grayscale-sprite {
  opacity: 0.5;
}

.placeholder-overlay {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #64748B;
  white-space: nowrap;
  pointer-events: none;
}

.dark-mode .placeholder-overlay {
  color: #94A3B8;
}
</style>
