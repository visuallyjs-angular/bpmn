### BPMN Editor Demo

This demo implements a BPMN (Business Process Model and Notation) editor using VisuallyJS in an Angular application.

#### How it works

The demo uses the `vjs-diagram` component configured with BPMN-specific shapes and logic. It leverages the `@visuallyjs/bpmn` package for shape definitions and BPMN-compliant behavior (like lane/pool management and flow validation).

#### Components Used

- `vjs-diagram`: The main editor canvas.
- `vjs-diagram-palette`: A palette containing BPMN symbols for drag-and-drop.
- `vjs-controls`: Standard zoom and navigation controls.
- `vjs-export-controls`: Controls for exporting the diagram as an image.
- `vjs-miniview`: A thumbnail view for navigating large diagrams.

#### Component Options

The `vjs-diagram` component uses `diagramOptions` and `modelOptions`:
- `shapes`: Set to `BPMN2_SHAPES` to provide BPMN symbols.
- `edges`: Configured with `CONNECTOR_TYPE_ORTHOGONAL` and BPMN flow type mappings.
- `cells`: Custom resize handlers and font settings.
- `mediator`: Complex logic to enforce BPMN rules (e.g., what can be dropped where, which elements can be resized or linked).
- `modelOptions`: Includes a `beforeConnect` hook to validate connections.

The `vjs-diagram-palette` uses `onVertexAdded` to automatically add a lane when a pool is created.

#### Stylesheets

For the VisuallyJS components to render correctly, the following stylesheets must be included in the project (usually in `styles.css`):

```css
@import "@visuallyjs/browser-ui/css/visuallyjs.css";
@import "@visuallyjs/browser-ui-angular/css/visuallyjs-angular.css";
```
