/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { html, css, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { StringValue } from "../../types/primitives.js";
import { A2uiMessageProcessor } from "../../data/model-processor.js";
import { structuralStyles } from "../styles.js";
import { Root } from "../root.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

declare global {
    interface HTMLElementTagNameMap {
        "gmpx-place-details-compact": HTMLElement & {
            place: string | object | null;
        };
    }
}

@customElement("a2ui-place-card")
export class PlaceCard extends Root {
    @property()
    accessor placeId: StringValue | null = null;

    static styles = [
        structuralStyles,
        css`
      :host {
        display: block;
        width: 100%;
      }
    `,
    ];

    #resolvePlaceId(): string | null {
        if (!this.placeId) return null;
        if (typeof this.placeId === "string") return this.placeId;
        if (typeof this.placeId === "object" && "path" in this.placeId && this.placeId.path) {
            if (!this.processor || !this.component) {
                return null;
            }
            const res = this.processor.getData(
                this.component,
                this.placeId.path,
                this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID
            );
            if (typeof res === "string") {
                return res;
            }
        } else if (typeof this.placeId === "object" && "literal" in this.placeId && this.placeId.literal) {
            return this.placeId.literal;
        }
        return null;
    }

    render() {
        const placeId = this.#resolvePlaceId();

        // Using any for theme components because PlaceCard is likely not in the core Theme type
        const componentTheme = (this.theme.components as any)?.PlaceCard;
        const classes = {
            ...(componentTheme?.all ?? {}),
        };

        const style = {
            ...((this.theme.additionalStyles as any)?.PlaceCard ?? {
                "width": "100%",
            }),
        };

        if (!placeId) {
            return nothing;
        }

        return html`
      <section class=${classMap(classes)} style=${styleMap(style)}>
        <gmp-place-details-compact orientation="horizontal" place="${placeId}">
            <gmp-place-details-place-request place="${placeId}"></gmp-place-details-place-request>
            <gmp-place-all-content></gmp-place-all-content>
        </gmp-place-details-compact>
      </section>
    `;
    }
}
