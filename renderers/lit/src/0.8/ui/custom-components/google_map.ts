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

import { html, css, nothing, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { NumberValue, StringValue } from "../../types/primitives.js";
import { A2uiMessageProcessor } from "../../data/model-processor.js";
import { structuralStyles } from "../styles.js";
import { Root } from "../root.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

declare global {
  namespace google.maps {
    class Map { }
    class LatLng { }
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    class Geocoder {
      geocode(
        request: { address: string },
        callback: (results: any[], status: string) => void
      ): void;
    }
  }

  interface HTMLElementTagNameMap {
    "gmp-map": HTMLElement & {
      innerMap: google.maps.Map;
    };
    "gmp-advanced-marker": HTMLElement & {
      position: google.maps.LatLng | google.maps.LatLngLiteral;
    };
  }
}

@customElement("a2ui-google-map")
export class GoogleMap extends Root {
  @property()
  accessor lat: NumberValue | null = null;

  @property()
  accessor lng: NumberValue | null = null;

  @property()
  accessor zoom: NumberValue | null = null;

  @property()
  accessor pinAddresses: StringValue | string[] | null = null;

  @property()
  accessor destinationAddress: StringValue | null = null;

  @property()
  accessor originAddress: StringValue | null = null;

  @query("gmp-map")
  accessor mapElement!: HTMLElement & { innerMap: google.maps.Map };

  #geocoder: google.maps.Geocoder | null = null;
  #markers: HTMLElement[] = [];

  static styles = [
    structuralStyles,
    css`
      :host {
        display: block;
        height: 400px;
        width: 100%;
      }
      gmp-map {
        height: 400px;
        width: 100%;
      }
    `,
  ];

  #resolveNumber(val: NumberValue | null, defaultValue: number): number {
    if (!val) return defaultValue;
    if (typeof val === "number") return val;

    if (typeof val === "object") {
      if ("literalNumber" in val && val.literalNumber !== undefined) {
        return val.literalNumber;
      }
      if ("literal" in val && val.literal !== undefined) {
        return val.literal;
      }
      if ("path" in val && val.path) {
        if (!this.processor || !this.component) {
          return defaultValue;
        }
        const res = this.processor.getData(
          this.component,
          val.path,
          this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID
        );
        if (typeof res === "number") {
          return res;
        }
      }
    }
    return defaultValue;
  }

  #resolveAddresses(): {}[] {
    if (!this.pinAddresses) return [];

    if (Array.isArray(this.pinAddresses)) {
      return this.pinAddresses.map(item => ((item as any).address as string));
    }

    if (typeof this.pinAddresses === "object" && "path" in this.pinAddresses && this.pinAddresses.path) {
      if (!this.processor || !this.component) {
        return [];
      }
      const res = this.processor.getData(
        this.component,
        this.pinAddresses.path,
        this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID
      );
      if (Array.isArray(res)) {
        return res.map(item => (item as any)?.address as string);
      }
    }
    // Handle literal array in StringValue if applicable (though primitives.ts doesn't explicitly show it, data model might mostly use path)
    return [];
  }

  #resolveDestinationAddress(): string | null {
    if (!this.destinationAddress) return null;
    if (typeof this.destinationAddress === "string") return this.destinationAddress;
    if (typeof this.destinationAddress === "object" && "path" in this.destinationAddress && this.destinationAddress.path) {
      if (!this.processor || !this.component) {
        return null;
      }
      const res = this.processor.getData(
        this.component,
        this.destinationAddress.path,
        this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID
      );
      if (typeof res === "string") {
        return res;
      }
    }
    return null;
  }

  #resolveOriginAddress(): string | null {
    if (!this.originAddress) return null;
    if (typeof this.originAddress === "string") return this.originAddress;
    if (typeof this.originAddress === "object" && "path" in this.originAddress && this.originAddress.path) {
      if (!this.processor || !this.component) {
        return null;
      }
      const res = this.processor.getData(
        this.component,
        this.originAddress.path,
        this.surfaceId ?? A2uiMessageProcessor.DEFAULT_SURFACE_ID
      );
      if (typeof res === "string") {
        return res;
      }
    }
    return null;
  }

  protected updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has("pinAddresses") && this.mapElement) {
      this.#updateMarkers();
    }
  }

  async #updateMarkers() {
    if (!this.#geocoder) {
      if (typeof google !== "undefined" && google.maps && google.maps.Geocoder) {
        this.#geocoder = new google.maps.Geocoder();
      } else {
        return; // Geocoder not available
      }
    }

    const addresses = this.#resolveAddresses();
    const destinationAddress = this.#resolveDestinationAddress();

    // Clear existing markers
    this.#markers.forEach(marker => marker.remove());
    this.#markers = [];

    for (const address of addresses as string[]) {
      this.#geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const marker = document.createElement("gmp-advanced-marker");
          marker.position = results[0].geometry.location;
          this.mapElement.appendChild(marker);
          this.#markers.push(marker);
        } else {
          console.warn(`Geocode was not successful for the following reason: ${status}`);
        }
      });
    }

    if (destinationAddress) {
      this.#geocoder.geocode({ address: destinationAddress }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const marker = document.createElement("gmp-advanced-marker");
          marker.position = results[0].geometry.location;
          marker.title = "Destination";
          this.mapElement.appendChild(marker);
          this.#markers.push(marker);
        } else {
          console.warn(`Geocode was not successful for the following reason: ${status}`);
        }
      });
    }
  }

  render() {
    const lat = this.#resolveNumber(this.lat, 0);
    const lng = this.#resolveNumber(this.lng, 0);
    const zoom = this.#resolveNumber(this.zoom, 8);

    // Using any for theme components because GoogleMap is likely not in the core Theme type
    const componentTheme = (this.theme.components as any)?.GoogleMap;
    const classes = {
      ...(componentTheme?.all ?? {}),
    };

    const style = {
      ...((this.theme.additionalStyles as any)?.GoogleMap ?? {
        "height": "400px",
        "width": "100%",
      }),
    };

    return html`
      <section class=${classMap(classes)} style=${styleMap(style)}>
        <gmp-map
          center="${lat},${lng}"
          zoom="${zoom}"
          map-id="DEMO_MAP_ID"
        >
        <gmpx-route-overview
            origin-address="${this.originAddress}"
            destination-address="${this.destinationAddress}"
            travel-mode="transit">
        </gmpx-route-overview>
        </gmp-map>
      </section>
    `;
  }
}
