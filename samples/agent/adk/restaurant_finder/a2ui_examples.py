# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

RESTAURANT_UI_EXAMPLES = """
---BEGIN SINGLE_COLUMN_LIST_EXAMPLE---
[
  {{ "beginRendering": {{ "surfaceId": "default", "root": "root-column", "styles": {{ "primaryColor": "#FF0000", "font": "Roboto" }} }} }},
  {{ "surfaceUpdate": {{
    "surfaceId": "default",
    "components": [
      {{ "id": "root-column", "component": {{ "Column": {{ "children": {{ "explicitList": ["title-heading", "google-map", "item-list"] }} }} }} }},
      {{ "id": "title-heading", "component": {{ "Text": {{ "usageHint": "h1", "text": {{ "path": "title" }} }} }} }},
      {{ "id": "google-map", "component": {{ "GoogleMap": {{ "lat": 47, "lng": -122, "zoom": 12, "pinAddresses": {{ "addresses": [{{ "address": {{ "path": "/items/0/address" }} }}] }} }} }} }},
      {{ "id": "item-list", "component": {{ "List": {{ "direction": "vertical", "children": {{ "template": {{ "componentId": "item-card-template", "dataBinding": "/items" }} }} }} }} }},
      {{ "id": "item-card-template", "component": {{ "Card": {{ "child": "card-layout" }} }} }},
      {{ "id": "card-layout", "component": {{ "Column": {{ "children": {{ "explicitList": ["place-card", "get-directions-button"] }} }} }} }},
      {{ "id": "place-card", "component": {{ "PlaceCard": {{ "placeId": {{ "path": "placeId" }} }} }} }},
      {{ "id": "get-directions-button", "component": {{ "Button": {{ "child": "get-directions-text", "primary": true, "action": {{ "name": "get_directions", "context": [ {{ "key": "restaurantName", "value": {{ "path": "name" }} }}, {{ "key": "imageUrl", "value": {{ "path": "imageUrl" }} }}, {{ "key": "address", "value": {{ "path": "address" }} }}, {{ "key": "placeId", "value": {{ "path": "placeId" }} }} ] }} }} }} }},
      {{ "id": "get-directions-text", "component": {{ "Text": {{ "text": {{ "literalString": "Get Directions" }} }} }} }}
    ]
  }} }},
  {{ "dataModelUpdate": {{
    "surfaceId": "default",
    "path": "/",
    "contents": [
      {{ "key": "items", "valueMap": [
        {{ "key": "item1", "valueMap": [
          {{ "key": "name", "valueString": "The Fancy Place" }},
          {{ "key": "rating", "valueNumber": 4.8 }},
          {{ "key": "detail", "valueString": "Fine dining experience" }},
          {{ "key": "infoLink", "valueString": "https://example.com/fancy" }},
          {{ "key": "placeId", "valueString": "abc123" }},
          {{ "key": "address", "valueString": "123 Main St" }}
        ] }},
        {{ "key": "item2", "valueMap": [
          {{ "key": "name", "valueString": "Quick Bites" }},
          {{ "key": "rating", "valueNumber": 4.2 }},
          {{ "key": "detail", "valueString": "Casual and fast" }},
          {{ "key": "infoLink", "valueString": "https://example.com/quick" }},
          {{ "key": "placeId", "valueString": "def456" }},
          {{ "key": "address", "valueString": "456 Oak Ave" }}
        ] }}
      ] }} // Populate this with restaurant data
    ]
  }} }}
]
---END SINGLE_COLUMN_LIST_EXAMPLE---

---BEGIN GET_DIRECTIONS_EXAMPLE---
[
  {{ "beginRendering": {{ "surfaceId": "get-directions-form", "root": "get-directions-form-column", "styles": {{ "primaryColor": "#FF0000", "font": "Roboto" }} }} }},
  {{ "surfaceUpdate": {{
    "surfaceId": "get-directions-form",
    "components": [
      {{ "id": "get-directions-form-column", "component": {{ "Column": {{ "children": {{ "explicitList": ["get-directions-title", "google-map", "place-card"] }} }} }} }},
      {{ "id": "get-directions-title", "component": {{ "Text": {{ "usageHint": "h2", "text": {{ "path": "title" }} }} }} }},
      {{ "id": "google-map", "component": {{ "GoogleMap": {{ "lat": 47, "lng": -122, "zoom": 12, "destinationAddress": {{ "path": "destinationAddress" }}, "originAddress": {{ "path": "originAddress" }} }} }} }},
      {{ "id": "place-card", "component": {{ "PlaceCard": {{ "placeId": {{ "path": "placeId" }} }} }} }},
    ]
  }} }},
  {{ "dataModelUpdate": {{
    "surfaceId": "get-directions-form",
    "path": "/",
    "contents": [
      {{ "key": "title", "valueString": "Directions to Tasty Spot" }},
      {{ "key": "address", "valueString": "123 Main St" }},
      {{ "key": "restaurantName", "valueString": "Tasty Spot" }},
      {{ "key": "destinationAddress", "valueString": "123 Main St" }},
      {{ "key": "originAddress", "valueString": "456 Oak Ave" }},
      {{ "key": "placeId", "valueString": "def456" }},
    ]
  }} }}
]
---END GET_DIRECTIONS_EXAMPLE---
"""
