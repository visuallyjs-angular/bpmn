import {Component, inject, Input} from '@angular/core';
import { VisuallyJsModule, VisuallyJsService } from "@visuallyjs/browser-ui-angular";
import {
    CONNECTOR_TYPE_ORTHOGONAL, DiagramOptions, Group
} from "@visuallyjs/browser-ui"
import {
    getBPMNFlowTypes,
    BPMN2_SHAPES,
    EVENT_TYPES, FLOW_TYPES, LANE, POOL, DATAOBJECT, GROUP, DEFAULT_POOL_HEADER_SIZE
} from "@visuallyjs/bpmn"

import { BpmnInspectorComponent } from "./components/inspector.component";
import { addLaneToPool, computeLaneSizeUpdates, resizeFactory } from "./resize-updater";

@Component({
  selector: 'app-root',
  imports: [VisuallyJsModule, BpmnInspectorComponent],
  templateUrl: './app.html'
})
export class App {

    url="/dataset.json"

  service = inject(VisuallyJsService)

  imageDimensions = [
    {width:3000}, {width:1200}, {width:800}
  ]

  diagramOptions:DiagramOptions = {
    zoomToFit: true,
    shapes: BPMN2_SHAPES,
    edges: {
        connector: {
            type: CONNECTOR_TYPE_ORTHOGONAL,
            options: {
                cornerRadius: 2,
                stub:15
            }
        },
        propertyMappings: getBPMNFlowTypes(),
        showLabels: true,
        labelFont:{
            size:12,
            weight:"bold"
        }
    },
    cells: {
        resize: {
            handlerFactory: resizeFactory
        },
        shouldDeleteGroupMembers: (p: any, el: any) => true,
        font:{
            size:10
        },
        getCollapsedGroupSize:(group: any, currentSize: any) => {
            return {
                height:Math.min(currentSize.height, 100),
                width:currentSize.width
            }
        }
    },
    grid: {
        size: {
            width: 10,
            height: 10
        }
    },
    snapLines:true,
    autoPan:false,
    mediator: {
        canResize: (vertex: any, shape: any, el: any) => vertex.type === POOL || vertex.type === LANE || vertex.type === "group",
        canClone: (vertex: any, shape: any, el: any) => vertex.type !== POOL && vertex.type !== LANE,
        canLink: (vertex: any, shape: any, el: any) => vertex.type !== POOL && vertex.type !== LANE,
        canRotate: (vertex: any, shape: any, el: any) => false,
        canDrag: (vertex: any, shape: any, el: any) => {
            return vertex.type !== "lane"
        },
        canDrop: (candidate: any, target: any, onCanvas: any) => {
            if (candidate.type === LANE) {
                return target != null && target.type === POOL
            }

            if (candidate.type === POOL) {
                return onCanvas === true
            }

            if (onCanvas) {
                return !EVENT_TYPES.includes(candidate.type) && !FLOW_TYPES.includes(candidate.type) && candidate.type !== DATAOBJECT
            }

            return target.type === LANE || target.type === GROUP
        },
        canCollapse(group: any, currentSize: any) {
            if (group.type === POOL) {
                return true
            } else if (group.type === LANE) {
                const lanes = group.group.getMembers()
                const updates = computeLaneSizeUpdates(lanes, group, 100, currentSize.width, group.group.data.headerSize || DEFAULT_POOL_HEADER_SIZE)
                return updates
            } else {
                return false
            }
        },
        canExpand(group: any, currentSize: any) {
            if (group.type === POOL) {
                return true
            } else if (group.type === LANE) {
                const lanes = group.group.getMembers()
                const updates = computeLaneSizeUpdates(lanes, group, currentSize.height, currentSize.width, group.group.data.headerSize || DEFAULT_POOL_HEADER_SIZE)
                return updates
            } else {
                return false
            }
        }
    }
  }

  modelOptions = {
    beforeConnect: (v1: any, v2: any) => {
        return v1.objectType !== Group.objectType && v2.objectType !== Group.objectType
    }
  }

  onVertexAdded = (p: any) => {
    if (p.vertex.type === POOL) {
        const poolHeaderSize = p.vertex.data.headerSize || DEFAULT_POOL_HEADER_SIZE
        p.doModelUpdate((ui: any, model: any) => {
            model.addFactoryGroup(LANE, {
                width: p.vertex.data.width - poolHeaderSize,
                height: p.vertex.data.height,
                group: p.vertex.id,
                title:"Lane"
            })
        })
    } else if (p.vertex.type === LANE) {
        const poolHeaderSize = p.vertex.data.headerSize || DEFAULT_POOL_HEADER_SIZE
        const updates = addLaneToPool(p.vertex, poolHeaderSize)
        p.doModelUpdate((ui: any, model: any) => {
            model.updateVertex(p.vertex, updates[p.vertex.id])
            model.updateVertex(p.vertex.group, updates[p.vertex.group.id])
        })
    }
  }
}
