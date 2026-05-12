import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InspectorComponent, VisuallyJsModule } from "@visuallyjs/browser-ui-angular";
import { Node, Group, Edge } from "@visuallyjs/browser-ui";
import {
    POOL,
    LANE,
    TASK,
    GATEWAY,
    GATEWAY_TYPES,
    TASK_TYPES,
    MARKER_TYPES,
    EVENT_TYPES,
    INTERMEDIATE_EVENT,
    INTERMEDIATE_EVENT_TYPES,
    START_EVENT_TYPES,
    END_EVENT_TYPES,
    END_EVENT,
    START_EVENT
} from "@visuallyjs/bpmn";

@Component({
  selector: 'app-inspector',
  template: `
    <div class="vjs-bpmn-inspector">
        @if(currentObj) {
            @if(isPoolOrLane(currentObj)) {
                <div class="vjs-inspector-section">
                    <div>Title</div>
                    <input type="text" vjs-att="title" vjs-focus="true" placeholder="Title"/>
                </div>
                <div class="vjs-inspector-section">
                    <h4>Header</h4>
                    <div>Fill</div>
                    <vjs-color-picker propertyName="headerFill"></vjs-color-picker>
                    <div>Text color</div>
                    <vjs-color-picker propertyName="headerColor"></vjs-color-picker>
                </div>
                <div class="vjs-inspector-section">
                    <h4>Body</h4>
                    <div>Fill</div>
                    <vjs-color-picker propertyName="fill"></vjs-color-picker>
                    <div>Outline</div>
                    <vjs-color-picker propertyName="outline"></vjs-color-picker>
                </div>
            }

            @if(isTask(currentObj)) {
                <div class="vjs-inspector-section">
                    <h4>Label</h4>
                    <input type="text" vjs-att="label" vjs-focus="true" placeholder="Label"/>
                </div>
                <div class="vjs-inspector-section">
                    <h3>Color</h3>
                    <div>Fill</div>
                    <vjs-color-picker propertyName="fill" [maxColors]="3"></vjs-color-picker>
                    <div>Outline</div>
                    <vjs-color-picker propertyName="outline" [maxColors]="3"></vjs-color-picker>
                    <div>Text</div>
                    <vjs-color-picker propertyName="color" [maxColors]="3"></vjs-color-picker>
                </div>
                <div class="vjs-inspector-section">
                    <h4>Task Type</h4>
                    @for(t of TASK_TYPES; track t) {
                        <label style="display:flex; align-items:center">
                            <vjs-bpmn-icon [icon-id]="t" [width]="20" [height]="20"></vjs-bpmn-icon>
                            <input type="radio" vjs-att="taskType" [value]="t" name="taskType" />
                            <span>{{ capitalise(t) }}</span>
                        </label>
                    }
                </div>
                <div class="vjs-inspector-section">
                    <h4>Markers</h4>
                    @for(t of MARKER_TYPES; track t) {
                        <label style="display:flex; align-items:center">
                            <vjs-bpmn-icon [icon-id]="t" [width]="20" [height]="20"></vjs-bpmn-icon>
                            <input type="checkbox" vjs-att="markers" [value]="t" />
                            <span>{{ markerName(t) }}</span>
                        </label>
                    }
                </div>
            }

            @if(isGateway(currentObj)) {
                <div class="vjs-inspector-section">
                    <h4>Label</h4>
                    <input type="text" vjs-att="label" vjs-focus="true" placeholder="Label"/>
                </div>
                <div class="vjs-inspector-section">
                    <h3>Color</h3>
                    <div>Fill</div>
                    <vjs-color-picker propertyName="fill" [maxColors]="3"></vjs-color-picker>
                </div>
                <div class="vjs-inspector-section">
                    <h3>Type</h3>
                    @for(t of GATEWAY_TYPES; track t) {
                        <label style="display:flex; align-items:center">
                            <vjs-bpmn-icon [icon-id]="t" [width]="20" [height]="20"></vjs-bpmn-icon>
                            <input type="radio" vjs-att="gatewayType" [value]="t" name="gatewayType" />
                            <span>{{ capitalise(t) }}</span>
                        </label>
                    }
                </div>
            }

            @if(isEvent(currentObj)) {
                <div class="vjs-inspector-section">
                    <h3>Color</h3>
                    <div>Fill</div>
                    <vjs-color-picker propertyName="fill" [maxColors]="3"></vjs-color-picker>
                    <div>Outline</div>
                    <vjs-color-picker propertyName="outline" [maxColors]="3"></vjs-color-picker>
                </div>
                <div class="vjs-inspector-section">
                    <h3>Type</h3>
                    @if(currentObj.data.type === INTERMEDIATE_EVENT) {
                        @for(t of INTERMEDIATE_EVENT_TYPES; track t) {
                            <label style="display:flex; align-items:center">
                                <vjs-bpmn-icon [icon-id]="t" [width]="20" [height]="20"></vjs-bpmn-icon>
                                <input type="radio" vjs-att="eventType" name="eventType" [value]="t" />
                                <span>{{ eventName(t) }}</span>
                            </label>
                        }
                    }
                    @if(currentObj.data.type === START_EVENT) {
                        @for(t of START_EVENT_TYPES; track t) {
                            <label style="display:flex; align-items:center">
                                <vjs-bpmn-icon [icon-id]="t" [width]="20" [height]="20"></vjs-bpmn-icon>
                                <input type="radio" vjs-att="eventType" name="eventType" [value]="t" />
                                <span>{{ eventName(t) }}</span>
                            </label>
                        }
                    }
                    @if(currentObj.data.type === END_EVENT) {
                        @for(t of END_EVENT_TYPES; track t) {
                            <label style="display:flex; align-items:center">
                                <vjs-bpmn-icon [icon-id]="t" [width]="20" [height]="20"></vjs-bpmn-icon>
                                <input type="radio" vjs-att="eventType" name="eventType" [value]="t" />
                                <span>{{ eventName(t) }}</span>
                            </label>
                        }
                    }
                </div>
            }

            @if(currentObj.objectType === 'Edge') {
                <div class="vjs-inspector-section">
                    <div>Label</div>
                    <input type="text" vjs-att="label"/>
                </div>
                <div class="vjs-inspector-section">
                    <div>Line style</div>
                    <vjs-edge-type-picker propertyName="type"></vjs-edge-type-picker>
                </div>
            }
        }
    </div>`,
  standalone: true,
  imports: [CommonModule, VisuallyJsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BpmnInspectorComponent extends InspectorComponent {
    TASK_TYPES = TASK_TYPES;
    MARKER_TYPES = MARKER_TYPES;
    GATEWAY_TYPES = GATEWAY_TYPES;
    INTERMEDIATE_EVENT = INTERMEDIATE_EVENT;
    INTERMEDIATE_EVENT_TYPES = INTERMEDIATE_EVENT_TYPES;
    START_EVENT = START_EVENT;
    START_EVENT_TYPES = START_EVENT_TYPES;
    END_EVENT = END_EVENT;
    END_EVENT_TYPES = END_EVENT_TYPES;

    capitalise(id: string) {
        return id[0].toUpperCase() + id.substring(1);
    }

    markerName(id: string) {
        return this.capitalise(id.split("-")[0]);
    }

    eventName(id: string) {
        return id.split("-").map(s => this.capitalise(s)).join(" ");
    }

    isGroup(obj: any) { return obj && obj.objectType === Group.objectType; }
    isPoolOrLane(obj: any) { return this.isGroup(obj) && (obj.type === POOL || obj.type === LANE); }
    isTask(obj: any) { return obj && obj.objectType === Node.objectType && obj.type === TASK; }
    isGateway(obj: any) { return obj && obj.objectType === Node.objectType && obj.type === GATEWAY; }
    isEvent(obj: any) { return obj && obj.objectType === Node.objectType && EVENT_TYPES.includes(obj.type); }
}
