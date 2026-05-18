window.LEVEL_DEFINITIONS = (() => {
  function createGridLayout(columns, rows, startX, startY, gapX, gapY) {
    const layout = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        layout.push({
          x: startX + column * gapX,
          y: startY + row * gapY
        });
      }
    }

    return layout;
  }

  function rangeIndexes(start, end) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  function gridIndexes(columns, rowStart, rowEnd, columnStart, columnEnd) {
    const indexes = [];

    for (let row = rowStart; row <= rowEnd; row += 1) {
      for (let column = columnStart; column <= columnEnd; column += 1) {
        indexes.push(row * columns + column);
      }
    }

    return indexes;
  }

  function coordsIndexes(columns, coords) {
    return coords.map(([row, column]) => row * columns + column);
  }

  const stageOneLayout = [
    { x: 170, y: 52 },
    { x: 282, y: 52 },
    { x: 394, y: 52 },
    { x: 114, y: 134 },
    { x: 226, y: 134 },
    { x: 338, y: 134 },
    { x: 450, y: 134 },
    { x: 58, y: 216 },
    { x: 170, y: 216 },
    { x: 282, y: 216 },
    { x: 394, y: 216 },
    { x: 506, y: 216 },
    { x: 114, y: 298 },
    { x: 226, y: 298 },
    { x: 338, y: 298 },
    { x: 450, y: 298 },
    { x: 170, y: 380 },
    { x: 282, y: 380 },
    { x: 394, y: 380 }
  ];

  const stageTwoLayout = createGridLayout(10, 8, 18, 18, 54, 56);

  return [
    {
      id: "stage-1",
      name: "Stage 1",
      typeCount: 9,
      copiesPerType: 3,
      undoCount: 1,
      shuffleCount: 1,
      removeCount: 1,
      tileSize: 96,
      boardMinHeight: 540,
      solverMode: "search",
      layout: stageOneLayout,
      layers: [
        { indexes: [0, 1, 2, 4, 5, 6, 8, 9, 10, 14, 16, 17], offsetX: 0, offsetY: 0 },
        { indexes: [3, 4, 5, 8, 9, 10, 13, 14, 15], offsetX: 22, offsetY: 18 },
        { indexes: [4, 8, 9, 10, 14, 17], offsetX: 42, offsetY: 34 }
      ]
    },
    {
      id: "stage-2",
      name: "Stage 2",
      typeCount: 20,
      deckDistribution: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
      deepPriorityTypeIds: ["A16", "A17", "A18", "A19", "A20"],
      undoCount: 1,
      shuffleCount: 0,
      removeCount: 1,
      tileSize: 54,
      boardMinHeight: 380,
      initialViewScaleMultiplier: 1.08,
      solverMode: "heuristic",
      maxGenerationAttempts: 8,
      visibleStrategy: "scatter",
      showBoardGrid: false,
      renderDepthWindow: 2,
      renderVisibleCap: 84,
      blockThresholdRatio: 0.16,
      interactionBlockThresholdRatio: 0.42,
      interactionDeepLayerBonus: 0.08,
      heuristicMinAvailableTiles: 4,
      heuristicMinPairTypes: 2,
      layout: stageTwoLayout,
      layers: [
        {
          indexes: [
            ...gridIndexes(10, 1, 6, 1, 8),
            ...coordsIndexes(10, [
              [0, 3], [0, 4], [0, 5], [0, 6],
              [1, 0], [1, 9],
              [2, 0], [2, 9],
              [3, 0], [3, 9],
              [4, 0], [4, 9],
              [5, 0], [5, 9],
              [6, 0], [6, 9],
              [7, 3], [7, 4], [7, 5], [7, 6]
            ])
          ],
          offsetX: 0,
          offsetY: 0
        },
        {
          indexes: [
            ...gridIndexes(10, 1, 6, 2, 8),
            ...coordsIndexes(10, [
              [0, 4], [0, 5],
              [7, 4], [7, 5]
            ])
          ],
          offsetX: 8,
          offsetY: 6
        },
        {
          indexes: [
            ...gridIndexes(10, 2, 5, 2, 7),
            ...coordsIndexes(10, [
              [1, 3], [1, 4], [1, 5], [1, 6],
              [2, 1], [2, 8],
              [3, 1], [3, 8],
              [4, 1], [4, 8],
              [5, 1], [5, 8],
              [6, 3], [6, 6]
            ])
          ],
          offsetX: -4,
          offsetY: 14
        },
        {
          indexes: [
            ...gridIndexes(10, 2, 5, 3, 6),
            ...coordsIndexes(10, [
              [1, 4], [1, 5],
              [2, 2], [2, 7],
              [3, 2], [3, 7],
              [4, 2], [4, 7],
              [6, 4], [6, 5]
            ])
          ],
          offsetX: 10,
          offsetY: 20
        },
        {
          indexes: [
            ...gridIndexes(10, 3, 5, 3, 6),
            ...coordsIndexes(10, [
              [2, 4], [2, 5],
              [6, 4]
            ])
          ],
          offsetX: 4,
          offsetY: 28
        },
        {
          indexes: [
            ...gridIndexes(10, 3, 5, 4, 6),
            ...coordsIndexes(10, [
              [2, 5],
              [4, 2],
              [5, 7],
              [6, 5]
            ])
          ],
          offsetX: 14,
          offsetY: 34
        },
        {
          indexes: coordsIndexes(10, [
            [0, 0], [0, 1],
            [0, 8], [0, 9]
          ]),
          offsetX: -8,
          offsetY: 8
        }
      ]
    }
  ];
})();
