<template>
  <div
    class="flow-chart-container"
    ref="flowChartContainer"
    @mousedown="(e) => e.stopPropagation()"
  >
    <v-row
      no-gutter
      v-if="selectedNode"
      no-gutters
      align="center"
      justify="end"
      style="position: absolute; bottom: 50px; right: 0; margin: 12px"
    >
      <v-card class="pa-1" :width="300">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="ma-1">{{ $t("name") }}</v-list-item-title>
            <v-list-item-action class="mx-0 my-1">
              <v-text-field
                v-model="selectedNode.name"
                solo
                dense
                hide-details
                @keydown.enter="rename"
              ></v-text-field>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content class="pt-0">
            <v-list-item-title class="ma-1">{{ $t("type") }}</v-list-item-title>
            <v-list-item-action class="mx-0 my-1">
              <v-select
                v-model="selectedNode.type"
                solo
                dense
                hide-details
                :items="types"
                item-text="name"
                item-value="name"
              >
                <template v-slot:selection="{ item }">
                  <v-list-item-title style="font-size: 0.95rem !important">
                    <v-avatar
                      :color="item.color"
                      size="12"
                      style="margin-right: 6px"
                    ></v-avatar>
                    {{ item.name }}</v-list-item-title
                  >
                </template>
                <template v-slot:item="{ item }">
                  <v-list-item-title style="font-size: 0.95rem !important">
                    <v-avatar
                      :color="item.color"
                      size="12"
                      style="margin-right: 6px"
                    ></v-avatar>
                    {{ item.name }}</v-list-item-title
                  >
                </template>
              </v-select>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>

        <v-row no-gutters class="px-4 pb-4" justify="end">
          <v-btn @click="removeNode" class="mr-2">
            {{ $t("remove") }}
          </v-btn>
          <v-btn
            @click="updateItem"
            :disabled="!selectedNode.name"
            color="primary"
          >
            {{ $t("save") }}
          </v-btn>
        </v-row>
      </v-card>
    </v-row>

    <v-row
      no-gutter
      v-if="selectedLink?.source && selectedLink?.target"
      no-gutters
      align="center"
      justify="end"
      style="position: absolute; bottom: 50px; right: 0; margin: 12px"
    >
      <v-card class="pa-1" :width="300">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="ma-1">{{ $t("in") }}</v-list-item-title>
            <v-list-item-action class="mx-0 my-1">
              <v-text-field
                v-model="selectedLink.source.name"
                solo
                dense
                hide-details
                readonly
              ></v-text-field>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-content class="pt-0">
            <v-list-item-title class="ma-1">{{ $t("out") }}</v-list-item-title>
            <v-list-item-action class="mx-0 my-1">
              <v-text-field
                v-model="selectedLink.target.name"
                solo
                dense
                hide-details
                readonly
              ></v-text-field>
            </v-list-item-action>
          </v-list-item-content>
        </v-list-item>

        <v-row no-gutters class="px-4 pb-4" justify="end">
          <v-btn @click="removeLink" class="mr-2">
            {{ $t("remove") }}
          </v-btn>
          <v-btn
            @click="
              selectedLink = null;
              redraw();
            "
          >
            {{ $t("cancel") }}
          </v-btn>
        </v-row>
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "FlowChart",
  props: {
    items: Array,
  },
  data() {
    return {
      nodeItems: [],
      zoomTransform: this.$d3.zoomIdentity,
      selectedNode: null,
      newLink: null,
      selectedLink: null,
      types: [
        { name: "type1", color: "#4CAF50" },
        { name: "type2", color: "#1E88E5" },
        { name: "type3", color: "#FB8C00" },
        { name: "type4", color: "#757575" },
      ],
    };
  },
  watch: {
    items() {
      this.init();
    },
  },
  mounted() {
    this.init();
    window.addEventListener("keydown", this.keyEvent);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.keyEvent);
  },
  methods: {
    init() {
      this.nodeItems = this.layoutNodes(this.items);
      this.draw(this.nodeItems);
    },

    keyEvent(e) {
      if (e.key === "Escape") {
        this.selectedNode = null;
        this.redraw();
      } else if (e.key === "f" && this.selectedNode) {
        this.focusNode(this.selectedNode);
      } else if (e.key === "Delete") {
        if (this.selectedNode) {
          this.removeNode();
        } else if (this.selectedLink) {
          this.removeLink();
        }
      }
    },

    layoutNodes(items) {
      const levels = {};
      const spacingX = 200;
      const spacingY = 100;

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      const sortedItems = [];
      let queue = [...items];

      while (queue.length > 0) {
        let added = false;

        queue = queue.filter((item) => {
          if (sortedItems.includes(item)) return false;
          if (
            item.in.length > 0 &&
            !item.in.every((n) => sortedItems.some((s) => s.id === n.id))
          ) {
            return true;
          }
          sortedItems.push(item);
          added = true;
          return false;
        });
        if (!added) break;
      }

      sortedItems.forEach((item) => {
        const parentDepths = item.in?.length
          ? item.in.map((n) => levels[n.id] + 1)
          : [0];

        const depth = Math.max(...parentDepths);
        levels[item.id] = depth;

        const sameDepthNodes = sortedItems.filter(
          (n) => levels[n.id] === depth
        );

        const prevDepthNodes = sortedItems.filter(
          (n) => levels[n.id] === depth - 1
        );
        const avgY = prevDepthNodes.length
          ? prevDepthNodes.reduce((sum, n) => sum + n.position.y, 0) /
            prevDepthNodes.length
          : 0;

        let baseY = avgY;

        const totalNodesInDepth = sameDepthNodes.length;
        const offset =
          totalNodesInDepth <= 1 ? 0 : ((totalNodesInDepth - 1) * spacingY) / 2;

        let posY = baseY - offset + sameDepthNodes.indexOf(item) * spacingY;

        item.position = {
          x: depth * spacingX,
          y: posY,
        };

        minX = Math.min(minX, item.position.x);
        maxX = Math.max(maxX, item.position.x);
        minY = Math.min(minY, item.position.y);
        maxY = Math.max(maxY, item.position.y);
      });

      const centerX =
        (this.$refs.flowChartContainer.clientWidth - (maxX + minX)) / 2;
      const centerY =
        (this.$refs.flowChartContainer.clientHeight - (maxY + minY)) / 2;

      sortedItems.forEach((item) => {
        item.position.x += centerX;
        item.position.y += centerY;
      });

      return sortedItems;
    },

    draw(items) {
      const container = this.$refs.flowChartContainer;
      if (!container) return;

      this.$d3.select(container).selectAll("svg").remove();
      const svg = this.$d3
        .select(container)
        .append("svg")
        .attr("width", container.clientWidth)
        .attr("height", container.clientHeight)
        .call(
          this.$d3
            .zoom()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
              this.zoomTransform = event.transform;
              svg.attr("transform", event.transform);
            })
        )
        .on("dblclick.zoom", (event) => {
          event.preventDefault();
        })
        .append("g");

      if (this.zoomTransform) {
        svg.attr("transform", this.zoomTransform);
      }

      const links = this.createLinks(items);
      this.drawLinks(svg, links);
      this.drawNodes(svg, items);
    },

    redraw() {
      this.draw(this.nodeItems);
    },

    createLinks(items) {
      return items.flatMap((node) =>
        node.out.map((output) => ({
          source: node,
          target: this.findItemById(output.id),
        }))
      );
    },

    drawLinks(svg, links) {
      if (!svg || !links) return;
      svg
        .selectAll(".link")
        .data(links)
        .enter()
        .append("path")
        .attr("class", (d) =>
          d.source?.active && d.target?.active ? "link active" : "link"
        )
        .attr("d", (d) => {
          const { x: sx, y: sy } = d.source.position || { x: 0, y: 0 };
          const { x: tx, y: ty } = d.target.position || { x: 0, y: 0 };
          return `M${sx + 30},${sy} C${sx + 100},${sy} ${tx - 100},${ty} ${
            tx - 30
          },${ty}`;
        })
        .on("click", (event, d) => {
          this.onClickLink(event, d);
        })
        .style("cursor", "pointer");

      // drawNodes 후에 drawLinks를 실행하도록 변경, 하위 코드 주석 해제하면 노드의 IN(●), OUT(▶) 표시
      // svg
      //   .selectAll(".link-start")
      //   .data(links)
      //   .enter()
      //   .append("circle")
      //   .attr("class", "link-start")
      //   .attr("cx", (d) => d.source.position.x + 28)
      //   .attr("cy", (d) => d.source.position.y)
      //   .attr("r", 3)
      //   .attr("fill", "#9ad");
      // svg
      //   .selectAll(".link-end")
      //   .data(links)
      //   .enter()
      //   .append("path")
      //   .attr("class", "link-end")
      //   .attr("d", (d) => {
      //     const x = d.target.position.x - 25;
      //     const y = d.target.position.y;
      //     const width = 6;
      //     const height = 4;
      //     return `M${x - width},${y - height} L${x},${y} L${x - width},${
      //       y + height
      //     } Z`;
      //   })
      //   .attr("fill", "#9ad");
    },

    drawNodes(svg, nodes) {
      const node = svg
        .selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("id", (d) => `node-${d.id}`)
        .attr("transform", (d) => {
          const item = this.findItemById(d.id);
          if (!item.position.x) item.position.x = d.position.x;
          if (!item.position.y) item.position.y = d.position.y;

          return `translate(${item.position.x},${item.position.y})`;
        })
        .on("mouseover", (event, d) => {
          this.onHoverNode(event, d);
        })
        .on("mouseout", (event, d) => {
          this.onHoverNode(event, d);
        })
        .on("click", (event, d) => {
          if (event.detail === 1) {
            this.onClickNode(event, d);
          }
        })
        .on("dblclick", (event, d) => {
          event.stopPropagation();
          this.focusNode(d);
        })
        .call(
          this.$d3.drag().on("drag", this.onDragMove).on("end", this.onDragEnd)
        );

      // 노드 박스
      node
        .append("rect")
        .attr("fill", (d) => this.getNodeColor(d))
        .attr("stroke", "#9ad")
        .attr("width", (d) => this.getNodeWidth(d))
        .attr("height", 30)
        .attr("x", (d) => -this.getNodeWidth(d) / 2)
        .attr("y", -15)
        .attr("rx", 3)
        .attr("ry", 3);

      // 노드 이름
      node
        .append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("font-family", "Pretendard-Medium")
        .style("font-size", "12px")
        .attr("fill", "#eee")
        .text((d) => d.name);

      if (this.selectedNode) {
        const selectedNode = node
          .filter((d) => d.id === this.selectedNode.id)
          .attr(
            "transform",
            (d) =>
              `translate(${this.selectedNode.position.x},${this.selectedNode.position.y})`
          );

        if (!selectedNode) return;

        const squareSize = 6;
        const positions = [
          {
            x: -this.getNodeWidth(this.selectedNode) / 2 - squareSize / 2,
            y: -15 - squareSize / 2,
          },
          {
            x: this.getNodeWidth(this.selectedNode) / 2 - squareSize / 2,
            y: -15 - squareSize / 2,
          },
          {
            x: -this.getNodeWidth(this.selectedNode) / 2 - squareSize / 2,
            y: 15 - squareSize / 2,
          },
          {
            x: this.getNodeWidth(this.selectedNode) / 2 - squareSize / 2,
            y: 15 - squareSize / 2,
          },
        ];

        positions.forEach((pos) => {
          selectedNode
            .append("rect")
            .attr("x", pos.x)
            .attr("y", pos.y)
            .attr("width", squareSize)
            .attr("height", squareSize)
            .attr("fill", "#eee")
            .attr("stroke", "#9ad");
        });
      } else if (this.selectedLink) {
        const { source, target } = this.selectedLink;
        const start = {
          x: (d) => this.getNodeWidth(d) / 2,
          y: 0,
        };
        const end = {
          x: (d) => -this.getNodeWidth(d) / 2,
          y: 0,
        };

        const sourceNode = this.$d3.select(`#node-${source.id}`);
        sourceNode
          .append("circle")
          .attr("class", "link-marker")
          .attr("cx", start.x)
          .attr("cy", start.y)
          .attr("r", 3)
          .attr("stroke", "#9ad")
          .attr("fill", "#fff");

        const targetNode = this.$d3.select(`#node-${target.id}`);
        targetNode
          .append("circle")
          .attr("class", "link-marker")
          .attr("cx", end.x)
          .attr("cy", end.y)
          .attr("r", 3)
          .attr("stroke", "#9ad")
          .attr("fill", "#fff");
      }
    },

    getNodeWidth(d) {
      return this.$utils.getTextWidth(d?.name, `14px Pretendard-Medium`);
    },

    onClickLink(event, d) {
      this.selectedLink = d;
      this.selectedNode = null;
      this.redraw();
    },

    onClickNode(event, d) {
      this.selectedNode = d;
      this.selectedLink = null;
      this.redraw();
    },

    onDragMove(event, d) {
      if (!this.zoomTransform) return;
      this.selectedNode = d;

      const containerRect =
        this.$refs.flowChartContainer.getBoundingClientRect();
      const mouseX =
        (event.sourceEvent.clientX -
          containerRect.left -
          this.zoomTransform.x) /
        this.zoomTransform.k;
      const mouseY =
        (event.sourceEvent.clientY - containerRect.top - this.zoomTransform.y) /
        this.zoomTransform.k;

      if (d.position.x !== mouseX || d.position.y !== mouseY) {
        d.position.x = mouseX;
        d.position.y = mouseY;

        this.redraw();
      }
    },

    onDragEnd(event, d) {
      if (!d?.id) return;
      const updateItem = this.findItemById(d.id);
      if (
        updateItem &&
        (updateItem.position.x !== d.position.x ||
          updateItem.position.y !== d.position.y)
      ) {
        updateItem.position.x = d.position.x;
        updateItem.position.y = d.position.y;
        this.$emit("update", this.nodeItems);
      }
    },

    onHoverNode(event, d) {
      const node = this.$d3.select(`#node-${d.id}`);

      const container = this.$refs.flowChartContainer;
      if (!container) return;
      this.$d3.select(container).selectAll(".hover").remove();

      const nodeRect = node.node().getBoundingClientRect();

      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const offset = 1;
      const hovered =
        mouseX >= nodeRect.left - offset &&
        mouseX <= nodeRect.right + offset &&
        mouseY >= nodeRect.top - offset &&
        mouseY <= nodeRect.bottom + offset;

      if (hovered) {
        event.target.style.cursor = "pointer";
        if (this.selectedNode?.id === d.id) {
          event.target.style.cursor = "move";
        }
        const positions = [
          { cx: (d) => -this.getNodeWidth(d) / 2, cy: 0 },
          { cx: (d) => this.getNodeWidth(d) / 2, cy: 0 },
          { cx: 0, cy: -15 },
          { cx: 0, cy: 15 },
        ];
        positions.forEach(({ cx, cy }) => {
          node
            .append("circle")
            .attr("class", "hover")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", 3)
            .attr("stroke", "#9ad")
            .attr("fill", "#fff")
            .style("cursor", "crosshair")
            .call(
              this.$d3
                .drag()
                .on("drag", (event, d) => {
                  const start = {
                    x: typeof cx === "function" ? cx(d) : cx,
                    y: typeof cy === "function" ? cy(d) : cy,
                  };
                  this.drawNewLink(event, d, start);
                })
                .on("end", this.addNewLink)
            );
        });
      } else {
        this.$d3.select(container).selectAll(".hover").remove();
      }
    },

    drawNewLink(event, d, start = { x: 0, y: 0 }) {
      if (!this.zoomTransform) return;

      const [mouseX, mouseY] = this.$d3.pointer(
        event,
        this.$d3.select(`#node-${d.id}`).node()
      );

      const pathData = `M${start.x},${start.y} L${mouseX},${mouseY}`;

      if (this.newLink) {
        this.newLink.attr("d", pathData);
      } else {
        this.newLink = this.$d3
          .select(`#node-${d.id}`)
          .append("path")
          .attr("class", "new-link")
          .attr("d", pathData)
          .attr("fill", "none")
          .attr("stroke", "#9ad")
          .attr("stroke-dasharray", "5, 5")
          .attr("stroke-width", 2);
      }
    },

    addNewLink(event, d) {
      if (this.newLink) {
        this.newLink = null;
      }

      const container = this.$refs.flowChartContainer;
      const containerRect = container.getBoundingClientRect();
      
      const mouseX =
        (event.sourceEvent.clientX -
          containerRect.left -
          this.zoomTransform.x) /
        this.zoomTransform.k;
      const mouseY =
        (event.sourceEvent.clientY - containerRect.top - this.zoomTransform.y) /
        this.zoomTransform.k;

      const closestNode = this.findClosestNode(mouseX, mouseY);
      if (closestNode) {
        const updateItem = this.findItemById(d.id);
        if (
          updateItem &&
          !updateItem.in.some((input) => input.id === closestNode.id) &&
          !updateItem.out.some((output) => output.id === closestNode.id)
        ) {
          updateItem.out.push(closestNode);
          closestNode.in.push(updateItem);
          this.$emit("update", this.nodeItems);
          return;
        }
      }

      this.$d3.select(container).selectAll(".new-link").remove();
    },

    focusNode(d) {
      if (!d) return;

      const scale = 2;
      const x = d.position.x;
      const y = d.position.y;

      const containerRect =
        this.$refs.flowChartContainer.getBoundingClientRect();

      const translateX = containerRect.width / 2 - x * scale;
      const translateY = containerRect.height / 2 - y * scale;

      const zoom = this.$d3
        .zoom()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => {
          this.zoomTransform = event.transform;
          this.$d3.select("g").attr("transform", event.transform);
        });

      this.$d3
        .select("svg")
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          this.$d3.zoomIdentity.translate(translateX, translateY).scale(scale)
        );
    },

    getNodeColor(d) {
      if (!d.type) return "#333";
      const type = this.types.find((t) => t.name === d.type);
      return type ? type.color : "#333";
    },

    changeType() {
      if (this.selectedNode) {
        const updateItem = this.findItemById(this.selectedNode.id);
        if (updateItem?.type !== this.selectedNode?.type) {
          updateItem.type = this.selectedNode.type;
          this.$emit("update", this.nodeItems);
        }
      }
    },

    rename() {
      if (!this.selectedNode?.name) return;
      const updateItem = this.findItemById(this.selectedNode.id);
      if (updateItem) {
        updateItem.name = this.selectedNode.name;
        this.$emit("update", this.nodeItems);
      }
    },

    updateItem() {
      this.rename();
      this.changeType();
    },

    removeNode() {
      if (!this.selectedNode?.id) return;

      const removeId = this.selectedNode.id;
      this.nodeItems = this.nodeItems.filter((item) => item.id !== removeId);

      this.nodeItems.forEach((item) => {
        item.in = item.in.filter((n) => n.id !== removeId);
        item.out = item.out.filter((n) => n.id !== removeId);
      });
      this.$emit("update", this.nodeItems);
    },

    removeLink() {
      if (!this.selectedLink?.source || !this.selectedLink?.target) return;

      this.nodeItems.forEach((item) => {
        if (item.id === this.selectedLink.target.id) {
          item.in = item.in.filter(
            (input) => input.id !== this.selectedLink.source.id
          );
        } else if (item.id === this.selectedLink.source.id) {
          item.out = item.out.filter(
            (output) => output.id !== this.selectedLink.target.id
          );
        }
      });
      this.$emit("update", this.nodeItems);
    },

    findClosestNode(mouseX, mouseY, threshold = 60) {
      let closestNode = null;
      let minDistance = Infinity;

      for (let node of this.nodeItems) {
        if (node.position.x !== undefined && node.position.y !== undefined) {
          const dx = node.position.x - mouseX;
          const dy = node.position.y - mouseY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < minDistance && distance < threshold) {
            closestNode = node;
            minDistance = distance;
          }
        }
      }
      return closestNode;
    },

    findItemById(id) {
      return this.nodeItems.find((item) => item.id === id);
    },
  },
};
</script>

<style lang="scss">
.flow-chart-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: hidden;

  .link {
    fill: none;
    stroke: #9ad;
    stroke-width: 1px;

    &.active {
      stroke-width: 2px;
      stroke-dasharray: 5, 5;
      stroke-dashoffset: 0;
      animation: dash 1s linear infinite;
    }
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }

  .node text {
    font: 12px sans-serif;
  }
}
</style>
