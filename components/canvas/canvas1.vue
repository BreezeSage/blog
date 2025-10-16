<script setup lang="ts">
import { ref, onMounted } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
onMounted(() => {
  if (canvas.value) {
    const context = canvas.value.getContext('2d')
    const width = canvas.value.width
    const height = canvas.value.height

    const data = [{
      x: 800,
      y: 180,
      width: 300,
      height: 180,
      color: 'deepskyblue'
    }, {
      x: 600,
      y: 680,
      width: 320,
      height: 100,
      color: 'deeppink'
    }, {
      x: 300,
      y: 280,
      width: 320,
      height: 100,
      color: 'orange'
    }];

    // 拖拽数据存储
    const store: Record<string, any> = {};

    // 绘制矩形方法
    const drawRect = function () {
      data.forEach(function (obj) {
        context.beginPath();
        context.fillStyle = obj.color;
        context.fillRect(obj.x, obj.y, obj.width, obj.height);
        context.closePath();
      });
    };

    // 绘制连接曲线方法
    const drawCurve = function () {
      // 按照坐标位置排序
      // const dataSort = data.sort(function (objA, objB) {
      //   return (objA.y + objA.height) - (objB.y + objB.height);
      // });
      // 知道上下数据
      // const from = dataSort[0];
      // const to = dataSort[1];
      const dataSort = data.map(function (item) {
        return {
          ...item,
          complute: [
            {
              x: item.x + item.width/2,
              y: item.y,
            },
            {
              x: item.x + item.width,
              y: item.y + item.height/2,
            },
            {
              x: item.x + item.width/2,
              y: item.y + item.height,
            },
            {
              x: item.x,
              y: item.y + item.height/2,
            }
          ]
        }
      })

      let v = Number.MAX_VALUE
      let lines: any[] = []
      dataSort.reduce((from, to) => {
        if (from) {
          let line: any[] = []
          console.log("----")
          // 双重循环
          for (let x = 0; x < from.complute.length; x++) {
            const item1 = from.complute[x]
            for (let y = 0; y < to.complute.length; y++) {
              const item2 = to.complute[y]
              const value = Math.pow(item2.x - item1.x, 2) + Math.pow(item2.y - item1.y, 2)
              console.log("value", value)
              if (value < v) {
                v = value
                line = [{
                  ...item1,
                  width: from.width,
                  height: from.height,
                }, {
                  ...item2,
                  width: to.width,
                  height: to.height,
                }]
              }
            }
          }
          console.log(v)
          lines.push(line)
          v = Number.MAX_VALUE
        }
        return to;
      }, null)

      lines.forEach((arr) => {
      const [from, to] = arr
          console.log(from, to)
          // 曲线的起点终点
        const fromX = from.x;
        const fromY = from.y;
        const toX = to.x;
        const toY = to.y;
          // const fromX = from.x + from.width / 2;
          // const fromY = from.y + from.height;
          // const toX = to.x + to.width / 2;
          // const toY = to.y;

          // 曲线控制点坐标
          const cp1x = fromX;
          const cp1y = fromY + (toY - fromY) / 2;

          const cp2x = toX;
          const cp2y = toY - (toY - fromY) / 2;

          // 开始绘制曲线
          context.beginPath();
          context.lineWidth = 4;
          context.strokeStyle = '#000';
          context.moveTo(fromX, fromY);
          // 绘制曲线点
        context.b
          context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, toX, toY);
          context.stroke();

      });
    };

    // 绘制方法
    const draw = function () {
      context.clearRect(0, 0, width, height);

      drawRect();
      drawCurve();
    };

    draw();

    // 是否在矩形内
    const isPointInSquare = function (x, y) {
      // store.isPointInA = false;
      store.index = -1
      // store.isPointInB = false;
      // // 两个矩形的绘制数据
      data.some(function (obj, index) {
        if (!(x < obj.x || x > obj.x + obj.width || y < obj.y || y > obj.y + obj.height)) {
          console.log(index)
          return store.index = index;
          // return store['isPointIn' + ['A', 'B'][index]] = true;
        }
      });
    };

    // 拖拽方块
    canvas.value.addEventListener('pointerdown', function (event) {
      // 判断坐标是否在图形之内
      const clientX = event.clientX;
      const clientY = event.clientY;
      // canvas 画布的偏移
      const bound = this.getBoundingClientRect();
      // 点击坐标
      const clickX = clientX - bound.left;
      const clickY = clientY - bound.top;
      // 缩放比例
      const scaleX = width / bound.width;
      const scaleY = height / bound.height;
      // 转换为canvas坐标
      const x = clickX * scaleX;
      const y = clickY * scaleY;

      // 此时可以判断是不是在范围内了
      // 这里的图形比较简单，就不使用 isPointInPath 方法判断了
      isPointInSquare(x, y);
      // 记住位置
      store.clientX = clientX;
      store.clientY = clientY;
      if (store.index === -1) return
      // 目标元素
      store.dataMatch = data[store.index];
      // 记住初始位置
      store.originX = store.dataMatch.x;
      store.originY = store.dataMatch.y;
      // 记住缩放比例
      store.scaleX = scaleX;
      store.scaleY = scaleY;
    });
    canvas.value.addEventListener('pointermove', function (event) {
      if (store.index === -1) {
        return;
      }

      event.preventDefault();
      // 需要移动的坐标
      const dataMatch = store.dataMatch;
      // 此时的偏移大小
      const distanceX = (event.clientX - store.clientX) * store.scaleX;
      const distanceY = (event.clientY - store.clientY) * store.scaleY;

      dataMatch.x = store.originX + distanceX;
      dataMatch.y = store.originY + distanceY;

      // 边界判断
      if (dataMatch.x < 0) {
        dataMatch.x = 0;
      } else if (dataMatch.x + dataMatch.width > width) {
        dataMatch.x = width - dataMatch.width;
      }

      if (dataMatch.y < 0) {
        dataMatch.y = 0;
      } else if (dataMatch.y + dataMatch.height > height) {
        dataMatch.y = height - dataMatch.height;
      }
      // 重新绘制
      draw();
    }, {
      passive: false
    });
    canvas.value.addEventListener('pointerup', function () {
      // store.isPointInA = store.isPointInB = false;
      store.index = -1;
    });
  }
})

</script>

<template>
  <canvas :class="$style.canvas" ref="canvas" width="1200" height="1200"></canvas>
</template>

<style module>
.canvas {
  display: block;
  width: 100%;
  height: 600px;
  background: conic-gradient(#eee 25%, white 0deg 50%, #eee 0deg 75%, white 0deg) 0 / 20px 20px;
  margin-inline: auto;
}
</style>